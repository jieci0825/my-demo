import { spawn } from 'child_process'

const child = spawn('node', ['server.js'])

child.stdout.on('data', data => {
    data = data.toString().trim()
    console.log('from server: ', data)
})

child.stdin.write('大河之剑天上来 \n')
