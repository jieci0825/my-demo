import { add } from './utils'

export function sayHello(name: string) {
    console.log(`Hello, ${name}!`)
}

sayHello('John')

console.log(add(1, 2))
