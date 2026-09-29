// ===============================
// SISTEMA GLOBAL DE SAVE COM SUPORTE A BACKEND
// - tenta usar API em http://localhost:3000
// - se não disponível, mantém fallback em localStorage
// ===============================

const SAVE_PREFIX = "tcc_user_";
const CURRENT_USER_KEY = "tcc_currentUser";
const TOKEN_KEY = "tcc_token";
const SERVER_URL = window.SERVER_URL || "http://localhost:3000";

function getSaveKey(username) {
  return SAVE_PREFIX + username.toLowerCase();
}

function getCurrentUser() {
  return localStorage.getItem(CURRENT_USER_KEY);
}

function setCurrentUser(username) {
  if (username) {
    localStorage.setItem(CURRENT_USER_KEY, username.toLowerCase());
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(t) {
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
}

function getUserDataLocal(username) {
  if (!username) return null;
  const raw = localStorage.getItem(getSaveKey(username));
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveUserDataLocal(username, data) {
  if (!username || !data) return;
  localStorage.setItem(getSaveKey(username), JSON.stringify(data));
}

async function tryFetch(path, options) {
  try {
    const res = await fetch(SERVER_URL + path, options);
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      return { ok: false, status: res.status, json };
    }
    const json = await res.json().catch(() => ({}));
    return { ok: true, status: res.status, json };
  } catch (err) {
    return { ok: false, error: err };
  }
}

async function registerUser(username, password) {
  username = (username || "").trim();
  password = (password || "").trim();
  if (!username || !password) return { success: false, message: "Digite usuário e senha." };

  // Tenta API
  const res = await tryFetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  if (res.ok && res.json && res.json.success) {
    setToken(res.json.token);
    setCurrentUser(res.json.username);
    return { success: true };
  }

  // Fallback local
  if (getUserDataLocal(username)) return { success: false, message: 'Usuário já existe. Faça login.' };
  saveUserDataLocal(username, { password, faseAtual: 1, pontos: 0 });
  setCurrentUser(username);
  return { success: true };
}

async function loginUser(username, password) {
  username = (username || "").trim();
  password = (password || "").trim();
  if (!username || !password) return { success: false, message: "Digite usuário e senha." };

  const res = await tryFetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  if (res.ok && res.json && res.json.success) {
    setToken(res.json.token);
    setCurrentUser(res.json.username);
    return { success: true, data: { faseAtual: res.json.faseAtual, pontos: res.json.pontos } };
  }

  // Fallback local
  const data = getUserDataLocal(username);
  if (!data) return { success: false, message: 'Usuário não encontrado. Cadastre-se.' };
  if (data.password !== password) return { success: false, message: 'Senha incorreta.' };
  setCurrentUser(username);
  return { success: true, data };
}

function logoutUser() {
  setCurrentUser(null);
  setToken(null);
}

async function addPointsToActiveUser(value) {
  const user = getCurrentUser();
  if (!user) {
    const fallback = parseInt(localStorage.getItem('pontos') || '0');
    localStorage.setItem('pontos', (fallback + value).toString());
    return;
  }

  // Try server
  const token = getToken();
  if (token) {
    // get current progress then update
    const progress = await tryFetch('/api/progress', { headers: { Authorization: 'Bearer ' + token } });
    if (progress.ok && progress.json && progress.json.success) {
      const newPoints = Math.max(0, (progress.json.pontos || 0) + value);
      await tryFetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ faseAtual: progress.json.faseAtual, pontos: newPoints })
      });
      return;
    }
  }

  // Fallback local
  const data = getUserDataLocal(user);
  if (!data) return;
  data.pontos = Math.max(0, (data.pontos || 0) + value);
  saveUserDataLocal(user, data);
}

async function getActivePoints() {
  const user = getCurrentUser();
  const token = getToken();
  if (user && token) {
    const progress = await tryFetch('/api/progress', { headers: { Authorization: 'Bearer ' + token } });
    if (progress.ok && progress.json && progress.json.success) return parseInt(progress.json.pontos || 0);
  }
  if (!user) return parseInt(localStorage.getItem('pontos') || '0');
  const data = getUserDataLocal(user);
  return data ? parseInt(data.pontos || 0) : 0;
}

async function getActivePhase() {
  const user = getCurrentUser();
  const token = getToken();
  if (user && token) {
    const progress = await tryFetch('/api/progress', { headers: { Authorization: 'Bearer ' + token } });
    if (progress.ok && progress.json && progress.json.success) return parseInt(progress.json.faseAtual || 1);
  }
  if (!user) return parseInt(localStorage.getItem('faseAtual') || '1');
  const data = getUserDataLocal(user);
  return data ? parseInt(data.faseAtual || 1) : 1;
}

async function updateActivePhase(fase) {
  const user = getCurrentUser();
  if (!user) {
    localStorage.setItem('faseAtual', fase.toString());
    return;
  }
  const token = getToken();
  if (token) {
    const progress = await tryFetch('/api/progress', { headers: { Authorization: 'Bearer ' + token } });
    if (progress.ok && progress.json && progress.json.success) {
      await tryFetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ faseAtual: fase, pontos: progress.json.pontos })
      });
      return;
    }
  }
  const data = getUserDataLocal(user);
  if (!data) return;
  data.faseAtual = fase;
  saveUserDataLocal(user, data);
}

function resetActiveSave() {
  const user = getCurrentUser();
  if (user) {
    const data = getUserDataLocal(user);
    if (!data) return;
    data.faseAtual = 1;
    data.pontos = 0;
    saveUserDataLocal(user, data);
    // try server but don't await
    const token = getToken();
    if (token) {
      tryFetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ faseAtual: 1, pontos: 0 })
      });
    }
    return;
  }
  localStorage.removeItem('faseAtual');
  localStorage.removeItem('pontos');
}

window.SaveSystem = {
  getCurrentUser,
  registerUser,
  loginUser,
  logoutUser,
  getActivePhase,
  updateActivePhase,
  addPointsToActiveUser,
  getActivePoints,
  resetActiveSave,
  // Compatibilidade com nomes em português usados em outros scripts
  atualizarFase: updateActivePhase,
  salvarFase: updateActivePhase,
  adicionarPontos: addPointsToActiveUser,
  obterPontos: getActivePoints,
  obterFaseAtual: getActivePhase
};
