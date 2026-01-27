const DEFAULT_TIMEOUT_MS = 10000

/**
 * 为任务添加超时控制
 */
function withTimeout(promiseOrFn, timeoutMs = DEFAULT_TIMEOUT_MS) {
    const promise =
        typeof promiseOrFn === 'function' ? promiseOrFn() : promiseOrFn
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            const err = new Error('Task timeout')
            err.name = 'TimeoutError'
            err.timedOut = true
            reject(err)
        }, timeoutMs)

        // 利用 Promise.resolve 进行统一处理，包装为真正的 Promise 对象
        Promise.resolve(promise).then(
            value => {
                clearTimeout(timer)
                resolve(value)
            },
            err => {
                clearTimeout(timer)
                reject(err)
            },
        )
    })
}

/**
 * 并发执行任务，返回每项的执行结果
 */
async function runConcurrent(list, handler, concurrency, options = {}) {
    if (!Array.isArray(list)) {
        throw new TypeError('list must be an array')
    }
    if (typeof handler !== 'function') {
        throw new TypeError('handler must be a function')
    }
    if (!Number.isInteger(concurrency) || concurrency <= 0) {
        throw new TypeError('concurrency must be a positive integer')
    }

    const timeoutMs =
        typeof options === 'number'
            ? options
            : (options.timeoutMs ?? DEFAULT_TIMEOUT_MS)

    const results = new Array(list.length)
    const errors = []
    const fulfilleds = []

    let nextIndex = 0
    if (list.length === 0) {
        return []
    }

    // 并发执行器
    const worker = async () => {
        // 无限循环，直到所有任务都执行完毕
        while (true) {
            const current = nextIndex++
            if (current >= list.length) {
                return
            }
            // 执行任务
            try {
                const value = await withTimeout(
                    () => handler(list[current], current),
                    timeoutMs,
                )
                results[current] = {
                    status: 'fulfilled',
                    value,
                    timedOut: false,
                }
                fulfilleds.push(current)
            } catch (reason) {
                results[current] = {
                    status: 'rejected',
                    reason,
                    timedOut: reason && reason.name === 'TimeoutError',
                }
                errors.push(current)
            }
        }
    }

    // 并发执行器的数量
    const workerCount = Math.min(concurrency, list.length)
    // 创建并发执行器
    const workers = Array.from({ length: workerCount }, () => worker())
    await Promise.all(workers)
    return {
        results,
        errors,
        fulfilleds,
    }
}

export { withTimeout, runConcurrent }
