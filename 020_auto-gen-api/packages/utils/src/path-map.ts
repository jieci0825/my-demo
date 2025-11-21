import { existsSync } from 'fs'
import { resolve, dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function findRootDir(startPath: string): string {
    let current = resolve(startPath)
    while (current !== dirname(current)) {
        if (existsSync(join(current, 'pnpm-workspace.yaml'))) {
            return current
        }
        current = dirname(current)
    }
    return current
}

export const RootDir = findRootDir(__dirname)
export const PackagesDir = join(RootDir, 'packages')
export const AppsDir = join(RootDir, 'apps')
export const ServerDir = join(AppsDir, 'server')
export const DocsDir = join(RootDir, 'docs')
