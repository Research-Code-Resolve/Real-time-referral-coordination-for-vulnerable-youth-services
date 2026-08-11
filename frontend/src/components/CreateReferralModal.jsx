import { useState, useEffect } from "react";
import Modal from "./Modal.jsx";
import { api, ApiError } from "../lib/api.js";
import { Loader2, AlertCircle } from "lucide-react";

/**
 * Per API contract:
 * - POST /api/referrals/ with: youth, referring_organisation, receiving_organisation,
 *   service_needed, priority (Low/Medium/High/Emergency), notes (optional)
 * - referring_organisation: Social Worker uses their me.organisation_id.
 *   Super Admin must select it since their organisation_id is null.
 */
export default function CreateReferralModal({
  onClose,
  onCreated,
  me,
  prefilledYouthId,
  prefilledOrganisationId,
}) {
  const isSuperAdmin = me?.role === "SUPER_ADMIN";
  
  const [form, setForm] = useState({
    youth: prefilledYouthId || "",
    referring_organisation: isSuperAdmin ? "" : me?.organisation_id || "",
    receiving_organisation: prefilledOrganisationId || "",
    service_needed: "",
    priority: "Medium",
    notes: "",
  });
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [organisations, setOrganisations] = useState([]);
  const [youth, setYouth] = useState([]);

  useEffect(() => {
    Promise.all([api.listYouth(), api.listOrganisations()])
      .then(([youthList, orgList]) => {
        setYouth(Array.isArray(youthList) ? youthList : []);
        setOrganisations(Array.isArray(orgList) ? orgList : []);
      })
      .catch((err) => {
        console.error("Failed to load options:", err);
      });
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("saving");
    setErrorMsg("");

    const required = [form.youth, form.receiving_organisation, form.service_needed];
    if (isSuperAdmin) required.push(form.referring_organisation);
    
    if (required.some((v) => !v)) {
      setStatus("error");
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (form.referring_organisation === form.receiving_organisation) {
      setStatus("error");
      setErrorMsg("Referring and receiving organisations must be different.");
      return;
    }

    try {
      const payload = {
        youth: parseInt(form.youth, 10),
        referring_organisation: parseInt(form.referring_organisation, 10),
        receiving_organisation: parseInt(form.receiving_organisation, 10),
        service_needed: form.service_needed,
        priority: form.priority,
        notes: form.notes || undefined,
      };
      const created = await api.createReferral(payload);
      onCreated(created);
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof ApiError
          ? err.message
          : "Something went wrong creating the referral."
      );
    }
  }

  return (
    <Modal title="Create referral" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Youth / Case">
          <select
            required
            value={form.youth}
            onChange={(e) => update("youth", e.target.value)}
            className="input"
          >
            <option value="">Select a youth case…</option>
            {youth.map((y) => (
              <option key={y.id} value={y.id}>
                {y.full_name} (ID: {y.id}) — {y.primary_need}
              </option>
            ))}
          </select>
        </Field>

        {isSuperAdmin && (
          <Field label="Referring organisation">
            <select
              required
              value={form.referring_organisation}
              onChange={(e) => update("referring_organisation", e.target.value)}
              className="input"
            >
              <option value="">Select your organisation…</option>
              {organisations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </Field>
        )}

        <Field label="Receiving organisation">
          <select
            required
            value={form.receiving_organisation}
            onChange={(e) => update("receiving_organisation", e.target.value)}
            className="input"
          >
            <option value="">Select an organisation…</option>
            {organisations
              .filter((org) => org.id !== parseInt(form.referring_organisation, 10))
              .map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name} — {org.category}
                </option>
              ))}
          </select>
        </Field>

        <Field label="Service needed">
          <input
            required
            type="text"
            value={form.service_needed}
            onChange={(e) => update("service_needed", e.target.value)}
            placeholder="e.g. Emergency shelter"
            className="input"
          />
        </Field>

        <Field label="Priority">
          <select
            value={form.priority}
            onChange={(e) => update("priority", e.target.value)}
            className="input"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Emergency">Urgent</option>
          </select>
        </Field>

        <Field label="Notes (optional)">
          <textarea
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            rows={3}
            className="input resize-none"
            placeholder="Any additional context for the receiving organisation…"
          />
        </Field>

        {status === "error" && (
          <div className="flex items-start gap-2 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={status === "saving"}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 hover:bg-slate-800 disabled:opacity-70 text-white font-medium py-3 transition"
          >
            {status === "saving" && <Loader2 className="h-4 w-4 animate-spin" />}
            {status === "saving" ? "Creating…" : "Create referral"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 text-slate-600 font-medium px-5 py-3 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
