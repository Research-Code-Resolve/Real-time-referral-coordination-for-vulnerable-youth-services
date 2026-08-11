/**
 * Normalize referral objects from the backend to a consistent shape for display.
 * The API contract specifies the backend returns fields like id, youth_name,
 * service_needed, referring/receiving_organisation_name, priority, status,
 * created_at, updated_at — this maps them for display.
 */
function pick(obj, keys, fallback = "") {
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null && obj[k] !== "") return obj[k];
  }
  return fallback;
}

export function normalizeReferral(raw) {
  return {
    id: raw.id,
    // Use 'id' as Case ID per contract: "Use `id` as the 'Case ID' shown on screen (e.g. display as `Case #1`)"
    caseId: `Case #${raw.id}`,
    youthName: pick(raw, ["youth_name", "youth"], ""),
    youthId: pick(raw, ["youth", "youth_id"]),
    service: pick(raw, ["service_needed"], "—"),
    referringOrganisation: pick(
      raw,
      ["referring_organisation_name", "referring_organisation"],
      "—"
    ),
    receivingOrganisation: pick(
      raw,
      ["receiving_organisation_name", "receiving_organisation"],
      "—"
    ),
    priority: pick(raw, ["priority"], "Medium"),
    status: pick(raw, ["status"], "Submitted"),
    createdAt: raw.created_at || "",
    updatedAt: raw.updated_at || "",
    notes: pick(raw, ["notes"], ""),
    raw,
  };
}

export function computeSummary(referrals) {
  const isOpen = (r) =>
    ["submitted", "received", "accepted", "appointment scheduled", "client arrived", "service in progress"].includes(
      r.status.toLowerCase()
    );
  const isUrgent = (r) =>
    (r.priority === "Emergency" || r.priority === "High") && isOpen(r);
  const isClosed = (r) => r.status.toLowerCase() === "closed";

  return {
    active: referrals.filter(isOpen).length,
    urgent: referrals.filter(isUrgent).length,
    closed: referrals.filter(isClosed).length,
  };
}

export function sortByRecentActivity(referrals) {
  return [...referrals].sort((a, b) => {
    const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
    return bTime - aTime;
  });
}
