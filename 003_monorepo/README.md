# monorepo 学习

## 命令解析
1. 在根工程下执行一个命令。 `pnpm-workspace.yaml` 文件所在的目录，即根目录/根工程
```shell
pnpm --workspace-root ...
# or
pnpm -w ...

# 在根目录下初始化package.json
pnpm --workspace-root init
```

## .npmrc
1. `engine-strict=true`: 严格的环境，这样在 packages.json 中声明的依赖版本，当前环境必须满足，否则会报错

## typescript
### tsconfig.json
```ts
{
    "compilerOptions": {
        // 模块解析的基础路径，"." 表示当前目录
        "baseUrl": ".",
        
        // 指定生成代码的模块系统，esnext 表示使用最新的 ES 模块标准
        "module": "esnext",
        
        // 指定编译后的 JavaScript 版本，esnext 表示编译到最新的 ES 标准
        "target": "esnext",
        
        // 要包含的类型声明文件，空数组表示不自动引入任何类型声明（如 @types/node）
        "types": [],
        
        // 编译时需要引入的库文件列表，这里只包含 ESNext 标准库
        "lib": ["ESNext"],
        
        // 生成对应的 .map 文件，用于调试时映射到源代码
        "sourceMap": true,
        
        // 生成 .d.ts 类型声明文件
        "declaration": true,
        
        // 为声明文件生成 source map，便于在 IDE 中跳转到源代码
        "declarationMap": true,
        
        // 对索引访问（如 obj[key]）添加 undefined 类型检查，提高类型安全性
        "noUncheckedIndexedAccess": true,
        
        // 严格区分可选属性（?: T）和 undefined 类型（: T | undefined），不允许显式传入 undefined
        "exactOptionalPropertyTypes": true,
        
        // 启用所有严格类型检查选项（包括 noImplicitAny、strictNullChecks 等）
        "strict": true,
        
        // 保留原始的导入/导出语法，false 表示允许 TypeScript 对导入导出进行转换
        "verbatimModuleSyntax": false,
        
        // 模块解析策略，bundler 模式适用于现代打包工具（如 Vite、esbuild）
        "moduleResolution": "bundler",
        
        // 确保每个文件都可以独立转译，不依赖其他文件的类型信息（适用于并行编译）
        "isolatedModules": true,
        
        // 检查副作用导入（import "./module"），确保被导入的模块确实存在
        "noUncheckedSideEffectImports": true,
        
        // 强制将所有文件视为模块（即使没有 import/export），避免全局作用域污染
        "moduleDetection": "force",
        
        // 跳过对第三方库声明文件（.d.ts）的类型检查，提高编译速度
        "skipLibCheck": true
    },
    
    // 排除不需要编译的文件夹
    "exclude": ["node_modules", "dist"]
}
```