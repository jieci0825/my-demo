import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!

interface ModuleType {
    name: string
}

// const modules = import.meta.jcGlob<ModuleType>('./fixtures/*.ts')
// /*
//     { './fixtures/a.ts': ()=> import('./fixtures/a.ts'), './fixtures/b.ts': ()=> import('./fixtures/b.ts') };
//  */
// // * 将这个对象的值转为数组，然后遍历数组，将每个值执行（即为一个import('xxxx')导入函数），然后返回一个promise数组
// Promise.all(Object.values(modules).map(module => module())).then(modules => {
//     // app.textContent = JSON.stringify(modules, null, 2)
//     console.log('modules:', modules)
// })

// // 传递数组的时候，这里传递的参数第一个表示匹配的文件，第二个表示排除的文件
// //  - 实际是可以传递更多的，符合规则 glob规则即可，! 表示排除
// const modules2 = import.meta.jcGlob<ModuleType>(['./fixtures/*.ts', '!**/index.ts'])

// Promise.all(Object.values(modules2).map(module => module())).then(modules => {
//     console.log('modules2:', modules)
//     app.textContent = JSON.stringify(modules, null, 2)
// })

const modules3 = import.meta.jcGlob<ModuleType>(['./fixtures/*.ts', '!**/index.ts'], {
    eager: true
    // as: 'raw'
})

console.log(Object.values(modules3)[0])

const modules4 = import.meta.jcGlob<ModuleType>(['./fixtures/*.ts', '!**/index.ts'], {
    eager: true
    // as: 'raw'
})
