const { app, BrowserWindow, globalShortcut } = require('electron')
require('electron-reload')(__dirname)
require('./menu')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1200,
        height: 700,
        webPreferences: {
            // 允许渲染进程中使用 nodejs
            nodeIntegration: true,
            // 关闭上下文隔离
            contextIsolation: false
        }
    })
    return win
}

app.whenReady().then(() => {
    const win = createWindow()
    win.loadFile('./window/index.html')

    // 开发环境才需要注册
    if (process.env.NODE_ENV === 'development') {
        globalShortcut.register('F12', () => {
            BrowserWindow.getFocusedWindow().webContents.toggleDevTools()
        })
    }
})

// 注销所有的快捷键
app.on('will-quit', () => {
    globalShortcut.unregisterAll()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
