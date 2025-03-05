export const getCache = key => {
    const result = localStorage.getItem(key)
    if (!result) return undefined
    try {
        return JSON.parse(result)
    } catch (error) {
        return result
    }
}

export const setCache = (key, value) => {
    if (typeof key !== 'string') return console.warn('setCache: key must be a string')
    localStorage.setItem(key, JSON.stringify(value))
}

export const removeCache = key => {
    if (typeof key !== 'string') return console.warn('removeCache: key must be a string')
    localStorage.removeItem(key)
}
