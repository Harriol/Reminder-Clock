# ⏰ 提醒时钟 (Reminder Clock)

> 桌面定时提醒工具 — 自定义事件，按间隔循环提醒喝水、休息、活动等。

![Electron](https://img.shields.io/badge/Electron-30-blue)
![React](https://img.shields.io/badge/React-18-61dafb)
![Platform](https://img.shields.io/badge/Platform-Windows%20x64-brightgreen)

---

## 功能特性

- ✅ **自定义提醒事件** — 可创建多个事件，每个事件独立设置名称、间隔、时间段
- ✅ **灵活的时间间隔** — 支持小时/分钟/秒组合，最小间隔 10 秒
- ✅ **时间段控制** — 设置每日生效时间段（如 08:00 ~ 23:00），避免夜间打扰
- ✅ **循环提醒** — 在有效时间段内按设定间隔循环触发
- ✅ **桌面通知** — 系统右下角弹出 Windows 原生通知
- ✅ **应用内弹窗** — 主窗口打开时显示温馨提醒
- ✅ **任务栏闪烁** — 窗口隐藏时任务栏图标闪烁提示
- ✅ **系统托盘** — 关闭窗口自动隐藏到托盘，后台定时器继续运行
- ✅ **启用/禁用** — 每个事件可独立开关
- ✅ **数据持久化** — 事件数据自动保存到本地 JSON 文件

---

## 快速开始

### 下载

从 [Releases](../../releases) 页面下载 `提醒时钟-版本号-portable.exe`，双击即可运行（无需安装）。

### 开发运行

```bash
# 安装依赖
npm install

# 开发模式（Vite HMR + Electron）
npm run dev

# 生产构建 + 打包便携版 exe
npm run build
npx electron-builder --win portable
```

---

## 使用说明

### 创建事件

1. 点击 **+ 添加事件**
2. 输入事件名称（如：喝水）
3. 设置间隔时间（小时/分钟/秒）
4. 设置生效时间段
5. 点击 **添加** 保存

### 管理事件

- **开关** — 点击卡片上的蓝色/灰色滑块启用或禁用
- **编辑** — 点击 ✏️ 修改事件
- **删除** — 点击 🗑️ 删除事件

### 收到提醒

- 系统右下角弹出 **Windows 通知**
- 主窗口打开时显示 **弹窗提醒**
- 窗口隐藏时 **任务栏闪烁**

---

## 项目结构

```
reminder-clock/
├── src/
│   ├── main/              # Electron 主进程
│   │   ├── index.ts       # 入口，创建窗口、初始化
│   │   ├── preload.ts     # 预加载脚本，暴露 IPC API
│   │   ├── ipc-handlers.ts # IPC 通信 + 数据存储
│   │   ├── scheduler.ts   # 定时调度引擎
│   │   ├── notification.ts # 桌面通知
│   │   └── tray.ts        # 系统托盘
│   ├── renderer/          # React 前端
│   │   ├── App.tsx        # 主组件
│   │   ├── App.css        # 样式
│   │   ├── components/
│   │   │   ├── EventForm.tsx  # 添加/编辑表单
│   │   │   ├── EventCard.tsx  # 事件卡片
│   │   │   └── EventList.tsx  # 事件列表
│   │   └── hooks/
│   │       └── useEvents.ts   # 事件数据 Hook
│   └── shared/
│       └── types.ts       # 共享类型定义
├── resources/
│   └── icon.png           # 应用图标
├── dist/                  # 编译输出
├── release/               # 打包输出
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 技术栈

| 层 | 技术 |
|---|---|
| 桌面框架 | [Electron 30](https://www.electronjs.org/) |
| 前端 | [React 18](https://react.dev/) + TypeScript |
| 构建 | [Vite 5](https://vitejs.dev/) + [esbuild](https://esbuild.github.io/) |
| 数据存储 | [electron-store](https://github.com/sindresorhus/electron-store) |
| 打包 | [electron-builder](https://www.electron.build/) (portable) |

---

## 开发命令

```bash
npm run dev      # 开发模式（热更新）
npm run build    # 生产构建
npm run pack     # 构建 + 打包 exe
npm start        # 直接启动 electron
```

---

## 数据存储位置

```
C:\Users\[用户名]\AppData\Roaming\reminder-clock-nodejs\config.json
```
