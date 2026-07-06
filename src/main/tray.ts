import { app, Tray, Menu, BrowserWindow, nativeImage } from 'electron';
import path from 'path';

let tray: Tray | null = null;

export function setupTray(mainWindow: BrowserWindow) {
  const iconPath = path.join(__dirname, '../../resources/icon.png');
  
  try {
    tray = new Tray(iconPath);
  } catch (e) {
    console.error('[Tray] 创建托盘图标失败:', e);
    return;
  }

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示窗口',
      click: () => { 
        mainWindow.show(); 
        mainWindow.focus(); 
        mainWindow.flashFrame(false);
      },
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        (app as any).isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip('提醒时钟');
  tray.setContextMenu(contextMenu);
  
  tray.on('click', () => { 
    mainWindow.show(); 
    mainWindow.focus(); 
    mainWindow.flashFrame(false);
  });
  
  tray.on('double-click', () => { 
    mainWindow.show(); 
    mainWindow.focus(); 
    mainWindow.flashFrame(false);
  });
}
