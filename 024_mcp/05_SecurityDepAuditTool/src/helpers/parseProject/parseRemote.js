export async function parseRemote(projectRootDir) {
    // 检测是 gitee 还是 github
    // 不考虑其他的私有仓库，或者 svn 仓库
    if (projectRootDir.includes('gitee.com')) {
        return await parseGitee(projectRootDir)
    } else if (projectRootDir.includes('github.com')) {
        return await parseGithub(projectRootDir)
    } else {
        throw new Error(`${projectRootDir} 不支持的仓库类型`)
    }
}

async function parseGitee(projectRootDir) {
    // https://gitee.com/<owner>/<repo>/raw/<branch>/package.json
    const { owner, repo, branch } = parseRepository(projectRootDir, 'gitee')
    const packageJsonUrl = `https://gitee.com/${owner}/${repo}/raw/${branch}/package.json`
    const packageJson = await fetch(packageJsonUrl).then(res => res.json())
    if (!packageJson) {
        throw new Error(`${projectRootDir} 仓库的 package.json 文件不存在`)
    }
    return packageJson
}

async function parseGithub(projectRootDir) {
    // https://raw.githubusercontent.com/<owner>/<repo>/<branch>/package.json

    const { owner, repo, branch } = parseRepository(projectRootDir, 'github')

    const packageJsonUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/package.json`
    const packageJson = await fetch(packageJsonUrl).then(res => res.json())
    if (!packageJson) {
        throw new Error(`${projectRootDir} 仓库的 package.json 文件不存在`)
    }
    return packageJson
}

function parseRepository(url, type) {
    const regex = /^https?:\/\/(github|gitee)\.com\/([^\/]+)\/([^\/]+)(?:\/|$)/i
    const m = url.match(regex)
    if (!m) return null

    if (type === 'github') {
        return {
            owner: m[1],
            repo: m[2],
            branch: 'main' // 默认 branch，可按需修改
        }
    } else if (type === 'gitee') {
        return {
            owner: m[2],
            repo: m[3],
            branch: 'master' // 默认 branch，可按需修改
        }
    }
}
