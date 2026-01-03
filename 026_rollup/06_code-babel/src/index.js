import { add } from './math.js'

const r1 = add(1, 2)
const r2 = add(3, 4)
console.log(r1, r2)

const arr1 = [1, 2, 3, 4, 5]
const arr2 = arr1.map(item => item * 2)
console.log(arr2)

function fn() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(100)
        }, 1000)
    })
}

fn().then(res => {
    console.log(res)
})
