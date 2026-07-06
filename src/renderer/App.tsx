import React, { useState, useEffect, useCallback } from 'react';
import { ReminderEvent } from '../shared/types';
import { EventList } from './components/EventList';
import { EventForm } from './components/EventForm';

export default function App() {
  const [events, setEvents] = useState<ReminderEvent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ReminderEvent | null>(null);
  const [reminderName, setReminderName] = useState<string | null>(null);

  const loadEvents = useCallback(async () => {
    const data = await window.api.getEvents();
    setEvents(data);
  }, []);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  useEffect(() => {
    window.api.onReminderTriggered(async (name: string) => {
      setReminderName(name);
      await loadEvents();
    });
  }, [loadEvents]);

  const handleAdd = () => { setEditingEvent(null); setShowForm(true); };
  const handleEdit = (event: ReminderEvent) => { setEditingEvent(event); setShowForm(true); };

  const handleDelete = async (id: string) => {
    await window.api.deleteEvent(id);
    await loadEvents();
  };

  const handleToggle = async (event: ReminderEvent) => {
    await window.api.updateEvent({ ...event, enabled: !event.enabled });
    await loadEvents();
  };

  const handleSave = async (data: Omit<ReminderEvent, 'id'>) => {
    if (editingEvent) {
      await window.api.updateEvent({ ...data, id: editingEvent.id });
    } else {
      await window.api.addEvent(data);
    }
    setShowForm(false);
    setEditingEvent(null);
    await loadEvents();
  };

  return (
    <div className='app-container'>
      <header className='app-header'>
        <div className='app-title'>
          <span className='icon'>&#128276;</span>
          提醒时钟
        </div>
        <button className='add-btn' onClick={handleAdd}>+ 添加事件</button>
      </header>

      {events.length === 0 ? (
        <div className='empty-state'>
          <div className='big-icon'>&#9200;</div>
          <p>还没有提醒事件，点击上方按钮添加吧</p>
        </div>
      ) : (
        <EventList
          events={events}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggle={handleToggle}
        />
      )}

      {showForm && (
        <EventForm
          event={editingEvent}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingEvent(null); }}
        />
      )}

      {reminderName && (
        <div className='modal-overlay' onClick={() => setReminderName(null)}>
          <div className='modal-card' onClick={e => e.stopPropagation()}>
            <div className='modal-icon'>&#9200;</div>
            <h2>温馨提醒</h2>
            <p>该 <strong>{reminderName}</strong> 啦！休息一下吧~</p>
            <button onClick={() => setReminderName(null)}>知道了</button>
          </div>
        </div>
      )}
    </div>
  );
}
