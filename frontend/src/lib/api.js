const API_BASE_URL = "http://127.0.0.1:8000/api";

export function buildApiUrl(path) {
  return `${API_BASE_URL}${path}`;
}

export function buildBasicAuthHeader(username, password) {
  return `Basic ${btoa(`${username}:${password}`)}`;
}

export function saveCredentials(username, password) {
  sessionStorage.setItem("authHeader", buildBasicAuthHeader(username, password));
}

export function getStoredCredentials() {
  return sessionStorage.getItem("authHeader");
}