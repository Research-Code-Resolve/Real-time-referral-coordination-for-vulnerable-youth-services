import { useState } from "react";
import Modal from "./Modal.jsx";
import { api, ApiError } from "../lib/api.js";
import { Loader2 } from "lucide-react";

const GENDER_OPTIONS = ["Male", "Female", "Other"];
const PRIORITY_OPTIONS = ["Low", "Medium", "High", "Emergency"];

// Note: the screen spec's registration field list omits "name", but the
// backend requires full_name — included here since it's needed to save.
export default function RegisterYouthModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    full_name: "",
    age: "",
    gender: "Female",
    location: "",
    primary_need: "",
    immediate_needs: "",
    priority: "Medium",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.full_name || !form.age || !form.location || !form.primary_need) {
      setError("Please fill in name, age, location, and presenting problem.");
      return;
    }
    setSaving(true);
    try {
      const created = await api.registerYouth({ ...form, age: Number(form.age) });
      onCreated(created);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't register this case.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title="Register Youth" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Full name">
          <input
            className="input"
            value={form.full_name}
            onChange={(e) => update("full_name", e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Age">
            <input
              type="number"
              min="0"
              max="24"
              className="input"
              value={form.age}
              onChange={(e) => update("age", e.target.value)}
            />
          </Field>
          <Field label="Gender">
            <select className="input" value={form.gender} onChange={(e) => update("gender", e.target.value)}>
              {GENDER_OPTIONS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Location">
          <input className="input" value={form.location} onChange={(e) => update("location", e.target.value)} />
        </Field>

        <Field label="Presenting problem">
          <input
            className="input"
            value={form.primary_need}
            onChange={(e) => update("primary_need", e.target.value)}
          />
        </Field>

        <Field label="Immediate needs">
          <textarea
            rows={2}
            className="input resize-none"
            value={form.immediate_needs}
            onChange={(e) => update("immediate_needs", e.target.value)}
          />
        </Field>

        <Field label="Priority level">
          <select className="input" value={form.priority} onChange={(e) => update("priority", e.target.value)}>
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </Field>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 transition"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Register case
        </button>
      </form>
    </Modal>
  );
}

function Field({ label, children }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      <span className="mb-1.5 inline-block">{label}</span>
      {children}
    </label>
  );
}
