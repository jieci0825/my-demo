<script setup>
import Fuse from 'fuse.js'
import { inject, ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useVirtualList, useMemoize } from '@vueuse/core'
import { Edit, CopyDocument } from '@element-plus/icons-vue'
import { highlightText } from '@/utils'
import dbTool from '@/utils/storage'

const appContext = inject('appContext')
const { onChanged } = appContext

// 当前搜索关键词
const searchText = ref('')

// 当前选中项的索引（基于过滤后的列表）
const selectedIndex = ref(0)

// 创建带缓存的高亮函数
const memoizedHighlight = useMemoize(
    (text, keyword) => highlightText(text, keyword),
    { getKey: (text, keyword) => `${text}__${keyword}` }
)

// 当 searchText 变化时，清除缓存并重置选中索引
watch(searchText, () => {
    memoizedHighlight.clear()
    selectedIndex.value = 0
})

// 过滤后的书签列表 - 响应式计算属性
const filterBookmarks = computed(() => {
    if (!searchText.value) {
        return appContext.bookmarks.value
    }
    return matchBookmarks(searchText.value)
})

// 当过滤列表变化时，确保选中索引在有效范围内
watch(filterBookmarks, newList => {
    if (selectedIndex.value >= newList.length) {
        selectedIndex.value = Math.max(0, newList.length - 1)
    }
})

/**
 * 根据关键词匹配书签
 */
function matchBookmarks(text) {
    const fuse = new Fuse(appContext.bookmarks.value, {
        keys: ['name', 'alias', 'url'],
        threshold: 0.4 // 越小越严格
    })

    if (!text) {
        return appContext.bookmarks.value
    }

    // Fuse.js search 返回的是结果对象数组，需要提取 item 属性
    const results = fuse.search(text)
    return results.map(result => result.item)
}

onChanged(text => {
    searchText.value = text
})

const ITEM_HEIGHT = 70

const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(
    filterBookmarks,
    {
        itemHeight: ITEM_HEIGHT
    }
)

/**
 * 打开书签 URL
 */
function openBookmark(item) {
    if (!item?.url) return

    // 如果有 guid，则更新使用统计
    if (item.guid) {
        const currentUsage = dbTool.get('urlUsageCount') || {}
        const currentCount = currentUsage[item.guid] || 0
        currentUsage[item.guid] = currentCount + 1
        dbTool.set('urlUsageCount', currentUsage)
    }

    if (window.utools) {
        window.utools.shellOpenExternal(item.url)
        window.utools.hideMainWindow()
    } else {
        // 开发环境降级处理
        window.open(item.url, '_blank')
    }
}

/**
 * 处理点击事件
 */
function handleItemClick(item, index) {
    selectedIndex.value = index
    openBookmark(item)
}

/**
 * 获取可视区域信息
 */
function getVisibleRange() {
    const container = containerProps.ref.value
    if (!container) return { firstVisible: 0, lastVisible: 0, visibleCount: 0 }

    const scrollTop = container.scrollTop
    const containerHeight = container.clientHeight
    const visibleCount = Math.floor(containerHeight / ITEM_HEIGHT)

    // 使用 Math.ceil 确保只有完全显示的 item 才被认为是第一个可见项
    // 这样当 item 顶部被遮住时，向上滚动会触发滚动使其完全显示
    const firstFullyVisible = Math.ceil(scrollTop / ITEM_HEIGHT)
    // 使用 Math.floor 计算最后一个完全可见的 item
    const lastFullyVisible =
        Math.floor((scrollTop + containerHeight) / ITEM_HEIGHT) - 1

    return {
        firstVisible: firstFullyVisible,
        lastVisible: lastFullyVisible,
        visibleCount,
        scrollTop,
        containerHeight
    }
}

/**
 * 处理键盘事件
 */
function handleKeydown(e) {
    const listLength = filterBookmarks.value.length
    if (listLength === 0) return

    const container = containerProps.ref.value
    if (!container) return

    switch (e.key) {
        case 'ArrowUp':
            e.preventDefault()
            if (selectedIndex.value > 0) {
                const { firstVisible } = getVisibleRange()
                const newIndex = selectedIndex.value - 1

                // 如果新选中项在可视区域第一项之上，需要滚动
                if (newIndex < firstVisible) {
                    container.scrollTop = newIndex * ITEM_HEIGHT
                }

                selectedIndex.value = newIndex
            }
            break
        case 'ArrowDown':
            e.preventDefault()
            if (selectedIndex.value < listLength - 1) {
                const { lastVisible, containerHeight } = getVisibleRange()
                const newIndex = selectedIndex.value + 1

                // 如果新选中项超出可视区域最后一项，需要滚动
                if (newIndex > lastVisible) {
                    // 滚动使新选中项位于可视区域底部
                    container.scrollTop =
                        (newIndex + 1) * ITEM_HEIGHT - containerHeight
                }

                selectedIndex.value = newIndex
            }
            break
        case 'Enter':
            e.preventDefault()
            const currentItem = filterBookmarks.value[selectedIndex.value]
            if (currentItem) {
                openBookmark(currentItem)
            }
            break
    }
}

// 注册全局键盘事件
onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
})

// 右键菜单相关状态
const activeItemIndex = ref(null)

// 处理右键菜单
const handleContextMenu = (e, index) => {
    e.preventDefault()
    activeItemIndex.value = index
}

// 处理鼠标离开
const handleMouseLeave = () => {
    activeItemIndex.value = null
}

// 编辑功能
const handleEdit = item => {
    // TODO: 实现编辑功能
}

// 复制链接功能
const handleCopyLink = item => {
    if (navigator.clipboard && item.url) {
        navigator.clipboard
            .writeText(item.url)
            .then(() => {})
            .catch(err => {
                console.error('复制失败:', err)
            })
    }
}
</script>

<template>
    <div
        class="container"
        v-bind="containerProps"
    >
        <div v-bind="wrapperProps">
            <div
                v-for="{ data: item, index: originalIndex } in list"
                :key="originalIndex"
                class="list-item"
                :class="{ 'is-selected': selectedIndex === originalIndex }"
                @click="handleItemClick(item, originalIndex)"
                @contextmenu="handleContextMenu($event, originalIndex)"
                @mouseleave="handleMouseLeave"
            >
                <div class="list-item-icon">
                    <img
                        v-if="item.browser === 'chrome'"
                        src="/public/chrome.png"
                    />
                    <img
                        v-else-if="item.browser === 'edge'"
                        src="/public/edge.png"
                    />
                </div>
                <div class="list-item-content">
                    <div class="content-top">
                        <div
                            class="content-top-title"
                            v-html="memoizedHighlight(item.name, searchText)"
                        ></div>
                        <div
                            class="content-top-alias"
                            v-if="item.alias"
                        >
                            <span
                                v-html="
                                    memoizedHighlight(item.alias, searchText)
                                "
                            ></span>
                        </div>
                    </div>
                    <div class="content-middle">
                        <div
                            class="content-middle-url"
                            v-html="memoizedHighlight(item.url, searchText)"
                        ></div>
                    </div>
                    <div class="content-bottom">
                        <div
                            class="content-bottom-tags"
                            v-if="item?.tags?.length"
                        >
                            <div
                                class="tag"
                                v-for="tag in item.tags"
                                :key="tag"
                            >
                                <span
                                    v-html="memoizedHighlight(tag, searchText)"
                                ></span>
                            </div>
                        </div>
                        <div class="content-bottom-group">
                            <span
                                v-html="
                                    memoizedHighlight(
                                        item?.path?.join(' > '),
                                        searchText
                                    )
                                "
                            ></span>
                        </div>
                    </div>
                </div>

                <!-- 右键蒙层菜单 -->
                <div
                    v-if="activeItemIndex === originalIndex"
                    class="context-menu-overlay"
                >
                    <div class="menu-buttons">
                        <div
                            class="menu-btn btn-edit"
                            @click="handleEdit(item)"
                            title="编辑"
                        >
                            <Edit
                                color="#171717"
                                :size="14"
                            />
                        </div>
                        <div
                            class="menu-btn btn-copy"
                            @click="handleCopyLink(item)"
                            title="复制链接"
                        >
                            <CopyDocument
                                color="#171717"
                                :size="14"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.container {
    width: 100%;
    height: 100%;
    overflow: hidden auto;

    .list-item {
        height: 70px;
        box-sizing: border-box;
        border-bottom: 1px solid var(--color-border);
        background: var(--color-bg);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        user-select: none;
        display: flex;
        align-items: center;
        padding: 10px 16px;
        position: relative;

        &:first-child {
            border-top: 1px solid var(--color-border);
        }

        &:hover {
            background: var(--color-bg-hover);
        }

        &.is-selected {
            background: var(--color-bg-hover);
            border-left: 3px solid var(--color-text-highlight);
            padding-left: 13px;
        }

        .list-item-icon {
            width: 40px;
            height: 40px;
            margin-right: 10px;
            border-radius: 50%;
            overflow: hidden;
            flex-shrink: 0;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 50%;
            }
        }

        .list-item-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            overflow: hidden;

            .content-top {
                display: flex;

                .content-top-title {
                    font-size: 14px;
                    font-weight: bold;
                    color: var(--color-text-title);
                }

                .content-top-alias {
                    font-size: 14px;
                    color: var(--color-text-tip);
                }
            }

            .content-middle {
                margin-bottom: 3px;
                .content-middle-url {
                    font-size: 14px;
                    color: var(--color-text-body);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }

            .content-bottom {
                display: flex;
                align-items: center;

                .content-bottom-tags {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .content-bottom-group {
                    font-size: 12px;
                    color: var(--color-text-tip);
                }
            }
        }

        // 右键蒙层菜单样式
        .context-menu-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
            backdrop-filter: blur(2px);

            .menu-buttons {
                display: flex;
                gap: 30px;
                align-items: center;

                .menu-btn {
                    width: 25px;
                    height: 25px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-size: 14px;

                    &:hover {
                        transform: scale(1.15);
                    }

                    &:active {
                        transform: scale(1.05);
                    }
                }
            }
        }
    }
}
</style>
