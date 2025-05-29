import sass from 'sass'
import path from 'node:path'
import fs from 'node:fs'

const input = path.resolve(__dirname, 'index.scss')
const output = path.resolve(__dirname, 'index.css')

const result = sass.compile(input)

fs.writeFileSync(output, result.css)
