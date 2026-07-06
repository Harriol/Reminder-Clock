import { Notification } from 'electron';

export function showReminderNotification(eventName: string) {
  const notification = new Notification({
    title: String.fromCharCode(9200) + ' 提醒时钟',
    body: '该' + eventName + '啦！休息一下吧~',
    silent: false,
  });
  notification.show();
  return notification;
}
