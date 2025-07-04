const { Menu, app, BrowserWindow, dialog } = require('electron')
const fs = require('fs')

function loadFile() {
    const window = BrowserWindow.getFocusedWindow()
    const files = dialog.showOpenDialogSync(window, {
        properties: ['openFile'],
        title: '请选择你要打开的 md 文件',
        defaultPath: app.getPath('documents'),
        filters: [
            {
                name: 'Markdown',
                extensions: ['md']
            }
        ]
    })

    if (files === undefined) return

    const fileUrl = files[0]
    const fileContent = fs.readFileSync(fileUrl, 'utf-8')

    // 将读取到的内容写入到编辑器中
    window.webContents.send('load-file', fileContent)
}

async function saveFile() {
    const window = BrowserWindow.getFocusedWindow()
    // 获取当前窗口的编辑器内容
    //  - 即调用方法，执行一段 js 代码，获取编辑器内容
    const fileContent = await window.webContents.executeJavaScript('editor.value()')

    if (fileContent === undefined || fileContent === '') {
        dialog.showMessageBoxSync(window, {
            type: 'info',
            title: '提示',
            message: '请输入内容之后再保存'
        })
        return
    }

    // 选择保存文件的路径
    const filePath = dialog.showSaveDialogSync(window, {
        title: '选择保存的位置',
        defaultPath: app.getPath('documents'),
        filters: [
            {
                name: 'Markdown',
                extensions: ['md']
            }
        ]
    })

    if (filePath === undefined) return

    // 写入文件并创建
    fs.writeFileSync(filePath, fileContent, 'utf-8')
}

const menuList = [
    {
        label: '文件',
        submenu: [
            {
                label: '打开',
                click() {
                    loadFile()
                }
            },
            {
                label: '保存',
                click() {
                    saveFile()
                }
            }
        ]
    },
    {
        label: '编辑',
        submenu: [
            {
                label: '撤销',
                role: 'undo'
            },
            {
                label: '重做',
                role: 'redo'
            },
            // 分隔线
            {
                type: 'separator'
            },
            {
                label: '剪切',
                role: 'cut'
            },
            {
                label: '复制',
                role: 'copy'
            },
            {
                label: '粘贴',
                role: 'paste'
            },
            {
                label: '全选',
                role: 'selectAll'
            }
        ]
    },
    {
        label: '格式化',
        submenu: [
            {
                label: '加粗',
                accelerator: 'CmdOrCtrl+B',
                click() {
                    const window = BrowserWindow.getFocusedWindow()
                    window.webContents.send('format', 'toggleBold')
                }
            },
            {
                label: '斜体',
                accelerator: 'CmdOrCtrl+I',
                click() {
                    const window = BrowserWindow.getFocusedWindow()
                    window.webContents.send('format', 'toggleItalic')
                }
            },
            { type: 'separator' },
            {
                label: '标题',
                submenu: [
                    {
                        label: '一级标题',
                        accelerator: 'CmdOrCtrl+1',
                        click() {
                            const window = BrowserWindow.getFocusedWindow()
                            window.webContents.send('format', 'toggleHeading1')
                        }
                    },
                    {
                        label: '二级标题',
                        accelerator: 'CmdOrCtrl+2',
                        click() {
                            const window = BrowserWindow.getFocusedWindow()
                            window.webContents.send('format', 'toggleHeading2')
                        }
                    },
                    {
                        label: '三级标题',
                        accelerator: 'CmdOrCtrl+3',
                        click() {
                            const window = BrowserWindow.getFocusedWindow()
                            window.webContents.send('format', 'toggleHeading3')
                        }
                    },
                    {
                        label: '四级标题',
                        accelerator: 'CmdOrCtrl+4',
                        click() {
                            const window = BrowserWindow.getFocusedWindow()
                            window.webContents.send('format', 'toggleHeading4')
                        }
                    },
                    {
                        label: '五级标题',
                        accelerator: 'CmdOrCtrl+5',
                        click() {
                            const window = BrowserWindow.getFocusedWindow()
                            window.webContents.send('format', 'toggleHeading5')
                        }
                    },
                    {
                        label: '六级标题',
                        accelerator: 'CmdOrCtrl+6',
                        click() {
                            const window = BrowserWindow.getFocusedWindow()
                            window.webContents.send('format', 'toggleHeading6')
                        }
                    }
                ]
            },
            { type: 'separator' },
            {
                label: '无序列表',
                accelerator: 'CmdOrCtrl+O',
                click() {
                    const window = BrowserWindow.getFocusedWindow()
                    window.webContents.send('format', 'toggleUnorderedList')
                }
            },
            {
                label: '有序列表',
                accelerator: 'CmdOrCtrl+U',
                click() {
                    const window = BrowserWindow.getFocusedWindow()
                    window.webContents.send('format', 'toggleOrderedList')
                }
            },
            {
                label: '引用',
                accelerator: 'Alt+Q',
                click() {
                    const window = BrowserWindow.getFocusedWindow()
                    window.webContents.send('format', 'toggleBlockquote')
                }
            },
            {
                label: '链接',
                accelerator: 'CmdOrCtrl+L',
                click() {
                    const window = BrowserWindow.getFocusedWindow()
                    window.webContents.send('format', 'drawLink')
                }
            },
            {
                label: '代码块',
                accelerator: 'CmdOrCtrl+K',
                click() {
                    const window = BrowserWindow.getFocusedWindow()
                    window.webContents.send('format', 'toggleCodeBlock')
                }
            }
        ]
    },
    {
        label: '帮助',
        role: 'help',
        submenu: [
            {
                label: '关于编辑器',
                click() {
                    console.log('关于编辑器')
                }
            }
        ]
    }
]

if (process.platform === 'darwin') {
    menuList.unshift({
        label: app.getName(),
        submenu: [
            {
                label: '退出' + app.name,
                role: 'quit'
            }
        ]
    })
}

// 避免出现的应用名称是Electron
//  - 开发时才显示，如果打包之后，则不设置这一段代码，也会正常显示 app.getName() 的值
menuList.unshift({
    label: ''
})

const menu = Menu.buildFromTemplate(menuList)
Menu.setApplicationMenu(menu)
