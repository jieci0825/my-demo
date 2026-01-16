import { RunnableLambda } from '@langchain/core/runnables'

const fn = input => {
    return input + ' world'
}

// 把这个函数包装成一个实现了Runnable接口的对象
const runnableFn = RunnableLambda.from(fn)

// 调用函数
const response = await runnableFn.invoke('hello')
console.log(response)
