import { useState, useEffect } from "react";
import Modal from "./Modal.jsx";
import { StatusPill, PriorityPill } from "./StatusPill.jsx";
import { api, ApiError } from "../lib/api.js";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

/**
 * Per API contract, status progression is:
 * Submitted → Received → Accepted (or Declined / Information Requested) → 
 * Appointment Scheduled → Client Arrived → Service In Progress → 
 * Service Completed → Closed
 *
 * Role-based buttons:
 * - Social Worker: Follow up (UI), Update Status (any), Close
 * - Partner: Accept, Decline, Request Info, Update Status, Mark Completed
 */
const SOCIAL_WORKER_STATUS_OPTIONS = [
  "Submitted",
  "Received",
  "Accepted",
  "Declined",
  "Information Requested",
  "Appointment Scheduled",
  "Client Arrived",
  "Service In Progress",
  "Service Completed",
  "Closed",
];

const PARTNER_QUICK_ACTIONS = [
  { label: "Accept", value: "Accepted" },
  { label: "Decline", value: "Declined" },
  { label: "Request Information", value: "Information Requested" },
  { label: "Mark Completed", value: "Service Completed" },
];

const PARTNER_STATUS_OPTIONS = [
  "Accepted",
  "Information Requested",
  "Appointment Scheduled",
  "Client Arrived",
  "Service In Progress",
  "Service Completed",
  "Closed",
];

export default function ReferralDetailModal({
  referral,
  me,
  onClose,
  onUpdated,
}) {
  const [nextStatus, setNextStatus] = useState(referral.status);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [addingNote, setAddingNote] = useState(false);

  const isSocialWorker = me?.role === "SOCIAL_WORKER" || me?.role === "SUPER_ADMIN";
  const isPartner = me?.role === "PARTNER";

  useEffect(() => {
    loadNotes();
  }, [referral.id]);

  async function loadNotes() {
    setLoadingNotes(true);
    try {
      const notesData = await api.getReferralNotes(referral.id);
      setNotes(Array.isArray(notesData) ? notesData : []);
    } catch (err) {
      console.error("Failed to load notes:", err);
    } finally {
      setLoadingNotes(false);
    }
  }

  async function handleUpdateStatus(newValue) {
    setSaveStatus("saving");
    setErrorMsg("");
    try {
      await api.patchReferralStatus(referral.id, newValue);
      setSaveStatus("done");
      onUpdated({ ...referral, status: newValue });
    } catch (err) {
      setSaveStatus("error");
      setErrorMsg(err instanceof ApiError ? err.message : "Couldn't update status.");
    }
  }

  async function handleAddNote() {
    if (!newNote.trim()) return;
    setAddingNote(true);
    try {
      const created = await api.addReferralNote(referral.id, newNote);
      setNotes((prev) => [created, ...prev]);
      setNewNote("");
    } catch (err) {
      console.error("Failed to add note:", err);
    } finally {
      setAddingNote(false);
    }
  }

  return (
    <Modal title={referral.caseId} onClose={onClose}>
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Details</h3>
          <div className="space-y-2">
            {referral.youthName && (
              <Row label="Youth / Client">{referral.youthName}</Row>
            )}
            <Row label="Service">{referral.service}</Row>
            <Row label="Referring org">{referral.referringOrganisation}</Row>
            <Row label="Receiving org">{referral.receivingOrganisation}</Row>
            <Row label="Priority">
              <PriorityPill value={referral.priority} />
            </Row>
            <Row label="Status">
              <StatusPill value={referral.status} />
            </Row>
          </div>
        </div>

        {/* Status update section */}
        {(isSocialWorker || isPartner) && (
          <div className="border-t border-slate-100 pt-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">
              Update status
            </h3>

            {isPartner && (
              <div className="space-y-2 mb-4">
                {PARTNER_QUICK_ACTIONS.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => handleUpdateStatus(value)}
                    disabled={saveStatus === "saving" || value === referral.status}
                    className="w-full text-left px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-slate-700 transition"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            {isSocialWorker && (
              <div className="flex items-center gap-3">
                <select
                  value={nextStatus}
                  onChange={(e) => {
                    setNextStatus(e.target.value);
                    setSaveStatus("idle");
                  }}
                  className="input flex-1"
                >
                  {SOCIAL_WORKER_STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleUpdateStatus(nextStatus)}
                  disabled={saveStatus === "saving" || nextStatus === referral.status}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 transition shrink-0"
                >
                  {saveStatus === "saving" && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  {saveStatus === "done" && <CheckCircle2 className="h-4 w-4" />}
                  Save
                </button>
              </div>
            )}

            {saveStatus === "error" && (
              <div className="flex items-start gap-2 text-red-600 text-sm mt-3">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        )}

        {/* Notes section */}
        <div className="border-t border-slate-100 pt-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Notes</h3>

          {loadingNotes ? (
            <p className="text-sm text-slate-400">Loading notes…</p>
          ) : notes.length > 0 ? (
            <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="bg-slate-50 rounded-lg p-3 text-sm"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-medium text-slate-700">
                      {note.author_name}{" "}
                      <span className="text-slate-400 font-normal">
                        ({note.organisation_name})
                      </span>
                    </p>
                    <span className="text-xs text-slate-400 shrink-0">
                      {new Date(note.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-600">{note.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 mb-4">No notes yet.</p>
          )}

          <div className="flex items-end gap-2">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note…"
              rows={2}
              className="input resize-none flex-1 text-sm"
            />
            <button
              onClick={handleAddNote}
              disabled={addingNote || !newNote.trim()}
              className="rounded-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 transition shrink-0"
            >
              {addingNote ? "…" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-700 text-right">{children}</span>
    </div>
  );
}
