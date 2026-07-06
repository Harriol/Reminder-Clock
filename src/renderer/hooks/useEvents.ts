import { useState, useEffect, useCallback } from 'react';
import { ReminderEvent } from '../../shared/types';

export function useEvents() {
  const [events, setEvents] = useState<ReminderEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = useCallback(async () => {
    try {
      const data = await window.api.getEvents();
      setEvents(data);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  const addEvent = async (data: Omit<ReminderEvent, 'id'>) => {
    await window.api.addEvent(data);
    await loadEvents();
  };

  const updateEvent = async (data: ReminderEvent) => {
    await window.api.updateEvent(data);
    await loadEvents();
  };

  const deleteEvent = async (id: string) => {
    await window.api.deleteEvent(id);
    await loadEvents();
  };

  return { events, loading, addEvent, updateEvent, deleteEvent, reload: loadEvents };
}
