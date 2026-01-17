const Router = require('koa-router');
const fs = require('fs').promises;
const path = require('path');

const router = new Router({ prefix: '/api' });

// 确保上传目录存在
async function ensureUploadDir() {
    const uploadDir = path.join(__dirname, '../uploads');
    try {
        await fs.access(uploadDir);
    } catch {
        await fs.mkdir(uploadDir, { recursive: true });
    }
    return uploadDir;
}

/**
 * 处理单个文件上传
 */
router.post('/upload', async (ctx) => {
    try {
        await ensureUploadDir();

        const file = ctx.request.files.file;

        if (!file) {
            ctx.status = 400;
            ctx.body = { error: '没有找到上传的文件' };
            return;
        }

        // 获取文件信息
        const originalName = file.originalFilename;
        const filePath = file.filepath;
        const fileSize = file.size;
        const mimeType = file.mimetype;

        // 生成新的文件名（避免文件名冲突）
        const ext = path.extname(originalName);
        const baseName = path.basename(originalName, ext);
        const timestamp = Date.now();
        const newFileName = `${baseName}_${timestamp}${ext}`;
        const newFilePath = path.join(path.dirname(filePath), newFileName);

        // 重命名文件
        await fs.rename(filePath, newFilePath);

        ctx.body = {
            success: true,
            message: '文件上传成功',
            data: {
                originalName,
                fileName: newFileName,
                filePath: newFilePath,
                size: fileSize,
                mimeType,
                uploadTime: new Date().toISOString()
            }
        };

    } catch (error) {
        console.error('文件上传错误:', error);
        ctx.status = 500;
        ctx.body = { error: '文件上传失败' };
    }
});

/**
 * 获取已上传文件列表
 */
router.get('/files', async (ctx) => {
    try {
        const uploadDir = await ensureUploadDir();
        const files = await fs.readdir(uploadDir);

        const fileList = [];

        for (const file of files) {
            const filePath = path.join(uploadDir, file);
            const stats = await fs.stat(filePath);

            fileList.push({
                fileName: file,
                size: stats.size,
                uploadTime: stats.mtime.toISOString(),
                path: filePath
            });
        }

        // 按上传时间倒序排列
        fileList.sort((a, b) => new Date(b.uploadTime) - new Date(a.uploadTime));

        ctx.body = {
            success: true,
            data: fileList
        };

    } catch (error) {
        console.error('获取文件列表错误:', error);
        ctx.status = 500;
        ctx.body = { error: '获取文件列表失败' };
    }
});

module.exports = router;
