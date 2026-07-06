export interface ReminderEvent {
  id: string;
  name: string;
  intervalSeconds: number;
  startTime: string;
  endTime: string;
  enabled: boolean;
  lastTriggeredAt?: string;
}

export const IPC_CHANNELS = {
  GET_EVENTS: 'get-events',
  ADD_EVENT: 'add-event',
  UPDATE_EVENT: 'update-event',
  DELETE_EVENT: 'delete-event',
  SHOW_WINDOW: 'show-window',
  REMINDER_TRIGGERED: 'reminder-triggered',
} as const;

export function formatInterval(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const parts: string[] = [];
  if (h > 0) parts.push(h + ' 小时');
  if (m > 0) parts.push(m + ' 分');
  if (s > 0 || parts.length === 0) parts.push(s + ' 秒');
  return parts.join(' ');
}
