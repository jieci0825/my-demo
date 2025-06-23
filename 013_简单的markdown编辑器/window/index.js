const SimpleMDE = require('../node_modules/simplemde/dist/simplemde.min.js')

const simplemde = new SimpleMDE({
    element: document.getElementById('editor')
})

console.log('simplemde', simplemde)
