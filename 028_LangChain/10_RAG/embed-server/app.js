import Koa from "koa";
import cors from "koa-cors";
import { koaBody } from "koa-body";
import router from "./routes/upload.js";

const app = new Koa();

// 中间件配置
app.use(cors());
app.use(koaBody({
    multipart: true,
    formidable: {
        uploadDir: './uploads',
        keepExtensions: true,
        maxFileSize: 10 * 1024 * 1024, // 10MB
    }
}));

// 路由
app.use(router.routes());
app.use(router.allowedMethods());

// 错误处理
app.on('error', (err, ctx) => {
    console.error('server error', err);
});

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, HOST, () => {
    console.log(`文件上传服务器运行在 http://${HOST}:${PORT}`);
});
