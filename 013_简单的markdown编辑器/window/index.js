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
