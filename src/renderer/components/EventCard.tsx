import React from 'react';
import { ReminderEvent, formatInterval } from '../../shared/types';

interface Props {
  event: ReminderEvent;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}

const eventIcons: Record<string, string> = {
  '\u559d\u6c34': '\u{1F4A7}',
  '\u6d3b\u52a8': '\u{1F9D8}',
  '\u4f11\u606f': '\u{1F634}',
  '\u773c': '\u{1F441}',
};

export function EventCard({ event, onEdit, onDelete, onToggle }: Props) {
  const icon = Object.entries(eventIcons).find(([key]) =>
    event.name.includes(key)
  )?.[1] || '\u{23F0}';

  return (
    <div className='event-card'>
      <div className='event-info'>
        <div className='event-name'>{icon} {event.name}</div>
        <div className='event-meta'>
          <span>&#x1F550; 每 {formatInterval(event.intervalSeconds)}</span>
          <span>&#x23F1; {event.startTime} ~ {event.endTime}</span>
        </div>
      </div>
      <div className='event-actions'>
        <button
          className={'toggle' + (event.enabled ? ' active' : '')}
          onClick={onToggle}
          title={event.enabled ? '\u70b9\u51fb\u6682\u505c' : '\u70b9\u51fb\u542f\u7528'}
        />
        <button className='edit-btn' onClick={onEdit} title='edit'>&#x270F;&#xFE0F;</button>
        <button className='delete-btn' onClick={onDelete} title='delete'>&#x1F5D1;</button>
      </div>
    </div>
  );
}
