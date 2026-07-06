import { BrowserWindow, ipcMain } from 'electron';
import Store from 'electron-store';
import { v4 as uuidv4 } from 'uuid';
import { IPC_CHANNELS, ReminderEvent } from '../shared/types';

const store = new Store<{ events: ReminderEvent[] }>({
  name: 'reminder-clock-data',
  defaults: { events: [] },
});

export class EventStore {
  static getAll(): ReminderEvent[] {
    const events = store.get('events');
    // 兼容旧版数据：如果存的是 intervalMinutes 则迁移到 intervalSeconds
    return events.map((e: any) => {
      if (e.intervalSeconds === undefined && e.intervalMinutes !== undefined) {
        e.intervalSeconds = e.intervalMinutes * 60;
        delete e.intervalMinutes;
      }
      return e as ReminderEvent;
    });
  }

  static getById(id: string): ReminderEvent | undefined {
    const events = store.get('events');
    return events.find(e => e.id === id);
  }

  static add(event: Omit<ReminderEvent, 'id'>): ReminderEvent {
    const newEvent: ReminderEvent = { ...event, id: uuidv4() };
    const events = store.get('events');
    events.push(newEvent);
    store.set('events', events);
    return newEvent;
  }

  static update(event: ReminderEvent): ReminderEvent {
    const events = store.get('events');
    const index = events.findIndex(e => e.id === event.id);
    if (index !== -1) {
      events[index] = event;
      store.set('events', events);
    }
    return event;
  }

  static delete(id: string): void {
    const events = store.get('events').filter(e => e.id !== id);
    store.set('events', events);
  }
}

export function registerIpcHandlers(mainWindow: BrowserWindow | null) {
  ipcMain.handle(IPC_CHANNELS.GET_EVENTS, () => EventStore.getAll());

  ipcMain.handle(IPC_CHANNELS.ADD_EVENT, (_event, data: Omit<ReminderEvent, 'id'>) => {
    const newEvent = EventStore.add(data);
    return newEvent;
  });

  ipcMain.handle(IPC_CHANNELS.UPDATE_EVENT, (_event, data: ReminderEvent) => {
    return EventStore.update(data);
  });

  ipcMain.handle(IPC_CHANNELS.DELETE_EVENT, (_event, id: string) => {
    EventStore.delete(id);
  });

  ipcMain.handle(IPC_CHANNELS.SHOW_WINDOW, () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
      mainWindow.flashFrame(false);
    }
  });
}
