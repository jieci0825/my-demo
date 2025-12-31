import { ref, onMounted } from 'vue'
import dbTool from '@/utils/storage'

const STORAGE_KEY = 'tags'

export const useTag = () => {
    const tagList = ref([])

    // 从本地存储加载标签
    const loadTags = () => {
        const savedTags = dbTool.get(STORAGE_KEY)
        if (savedTags && Array.isArray(savedTags)) {
            tagList.value = savedTags
        }
    }

    // 保存标签到本地存储
    const saveTags = () => {
        dbTool.set(STORAGE_KEY, tagList)
    }

    // 添加标签
    const addTag = tagName => {
        const trimmedTag = tagName.trim()

        // 检查是否为空
        if (!trimmedTag) {
            return {
                success: false,
                message: '标签名称不能为空'
            }
        }

        // 检查是否已存在（区分大小写）
        const exists = tagList.value.some(tag => tag.tagName === trimmedTag)

        if (exists) {
            return {
                success: false,
                message: '标签已存在'
            }
        }

        // 添加标签-首位添加
        tagList.value.unshift({
            tagName: trimmedTag,
            createTime: Date.now(),
            count: 0
        })

        saveTags()

        return {
            success: true,
            message: '标签添加成功'
        }
    }

    // 删除标签
    const delTag = index => {
        if (index >= 0 && index < tagList.value.length) {
            const tag = tagList.value[index]
            // 如果标签统计等于小于0，则删除标签
            if (tag.count <= 0) {
                tagList.value.splice(index, 1)
                saveTags()
            }
            return {
                success: true,
                message: '标签删除成功'
            }
        }

        return {
            success: false,
            message: '标签不存在'
        }
    }

    // 增加标签使用次数
    const addTagCount = tagName => {
        const index = getTagIndexByName(tagName)
        if (index >= 0) {
            tagList.value[index].count++
            saveTags()
        }
    }

    // 减少标签使用次数
    const reduceTagCount = tagName => {
        const index = getTagIndexByName(tagName)
        if (index >= 0) {
            tagList.value[index].count--
            saveTags()
        }
    }

    // 根据标签名删除标签
    const delTagByName = tagName => {
        const index = getTagIndexByName(tagName)
        if (index >= 0) {
            delTag(index)
        }
    }

    // 根据标签名返回索引
    const getTagIndexByName = tagName => {
        return tagList.value.findIndex(tag => tag.tagName === tagName)
    }

    // 组件挂载时加载数据
    onMounted(() => {
        loadTags()
    })

    return {
        tagList,
        addTag,
        delTag,
        delTagByName,
        addTagCount,
        reduceTagCount,
        getTagIndexByName
    }
}
