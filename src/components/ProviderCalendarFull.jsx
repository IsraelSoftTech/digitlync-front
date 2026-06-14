import React, { useEffect, useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { api } from '../api';
import { showToast } from './Toaster';
import './ProviderCalendarFull.css';

export default function ProviderCalendarFull() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [providerId, setProviderId] = useState(null);
  const [form, setForm] = useState({ available_date: '', start_time: '', end_time: '' });
  const calendarRef = useRef(null);

  useEffect(() => {
    // attempt to read provider id from URL
    const path = window.location.pathname || '';
    const m = path.match(/\/provider\/(\d+)\/calendar/);
    if (m) setProviderId(m[1]);
  }, []);

  useEffect(() => {
    if (!providerId) return;
    loadSlots();
  }, [providerId]);

  async function loadSlots() {
    setLoading(true);
    const res = await api.getProviderAvailability(providerId);
    if (!res.error) {
      const s = (res.data?.slots || []).map((slot) => ({
        id: String(slot.id),
        title: 'Available',
        start: slot.available_date + 'T' + (slot.start_time ? slot.start_time.substring(0,5) : '00:00'),
        end: slot.available_date + 'T' + (slot.end_time ? slot.end_time.substring(0,5) : '23:59'),
        extendedProps: slot,
      }));
      setSlots(s);
    }
    setLoading(false);
  }

  const handleDateSelect = async (selectInfo) => {
    if (!providerId) {
      showToast('Provider id missing in URL', { type: 'error' });
      return;
    }
    const startIso = selectInfo.startStr;
    const endIso = selectInfo.endStr;
    const available_date = startIso.substring(0,10);
    const start_time = (startIso.substring(11,16) || '00:00');
    let end_time = (endIso.substring(11,16) || '00:00');
    const endDate = endIso.substring(0,10);
    // If selection spans to next day (common for full-day selection), set end to 23:59 of start date
    if (endDate !== available_date) {
      end_time = '23:59';
    }

    // Create slot immediately
    try {
      const res = await api.createProviderAvailability(providerId, { available_date, start_time, end_time });
      if (res.error) {
        showToast(res.error || 'Failed to create slot', { type: 'error' });
      } else {
        showToast('Availability slot created', { type: 'success' });
        loadSlots();
      }
    } catch (e) {
      showToast('Failed to create slot', { type: 'error' });
    }

    // clear selection in calendar UI
    try {
      const cal = calendarRef.current && calendarRef.current.getApi && calendarRef.current.getApi();
      if (cal && cal.unselect) cal.unselect();
    } catch (_) {}
  };

  const handleEventClick = async (clickInfo) => {
    if (!confirm('Delete this availability slot?')) return;
    const id = clickInfo.event.id;
    const res = await api.deleteProviderAvailability(id);
    if (!res.error) {
      showToast('Availability slot deleted', { type: 'success' });
      loadSlots();
    } else showToast(res.error || 'Failed to delete slot', { type: 'error' });
  };

  const handleEventResize = async (resizeInfo) => {
    const ev = resizeInfo.event;
    const id = ev.id;
    const startIso = ev.startStr;
    const endIso = ev.endStr;
    const available_date = startIso.substring(0,10);
    const start_time = startIso.substring(11,16);
    const end_time = endIso.substring(11,16);
    try {
      const res = await api.updateProviderAvailability(id, { available_date, start_time, end_time });
      if (res.error) {
        showToast(res.error || 'Failed to update slot', { type: 'error' });
        if (typeof resizeInfo.revert === 'function') resizeInfo.revert();
      } else {
        showToast('Availability updated', { type: 'success' });
        loadSlots();
      }
    } catch (e) {
      showToast('Failed to update slot', { type: 'error' });
      if (typeof resizeInfo.revert === 'function') resizeInfo.revert();
    }
  };

  const handleEventDrop = async (dropInfo) => {
    const ev = dropInfo.event;
    const id = ev.id;
    const startIso = ev.startStr;
    const endIso = ev.endStr || startIso;
    const available_date = startIso.substring(0,10);
    const start_time = startIso.substring(11,16);
    const end_time = endIso.substring(11,16) || '23:59';
    try {
      const res = await api.updateProviderAvailability(id, { available_date, start_time, end_time });
      if (res.error) {
        showToast(res.error || 'Failed to move slot', { type: 'error' });
        if (typeof dropInfo.revert === 'function') dropInfo.revert();
      } else {
        showToast('Availability moved', { type: 'success' });
        loadSlots();
      }
    } catch (e) {
      showToast('Failed to move slot', { type: 'error' });
      if (typeof dropInfo.revert === 'function') dropInfo.revert();
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!providerId) {
      showToast('Provider id missing in URL', { type: 'error' });
      return;
    }
    const res = await api.createProviderAvailability(providerId, form);
    if (!res.error) {
      setForm({ available_date: '', start_time: '', end_time: '' });
      showToast('Availability slot created', { type: 'success' });
      loadSlots();
    } else {
      showToast(res.error || 'Failed to create slot', { type: 'error' });
    }
  };

  return (
    <div className="provider-calendar-full">
      <h2>Provider availability calendar</h2>
      {!providerId && <div>Please open this page at /provider/:id/calendar</div>}
      {providerId && (
        <div>
          {loading ? <div>Loading…</div> : (
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              selectable={true}
              select={handleDateSelect}
              ref={calendarRef}
              events={slots}
              eventClick={handleEventClick}
              eventResize={handleEventResize}
              eventDrop={handleEventDrop}
              headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
              height={600}
            />
          )}

          <form onSubmit={submit} style={{ marginTop: 12 }}>
            <label>
              Date: <input type="date" value={form.available_date} onChange={(e) => setForm({ ...form, available_date: e.target.value })} required />
            </label>
            <label style={{ marginLeft: 8 }}>
              Start: <input type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} required />
            </label>
            <label style={{ marginLeft: 8 }}>
              End: <input type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} required />
            </label>
            <button style={{ marginLeft: 8 }} type="submit">Add slot</button>
          </form>
        </div>
      )}
    </div>
  );
}
