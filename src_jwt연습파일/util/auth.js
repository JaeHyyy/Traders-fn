export function getAuthToken() {
  const token = localStorage.getItem('jwtAuthToken');
  return token;
}

export function tokenLoader() {
  return getAuthToken();
}

export function setAuthToken(token) {
  localStorage.setItem('jwtAuthToken', token);
}

export function removeAuthToken() {
  localStorage.removeItem('jwtAuthToken');
}