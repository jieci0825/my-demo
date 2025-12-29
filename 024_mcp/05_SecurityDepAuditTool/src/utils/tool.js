import { exec } from 'node:child_process'

export function runCommand(command, cwd) {
    return new Promise((resolve, reject) => {
        exec(command, { cwd }, (error, stdout, stderr) => {
            if (error) {
                reject(error)
            } else {
                resolve()
            }
        })
    })
}

export function runCommandWithOutput(command, cwd) {
    return new Promise((resolve, reject) => {
        exec(command, { cwd }, (error, stdout, stderr) => {
            // 即使有错误，也返回stdout，因为pnpm audit在发现漏洞时会返回非零退出码
            if (stdout) {
                resolve(stdout.trim())
            } else if (error) {
                // 如果没有stdout但有错误，创建一个包含stdout的错误对象
                error.stdout = stdout
                error.stderr = stderr
                reject(error)
            } else {
                resolve('')
            }
        })
    })
}
