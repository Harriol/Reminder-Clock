import { BrowserWindow } from 'electron';
import { IPC_CHANNELS, ReminderEvent } from '../shared/types';
import { showReminderNotification } from './notification';
import { EventStore } from './ipc-handlers';

export class Scheduler {
  private timer: ReturnType<typeof setInterval> | null = null;
  private mainWindow: BrowserWindow | null = null;

  setWindow(win: BrowserWindow) {
    this.mainWindow = win;
  }

  start() {
    // 每 5 秒检查一次，精度更高
    this.timer = setInterval(() => this.tick(), 5 * 1000);
    console.log('[Scheduler] 调度引擎已启动');
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    console.log('[Scheduler] 调度引擎已停止');
  }

  private tick() {
    const events = EventStore.getAll();
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (const event of events) {
      // 跳过已禁用的事件
      if (!event.enabled) continue;

      // 跳过无效的间隔时间（防止 0 秒导致无限触发）
      if (!event.intervalSeconds || event.intervalSeconds <= 0) continue;

      const [startH, startM] = event.startTime.split(':').map(Number);
      const [endH, endM] = event.endTime.split(':').map(Number);
      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;

      let inTimeRange: boolean;
      if (startMinutes <= endMinutes) {
        inTimeRange = currentMinutes >= startMinutes && currentMinutes < endMinutes;
      } else {
        inTimeRange = currentMinutes >= startMinutes || currentMinutes < endMinutes;
      }

      if (!inTimeRange) continue;

      const lastTriggered = event.lastTriggeredAt ? new Date(event.lastTriggeredAt) : null;
      // 首次触发或距离上次触发已超过间隔
      if (!lastTriggered) {
        this.triggerReminder(event);
      } else {
        const diff = now.getTime() - lastTriggered.getTime();
        if (diff >= event.intervalSeconds * 1000) {
          this.triggerReminder(event);
        }
      }
    }
  }

  private triggerReminder(event: ReminderEvent) {
    // 从 EventStore 重新读取以确保拿到最新数据，避免操作过期引用
    const freshEvent = EventStore.getById(event.id);
    if (!freshEvent) {
      // 事件已被删除，不触发提醒
      console.log('[Scheduler] 事件已不存在，跳过提醒: ' + event.name);
      return;
    }
    if (!freshEvent.enabled) {
      // 事件已被禁用，不触发提醒
      console.log('[Scheduler] 事件已禁用，跳过提醒: ' + event.name);
      return;
    }

    // 避免并发修改引用：重建对象而不是直接修改传入的引用
    const updatedEvent: ReminderEvent = {
      ...freshEvent,
      lastTriggeredAt: new Date().toISOString(),
    };
    EventStore.update(updatedEvent);

    showReminderNotification(freshEvent.name);

    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.webContents.send(IPC_CHANNELS.REMINDER_TRIGGERED, freshEvent.name);
      if (!this.mainWindow.isVisible()) {
        this.mainWindow.flashFrame(true);
      }
    }
    console.log('[Scheduler] 触发提醒: ' + freshEvent.name);
  }
}
