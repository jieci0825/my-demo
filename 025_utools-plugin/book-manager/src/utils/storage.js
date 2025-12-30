import { isString } from './check-type'

const PREFIX = 'utools/bookManager/'

function getDocId(key) {
    if (!isString(key)) {
        throw new Error('dbTool: key must be a non-empty string')
    }
    return `${PREFIX}${key}`
}

const dbTool = {
    get(key) {
        const id = getDocId(key)
        try {
            const doc = utools.db.get(id)
            return doc ? doc.value : null
        } catch (error) {
            console.error('dbTool: get error', error)
            return null
        }
    },

    set(key, value) {
        const id = getDocId(key)

        try {
            // 读出已有 doc（为了获取 _rev）
            let existing = utools.db.get(id)

            // 组装数据
            const doc = {
                _id: id,
                value
            }

            // 如果已有，则带上 _rev 进行覆盖
            if (existing && existing._rev) {
                doc._rev = existing._rev
            }

            const result = utools.db.put(doc)
            return result && result.ok === true
        } catch (error) {
            console.error('dbTool.set error:', err)
            return false
        }
    },

    remove(key) {
        const id = getDocId(key)
        try {
            const doc = utools.db.get(id)
            if (!doc) return false

            const result = utools.db.remove(doc)
            return result && result.ok === true
        } catch (err) {
            console.error('dbTool.remove error:', err)
            return false
        }
    },

    clear() {
        try {
            // 批量读出所有符合前缀的 docs
            const docs = utools.db.allDocs(PREFIX)
            let count = 0
            for (const doc of docs) {
                try {
                    const r = utools.db.remove(doc)
                    if (r && r.ok) count++
                } catch (ignore) {}
            }
            return count
        } catch (err) {
            console.error('dbTool.clear error:', err)
            return 0
        }
    }
}

export default dbTool
