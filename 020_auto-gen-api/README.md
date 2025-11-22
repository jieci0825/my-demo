# auto gen api

## 快速开始
我已经把流程初始化好了，想看效果的话，可以按下面步骤来：

1. 先到 `apps/server` 目录，打开终端执行 `pnpm run dev` 把服务器跑起来。

2. 然后去 `apps/admin` 或者 `apps/web` 目录，同样执行 `pnpm run dev` 启动前端项目。打开页面点一下"获取数据"按钮就能看到效果了。

## 如何使用
整个 api 自动生成流程分三步，记得都在根目录下执行命令：

1. 执行 `pnpm run cli gad`。这一步会生成两个文件，放在 `docs/api` 目录下：
   - **api-json-schema.json**：这个文件很重要，后面生成类型和请求函数都要用到它。你可以把它理解成中间产物，就像 vnode 那样。
   - **openapi.json**：这是标准的 OpenAPI 格式文档。可以直接导入到 apifox 这类工具里，就能看到完整的接口文档了。

2. 执行 `pnpm run cli gat`。这一步会根据刚才生成的 api-json-schema.json 来生成 TypeScript 类型文件，用的是命名空间写法。文件会放在 `packages/types/src/api` 目录。

3. 执行 `pnpm run cli gaf`。这一步生成真正能用的 api 请求函数，会放到各个子项目（apps 下的 admin、web 等）的 `src/api/modules` 目录下。

## 关于命令
所有命令都在 `packages/cli` 这个子包里，一共提供了四个命令：
- **gm**：生成模块骨架。不过这个 demo 里模板内容被省略了，只是生成空文件，没有实际内容。
- **gad、gat、gaf**：这三个命令是一套的，专门用来自动生成 api 请求函数。
