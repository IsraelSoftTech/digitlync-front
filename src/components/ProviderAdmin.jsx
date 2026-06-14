import React from 'react';
import ProviderCalendarFull from './ProviderCalendarFull';

export default function ProviderAdmin() {
  return (
    <div style={{ padding: 12 }}>
      <h1>Provider Admin</h1>
      <p>Manage availability and view provider details.</p>
      <ProviderCalendarFull />
    </div>
  );
}
