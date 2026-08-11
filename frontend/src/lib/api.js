export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getStoredAuthHeader() {
  return sessionStorage.getItem("authHeader");
}

export function clearSession() {
  sessionStorage.removeItem("authHeader");
  sessionStorage.removeItem("me");
}
function announceSessionExpired() {
  window.dispatchEvent(new Event("swconnect:session-expired"));
}

export async function apiFetch(path, options = {}) {
  const authHeader = getStoredAuthHeader();
  const headers = { ...(options.headers || {}) };
  if (authHeader) headers.Authorization = authHeader;
  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  let res;
  try {
    res = await fetch(`/api${path}`, { ...options, headers });
  } catch (err) {
    throw new ApiError(
      "Couldn't reach the server. Is the backend running on localhost:8000?",
      0
    );
  }

  if (res.status === 401) {
    const hadSession = !!authHeader;
    clearSession();
    if (hadSession) announceSessionExpired();
    throw new ApiError("Invalid email or password.", 401);
  }

  if (res.status === 403) {
    throw new ApiError(
      "You don't have permission to do that.",
      403
    );
  }

  if (!res.ok) {
    let detail = `Unexpected error (${res.status}).`;
    try {
      const body = await res.json();
      if (body?.detail) detail = body.detail;
    } catch {
      /* body wasn't JSON — keep the generic message */
    }
    throw new ApiError(detail, res.status);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  // Auth
  me: () => apiFetch("/me/"),

  // Youth / Cases
  listYouth: () => apiFetch("/youth/"),
  getYouth: (id) => apiFetch(`/youth/${id}/`),
  registerYouth: (payload) =>
    apiFetch("/youth/", { method: "POST", body: JSON.stringify(payload) }),
  updateYouth: (id, payload) =>
    apiFetch(`/youth/${id}/`, { method: "PUT", body: JSON.stringify(payload) }),

  // Organisations
  listOrganisations: () => apiFetch("/organisations/"),
  getOrganisation: (id) => apiFetch(`/organisations/${id}/`),

  // Referrals
  listReferrals: () => apiFetch("/referrals/"),
  getReferral: (id) => apiFetch(`/referrals/${id}/`),
  createReferral: (payload) =>
    apiFetch("/referrals/", { method: "POST", body: JSON.stringify(payload) }),
  patchReferralStatus: (id, status) =>
    apiFetch(`/referrals/${id}/status/`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  // Referral Notes
  getReferralNotes: (id) => apiFetch(`/referrals/${id}/notes/`),
  addReferralNote: (id, text) =>
    apiFetch(`/referrals/${id}/notes/`, {
      method: "POST",
      body: JSON.stringify({ text }),
    }),

  // Notifications
  listNotifications: () => apiFetch("/notifications/"),
  markNotificationRead: (id) =>
    apiFetch(`/notifications/${id}/`, {
      method: "PATCH",
      body: JSON.stringify({ is_read: true }),
    }),
};
