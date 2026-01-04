# --bundle 将所有依赖打包成一个文件，如果不加这个参数，则那些 import 导入的模块不会打包到这个文件里面，会保持这个导入语句
# --minify 压缩代码
# --outfile 指定输出文件
npx esbuild src/index.ts --outfile=dist/index.js --bundle --minify