const { Menu } = require('electron')

const menuList = [
    {
        label: ''
    },
    {
        label: '文件',
        submenu: [
            {
                label: '打开',
                click() {
                    console.log('打开文件')
                }
            },
            {
                label: '保存',
                click() {
                    console.log('保存文件')
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
                label: '加粗'
            },
            {
                label: '斜体'
            },
            { type: 'separator' },
            {
                label: '标题',
                submenu: [
                    {
                        label: '一级标题'
                    },
                    {
                        label: '二级标题'
                    },
                    {
                        label: '三级标题'
                    },
                    {
                        label: '四级标题'
                    },
                    {
                        label: '五级标题'
                    },
                    {
                        label: '六级标题'
                    }
                ]
            },
            { type: 'separator' },
            {
                label: '有序列表'
            },
            {
                label: '无序列表'
            },
            {
                label: '引用'
            },
            {
                label: '链接'
            },
            {
                label: '代码块'
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

const menu = Menu.buildFromTemplate(menuList)
Menu.setApplicationMenu(menu)
