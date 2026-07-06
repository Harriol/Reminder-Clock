import { app, BrowserWindow } from 'electron';
import path from 'path';
import { setupTray } from './tray';
import { registerIpcHandlers } from './ipc-handlers';
import { Scheduler } from './scheduler';

let mainWindow: BrowserWindow | null = null;
const scheduler = new Scheduler();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 650,
    minWidth: 400,
    minHeight: 500,
    title: '提醒时钟',
    icon: path.join(__dirname, '../../resources/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    show: false,
  });

  const isDev = process.env.NODE_ENV === 'development' || process.argv.includes('--dev');
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.once('ready-to-show', () => mainWindow?.show());

  // 点击关闭 → 隐藏到系统托盘
  mainWindow.on('close', (e) => {
    if (!(app as any).isQuitting) {
      e.preventDefault();
      mainWindow?.hide();
      console.log('[App] 窗口已隐藏到系统托盘');
    }
  });

  // 点击最小化 → 隐藏到系统托盘
  mainWindow.on('minimize', (e) => {
    e.preventDefault();
    mainWindow?.hide();
  });
}

app.whenReady().then(() => {
  createWindow();
  registerIpcHandlers(mainWindow!);
  setupTray(mainWindow!);
  scheduler.setWindow(mainWindow!);
  scheduler.start();
});

app.on('before-quit', () => {
  (app as any).isQuitting = true;
  scheduler.stop();
});

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });
}
