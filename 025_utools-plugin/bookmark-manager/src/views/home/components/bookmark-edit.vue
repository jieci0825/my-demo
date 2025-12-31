<script setup>
import { ref, reactive, watch, computed, onMounted, onBeforeUnmount } from 'vue'
import { updateBookmarkProperty } from '@/utils/bookmark'
import { useTag } from '@/hooks/use-tag'
import message from '@/utils/message'

const props = defineProps({
    item: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['saved'])

// 编辑状态
const editData = reactive({
    alias: props.item.alias || '',
    tags: [...(props.item.tags || [])]
})

// 获取标签管理器
const { tagList, addTag, addTagCount, reduceTagCount } = useTag()

// 下拉列表状态
const isDropdownOpen = ref(false)
const tagSelectorRef = ref(null)

// 标签输入
const tagInput = ref('')

// 监听 item 变化，更新编辑数据
watch(
    () => props.item,
    newItem => {
        if (newItem) {
            editData.alias = newItem.alias || ''
            editData.tags = [...(newItem.tags || [])]
        }
    },
    { immediate: true }
)

// 保存别名
const saveAlias = async () => {
    if (editData.alias.trim() === props.item.alias) {
        return // 没有变化
    }

    const success = updateBookmarkProperty({
        guid: props.item.guid,
        browser: props.item.browser,
        key: 'alias',
        value: editData.alias.trim()
    })

    if (success) {
        message.success('别名保存成功')
    } else {
        message.error('别名保存失败')
    }
}

// 判断标签是否被选中
const isTagSelected = tagName => {
    return editData.tags.includes(tagName)
}

// 过滤后的标签列表
const filteredTagList = computed(() => {
    const keyword = tagInput.value.trim().toLowerCase()
    if (!keyword) {
        return tagList.value
    }
    return tagList.value.filter(tag =>
        tag.tagName.toLowerCase().includes(keyword)
    )
})

// 检查输入的标签是否已存在于全局标签列表
const isNewTag = computed(() => {
    const keyword = tagInput.value.trim()
    if (!keyword) return false
    return !tagList.value.some(tag => tag.tagName === keyword)
})

// 处理输入框回车 - 添加新标签
const handleInputEnter = e => {
    e.preventDefault()
    e.stopPropagation()

    const tagName = tagInput.value.trim()
    if (!tagName) return

    // 检查是否已在当前书签中选中
    if (editData.tags.includes(tagName)) {
        message.warning('该标签已添加')
        tagInput.value = ''
        return
    }

    // 检查是否是新标签（不存在于全局标签列表）
    const existsInGlobal = tagList.value.some(tag => tag.tagName === tagName)

    if (!existsInGlobal) {
        // 添加到全局标签系统
        const addResult = addTag(tagName)
        if (!addResult.success) {
            message.warning(addResult.message)
            return
        }
    }

    // 添加到当前书签
    editData.tags.push(tagName)

    const success = updateBookmarkProperty({
        guid: props.item.guid,
        browser: props.item.browser,
        key: 'tags',
        value: editData.tags
    })

    if (success) {
        addTagCount(tagName)
        tagInput.value = ''
    } else {
        // 撤销
        editData.tags.pop()
        message.error('标签添加失败')
    }
}

// 切换标签选中状态
const toggleTag = tag => {
    const tagName = tag.tagName
    const isSelected = isTagSelected(tagName)

    if (isSelected) {
        // 取消选中 - 从当前书签移除标签
        const index = editData.tags.indexOf(tagName)
        if (index === -1) return

        editData.tags.splice(index, 1)

        const success = updateBookmarkProperty({
            guid: props.item.guid,
            browser: props.item.browser,
            key: 'tags',
            value: editData.tags
        })

        if (success) {
            reduceTagCount(tagName)
        } else {
            // 撤销
            editData.tags.splice(index, 0, tagName)
            message.error('标签移除失败')
        }
    } else {
        // 选中 - 添加标签到当前书签
        editData.tags.push(tagName)

        const success = updateBookmarkProperty({
            guid: props.item.guid,
            browser: props.item.browser,
            key: 'tags',
            value: editData.tags
        })

        if (success) {
            addTagCount(tagName)
        } else {
            // 撤销
            editData.tags.pop()
            message.error('标签添加失败')
        }
    }
}

// 删除已选标签（从选中标签区域点击x）
const removeTag = tagName => {
    const index = editData.tags.indexOf(tagName)
    if (index === -1) return

    editData.tags.splice(index, 1)

    const success = updateBookmarkProperty({
        guid: props.item.guid,
        browser: props.item.browser,
        key: 'tags',
        value: editData.tags
    })

    if (success) {
        reduceTagCount(tagName)
    } else {
        // 撤销删除
        editData.tags.splice(index, 0, tagName)
        message.error('标签移除失败')
    }
}

// 打开/关闭下拉列表
const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value
}

// 点击外部关闭下拉列表
const handleClickOutside = event => {
    if (tagSelectorRef.value && !tagSelectorRef.value.contains(event.target)) {
        isDropdownOpen.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
    <div
        class="bookmark-edit"
        @keydown.stop="1"
        @keyup.stop="1"
        @keypress.stop="1"
        @click.stop="1"
    >
        <!-- 编辑表单内容 -->
        <div class="edit-form">
            <div class="form-item">
                <label class="form-label">名称：</label>
                <div class="form-value">{{ item.name }}</div>
            </div>

            <div class="form-item">
                <label class="form-label">别名：</label>
                <div class="form-input-group">
                    <input
                        v-model="editData.alias"
                        type="text"
                        class="form-input"
                        placeholder="输入别名"
                        @blur="saveAlias"
                        @keyup.enter="saveAlias"
                    />
                </div>
            </div>

            <div class="form-item">
                <label class="form-label">URL：</label>
                <div class="form-value">{{ item.url }}</div>
            </div>

            <div class="form-item">
                <label class="form-label">浏览器：</label>
                <div class="form-value">{{ item.browser }}</div>
            </div>

            <div class="form-item">
                <label class="form-label">标签：</label>
                <div class="form-tags-group">
                    <!-- 标签选择器 -->
                    <div
                        ref="tagSelectorRef"
                        class="tag-selector"
                    >
                        <!-- 已选标签展示区域 + 输入框 -->
                        <div
                            class="tag-selector-input"
                            @click="toggleDropdown"
                        >
                            <span
                                v-for="tag in editData.tags"
                                :key="tag"
                                class="selected-tag"
                            >
                                {{ tag }}
                                <button
                                    class="tag-remove"
                                    @click.stop="removeTag(tag)"
                                    title="删除标签"
                                >
                                    ×
                                </button>
                            </span>
                            <input
                                ref="tagInputRef"
                                v-model="tagInput"
                                type="text"
                                class="tag-input-inline"
                                placeholder="输入或选择标签"
                                @click.stop="isDropdownOpen = true"
                                @keyup.enter="handleInputEnter"
                                @input="isDropdownOpen = true"
                            />
                        </div>

                        <!-- 下拉列表 -->
                        <div
                            v-show="isDropdownOpen"
                            ref="dropdownRef"
                            class="tag-dropdown"
                        >
                            <!-- 新建标签提示 -->
                            <div
                                v-if="isNewTag"
                                class="dropdown-item create-new"
                                @click="handleInputEnter($event)"
                            >
                                <span class="tag-indicator new"></span>
                                <span class="tag-name">
                                    创建标签 "<strong>{{
                                        tagInput.trim()
                                    }}</strong
                                    >"
                                </span>
                                <span class="tag-hint">回车添加</span>
                            </div>

                            <div
                                v-if="filteredTagList.length === 0 && !isNewTag"
                                class="dropdown-empty"
                            >
                                暂无标签，输入标签名回车添加
                            </div>
                            <div
                                v-for="tag in filteredTagList"
                                :key="tag.tagName"
                                class="dropdown-item"
                                :class="{
                                    selected: isTagSelected(tag.tagName)
                                }"
                                @click="toggleTag(tag)"
                            >
                                <span class="tag-indicator"></span>
                                <span class="tag-name">{{ tag.tagName }}</span>
                                <span
                                    v-if="isTagSelected(tag.tagName)"
                                    class="tag-check"
                                >
                                    ✓
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.bookmark-edit {
    .edit-form {
        .form-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 16px;

            &:last-child {
                margin-bottom: 0;
            }

            .form-label {
                min-width: 60px;
                font-size: 14px;
                font-weight: 500;
                color: var(--color-text-body);
                margin-right: 12px;
                line-height: 32px;
                padding-top: 4px;
            }

            .form-value {
                flex: 1;
                font-size: 14px;
                color: var(--color-text-body);
                line-height: 20px;
                word-break: break-all;
                padding: 6px 0;
            }

            .form-input-group {
                flex: 1;

                .form-input {
                    width: 100%;
                    padding: 6px 12px;
                    border: 1px solid var(--color-border);
                    border-radius: 4px;
                    font-size: 14px;
                    color: var(--color-text-body);
                    background: var(--color-bg);
                    outline: none;
                    transition: border-color 0.3s ease;

                    &:focus {
                        border-color: var(--color-primary);
                    }

                    &::placeholder {
                        color: var(--color-text-tip);
                    }
                }
            }

            .form-tags-group {
                flex: 1;

                .tag-selector {
                    position: relative;

                    .tag-selector-input {
                        min-height: 36px;
                        padding: 4px 8px;
                        border: 1px solid var(--color-border);
                        border-radius: 4px;
                        background: var(--color-bg);
                        cursor: pointer;
                        display: flex;
                        flex-wrap: wrap;
                        gap: 6px;
                        align-items: center;
                        transition: border-color 0.3s ease;

                        &:hover {
                            border-color: var(--color-primary);
                        }

                        .tag-input-inline {
                            flex: 1;
                            min-width: 100px;
                            border: none;
                            background: transparent;
                            outline: none;
                            font-size: 14px;
                            color: var(--color-text-body);
                            padding: 2px 0;

                            &::placeholder {
                                color: var(--color-text-tip);
                            }
                        }

                        .selected-tag {
                            display: inline-flex;
                            align-items: center;
                            padding: 2px 6px;
                            background: var(--color-bg-hover);
                            border: 1px solid var(--color-border);
                            border-radius: 4px;
                            font-size: 12px;
                            color: var(--color-text-body);

                            .tag-remove {
                                margin-left: 4px;
                                padding: 0;
                                border: none;
                                background: transparent;
                                color: var(--color-text-tip);
                                cursor: pointer;
                                font-size: 14px;
                                line-height: 1;
                                width: 14px;
                                height: 14px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                border-radius: 2px;
                                transition: all 0.2s ease;

                                &:hover {
                                    background: var(--color-bg-active);
                                    color: var(--color-text-body);
                                }
                            }
                        }
                    }

                    .tag-dropdown {
                        position: absolute;
                        top: 100%;
                        left: 0;
                        right: 0;
                        margin-top: 4px;
                        max-height: 200px;
                        overflow-y: auto;
                        background: var(--color-bg);
                        border: 1px solid var(--color-border);
                        border-radius: 4px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                        z-index: 100;

                        .dropdown-empty {
                            padding: 12px;
                            text-align: center;
                            color: var(--color-text-tip);
                            font-size: 13px;
                        }

                        .dropdown-item {
                            display: flex;
                            align-items: center;
                            padding: 8px 12px;
                            cursor: pointer;
                            transition: background 0.2s ease;

                            &:hover {
                                background: var(--color-bg-hover);
                            }

                            .tag-indicator {
                                width: 8px;
                                height: 8px;
                                border-radius: 50%;
                                background: var(--color-text-tip);
                                margin-right: 10px;
                                flex-shrink: 0;
                            }

                            .tag-name {
                                flex: 1;
                                font-size: 14px;
                                color: var(--color-text-body);
                            }

                            .tag-check {
                                color: var(--color-primary);
                                font-size: 14px;
                                font-weight: bold;
                            }

                            &.selected {
                                .tag-indicator {
                                    background: var(--color-primary);
                                }

                                .tag-name {
                                    color: var(--color-primary);
                                }
                            }

                            &.create-new {
                                border-bottom: 1px solid var(--color-border);

                                .tag-indicator.new {
                                    background: var(--color-primary);
                                }

                                .tag-name {
                                    color: var(--color-primary);

                                    strong {
                                        font-weight: 600;
                                    }
                                }

                                .tag-hint {
                                    font-size: 12px;
                                    color: var(--color-text-tip);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
