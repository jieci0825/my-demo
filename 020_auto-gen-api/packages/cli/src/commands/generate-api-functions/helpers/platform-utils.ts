import path from 'path'
import fs from 'fs'

export function getAvailablePlatforms(workspaceRoot: string): string[] {
    const appsDir = path.join(workspaceRoot, 'apps')

    if (!fs.existsSync(appsDir)) {
        return []
    }

    return fs
        .readdirSync(appsDir)
        .filter((dir) => {
            const fullPath = path.join(appsDir, dir)
            return fs.statSync(fullPath).isDirectory() && fs.existsSync(path.join(fullPath, 'src'))
        })
        .filter((dir) => dir !== 'server')
}
