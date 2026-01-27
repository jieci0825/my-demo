import Router from 'koa-router'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ragHandler } from '../rag/index.js'
import { vectorStoreMap } from '../utils/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = new Router({ prefix: '/api' })

// 确保上传目录存在
async function ensureUploadDir() {
    const uploadDir = path.join(__dirname, '../uploads')
    try {
        await fs.access(uploadDir)
    } catch {
        await fs.mkdir(uploadDir, { recursive: true })
    }
    return uploadDir
}

/**
 * 处理单个文件上传
 */
router.post('/upload', async ctx => {
    try {
        const uploadDir = await ensureUploadDir()

        const file = ctx.request.files.file

        if (!file) {
            ctx.status = 400
            ctx.body = { error: '没有找到上传的文件' }
            return
        }

        // 获取文件信息
        const originalName = file.originalFilename
        const filePath = file.filepath
        const fileSize = file.size
        const mimeType = file.mimetype

        const newFileName = originalName
        const newFilePath = path.join(uploadDir, originalName)

        // 组装文件信息
        const fileInfo = {
            originalName,
            fileName: newFileName,
            filePath: newFilePath,
            size: fileSize,
            mimeType,
            uploadTime: new Date().toISOString(),
        }

        try {
            await fs.unlink(newFilePath)
        } catch (error) {
            if (error.code !== 'ENOENT') {
                throw error
            }
        }

        // 覆盖保存为原始文件名
        await fs.rename(filePath, newFilePath)

        const vectorStore = await ragHandler(fileInfo)
        // 实现一个映射，将文件名与向量存储实例关联起来
        vectorStoreMap.set(originalName, vectorStore)

        // 打印：xx文件已完成向量存储
        console.log(`==== ${originalName} 已完成向量存储 ====`)

        ctx.body = {
            success: true,
            message: '文件上传成功',
            data: {
                originalName,
                fileName: newFileName,
                filePath: newFilePath,
                size: fileSize,
                mimeType,
                uploadTime: new Date().toISOString(),
            },
        }
    } catch (error) {
        console.error('文件上传错误:', error)
        ctx.status = 500
        ctx.body = { error: '文件上传失败' }
    }
})

/**
 * 获取已上传文件列表
 */
router.get('/files', async ctx => {
    try {
        const uploadDir = await ensureUploadDir()
        const files = await fs.readdir(uploadDir)

        const fileList = []

        for (const file of files) {
            const filePath = path.join(uploadDir, file)
            const stats = await fs.stat(filePath)

            fileList.push({
                fileName: file,
                size: stats.size,
                uploadTime: stats.mtime.toISOString(),
                path: filePath,
            })
        }

        // 按上传时间倒序排列
        fileList.sort((a, b) => new Date(b.uploadTime) - new Date(a.uploadTime))

        ctx.body = {
            success: true,
            data: fileList,
        }
    } catch (error) {
        console.error('获取文件列表错误:', error)
        ctx.status = 500
        ctx.body = { error: '获取文件列表失败' }
    }
})

export default router
