import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!

interface ModuleType {
    name: string
    default: string
}

const modules1 = import.meta.jcGlob<ModuleType>('./fixtures/*.ts')
/*
    { './fixtures/a.ts': ()=> import('./fixtures/a.ts'), './fixtures/b.ts': ()=> import('./fixtures/b.ts') };
 */
// * 将这个对象的值转为数组，然后遍历数组，将每个值执行（即为一个import('xxxx')导入函数），然后返回一个promise数组
Promise.all(Object.values(modules1).map(module => module())).then(modules1 => {
    splicingContent(`modules1: ${JSON.stringify(modules1, null, 2)}`)
})

// 传递数组的时候，这里传递的参数第一个表示匹配的文件，第二个表示排除的文件
//  - 实际是可以传递更多的，符合规则 glob规则即可，! 表示排除
const modules2 = import.meta.jcGlob<ModuleType>(['./fixtures/*.ts', '!**/index.ts'])

Promise.all(Object.values(modules2).map(module => module())).then(modules2 => {
    splicingContent(`modules2: ${JSON.stringify(modules2, null, 2)}`)
})

const modules3 = import.meta.jcGlob<ModuleType>(['./fixtures/*.ts', '!**/index.ts'], {
    eager: true
})

const list3 = Object.values(modules3)
for (const item of list3) {
    splicingContent(`modules3: ${item.name}`)
}

// as 设置 raw 表示返回文件原始内容
const modules4 = import.meta.jcGlob<ModuleType>(['./fixtures/*.ts', '!**/index.ts'], {
    eager: true,
    as: 'raw'
})

const list4 = Object.values(modules4)
for (const item of list4) {
    splicingContent(`modules4: ${item.default}`)
}

function splicingContent(str: string) {
    const p = document.createElement('p')
    p.textContent = str
    app.appendChild(p)
}
