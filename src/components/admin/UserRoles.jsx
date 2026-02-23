import React, { useState } from 'react';
import { FiUser } from 'react-icons/fi';
import './UserRoles.css';

const ROLES = [
  { id: 'super_admin', label: 'Super Admin', desc: 'Full system access' },
  { id: 'regional_admin', label: 'Regional Admin', desc: 'Region-level control' },
  { id: 'district_admin', label: 'District Admin', desc: 'District-level control' },
  { id: 'support_officer', label: 'Support Officer', desc: 'Support & dispute handling' },
  { id: 'data_entry', label: 'Data Entry Officer', desc: 'Data entry only' },
];

const PERMISSIONS = [
  { id: 'view', label: 'View-only' },
  { id: 'edit', label: 'Edit rights' },
  { id: 'delete', label: 'Delete rights' },
  { id: 'map_edit', label: 'Map edit rights' },
  { id: 'matching', label: 'Matching control rights' },
  { id: 'financial', label: 'Financial visibility rights' },
];

function UserRoles() {
  const [selectedRole, setSelectedRole] = useState(null);

  return (
    <div className="user-roles">
      <header className="user-roles-header">
        <h1 className="user-roles-title">Roles & Permissions</h1>
      </header>

      <div className="user-roles-grid">
        <section className="ur-section">
          <h2>Roles</h2>
          <ul className="ur-role-list">
            {ROLES.map((r) => (
              <li key={r.id} className={`ur-role-item ${selectedRole === r.id ? 'active' : ''}`} onClick={() => setSelectedRole(r.id)}>
                <FiUser className="ur-role-icon" />
                <div>
                  <strong>{r.label}</strong>
                  <span>{r.desc}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="ur-section">
          <h2>Permissions</h2>
          <p className="ur-desc">Assignable permissions per role. Backend integration required.</p>
          <ul className="ur-perm-list">
            {PERMISSIONS.map((p) => (
              <li key={p.id} className="ur-perm-item">
                <input type="checkbox" id={`perm-${p.id}`} />
                <label htmlFor={`perm-${p.id}`}>{p.label}</label>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default UserRoles;
