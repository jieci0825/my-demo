const { ipcRenderer } = require('electron')
const SimpleMDE = require('../node_modules/simplemde/dist/simplemde.min.js')

const editor = new SimpleMDE({
    element: document.getElementById('editor')
})

ipcRenderer.on('load-file', (_, content) => {
    if (!content) {
        alert('文件损坏或者内容为空')
        return
    }
    editor.value(content)
})

ipcRenderer.on('format', (_, type) => {
    switch (type) {
        case 'toggleBold':
            editor.toggleBold()
            break
        case 'toggleItalic':
            editor.toggleItalic()
            break
        case 'toggleHeading1':
            editor.toggleHeading1()
            break
        case 'toggleHeading2':
            editor.toggleHeading2()
            break
        case 'toggleHeading3':
            editor.toggleHeading3()
            break
        case 'toggleHeading4':
            editor.toggleHeading4()
            break
        case 'toggleHeading5':
            editor.toggleHeading5()
            break
        case 'toggleHeading6':
            editor.toggleHeading6()
            break
        case 'toggleCodeBlock':
            editor.toggleCodeBlock()
            break
        case 'toggleBlockquote':
            editor.toggleBlockquote()
            break
        case 'toggleUnorderedList':
            editor.toggleUnorderedList()
            break
        case 'toggleOrderedList':
            editor.toggleOrderedList()
            break
        case 'drawLink':
            editor.drawLink()
            break
    }
})
