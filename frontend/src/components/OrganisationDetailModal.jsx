import Modal from "./Modal.jsx";

export default function OrganisationDetailModal({ org, onClose, onRefer }) {
  return (
    <Modal title={org.name} onClose={onClose}>
      <div className="space-y-4 text-sm">
        <p className="text-slate-500">{org.service_type}</p>
        <div className="space-y-2">
          <Row label="Category">{org.category}</Row>
          <Row label="Location">{org.location}</Row>
          <Row label="Phone">{org.phone}</Row>
          <Row label="Email">{org.email}</Row>
          {org.contact_person && <Row label="Contact person">{org.contact_person}</Row>}
          {org.target_age_group && <Row label="Target age group">{org.target_age_group}</Row>}
          {org.target_gender && <Row label="Target gender">{org.target_gender}</Row>}
          {org.availability && <Row label="Availability">{org.availability}</Row>}
          {org.requirements && <Row label="Requirements">{org.requirements}</Row>}
          {org.operating_details && <Row label="Operating details">{org.operating_details}</Row>}
        </div>
        <button
          onClick={() => onRefer(org)}
          className="w-full rounded-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-5 py-2.5 transition"
        >
          Refer a Youth
        </button>
      </div>
    </Modal>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-700 text-right">{children}</span>
    </div>
  );
}
