import {
    createWorkDir,
    parseProject,
    generateLockFile,
    audit,
    writeMD
} from '../helpers/index.js'

export async function auditPackage(projectRootDir, savePath) {
    // 1. 创建工作目录
    // const workDir = createWorkDir()
    let workDir = `/Users/coderjc/Documents/frontend/project/my-demo/024_mcp/05_SecurityDepAuditTool/work-7bee52`

    // 2. 解析项目，拿到 package.json 文件
    const packageJson = await parseProject(projectRootDir)

    // 3. 将 package.json 文件保存到临时工作目录，同时生成 .lock 文件
    // await generateLockFile(packageJson, workDir)

    // 4. 进行安全审计并生成Markdown内容
    const mdContent = await audit(workDir)

    // 5. 将结果写入 markdown 文件
    writeMD(mdContent, savePath)

    process.exit(0)
}
