import React from 'react';
import { ReminderEvent } from '../../shared/types';
import { EventCard } from './EventCard';

interface Props {
  events: ReminderEvent[];
  onEdit: (event: ReminderEvent) => void;
  onDelete: (id: string) => void;
  onToggle: (event: ReminderEvent) => void;
}

export function EventList({ events, onEdit, onDelete, onToggle }: Props) {
  return (
    <div className='event-list'>
      {events.map(event => (
        <EventCard
          key={event.id}
          event={event}
          onEdit={() => onEdit(event)}
          onDelete={() => onDelete(event.id)}
          onToggle={() => onToggle(event)}
        />
      ))}
    </div>
  );
}
