import { app, BrowserWindow, globalShortcut } from 'electron'

let mianWindow = null

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 500,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    win.loadURL(process.argv[2])

    return win
}

app.whenReady().then(() => {
    mianWindow = createWindow()

    // 注册 f12 调试
    globalShortcut.register('F12', () => {
        const currentWindow = BrowserWindow.getFocusedWindow()
        if (currentWindow) {
            currentWindow.webContents.toggleDevTools()
        }
    })
})

// 注销快捷键
app.on('will-quit', () => {
    globalShortcut.unregisterAll()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
