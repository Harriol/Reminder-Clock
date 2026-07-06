import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS, ReminderEvent } from '../shared/types';

const api = {
  getEvents: (): Promise<ReminderEvent[]> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_EVENTS),
  addEvent: (event: Omit<ReminderEvent, 'id'>): Promise<ReminderEvent> =>
    ipcRenderer.invoke(IPC_CHANNELS.ADD_EVENT, event),
  updateEvent: (event: ReminderEvent): Promise<ReminderEvent> =>
    ipcRenderer.invoke(IPC_CHANNELS.UPDATE_EVENT, event),
  deleteEvent: (id: string): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.DELETE_EVENT, id),
  showWindow: () => ipcRenderer.invoke(IPC_CHANNELS.SHOW_WINDOW),
  onReminderTriggered: (callback: (name: string) => void) => {
    ipcRenderer.on(IPC_CHANNELS.REMINDER_TRIGGERED, (_event, name) => callback(name));
  },
};

contextBridge.exposeInMainWorld('api', api);

export type ApiType = typeof api;
