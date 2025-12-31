<script setup>
import Fuse from 'fuse.js'
import { inject, ref, computed, watch } from 'vue'
import { useVirtualList, useMemoize } from '@vueuse/core'
import { Edit, CopyDocument } from '@element-plus/icons-vue'
import { highlightText } from '@/utils'

const appContext = inject('appContext')
const { onChanged } = appContext

// 当前搜索关键词
const searchText = ref('')

// 创建带缓存的高亮函数
const memoizedHighlight = useMemoize(
    (text, keyword) => highlightText(text, keyword),
    { getKey: (text, keyword) => `${text}__${keyword}` }
)

// 当 searchText 变化时，清除缓存
watch(searchText, () => {
    memoizedHighlight.clear()
})

// 过滤后的书签列表 - 响应式计算属性
const filterBookmarks = computed(() => {
    if (!searchText.value) {
        return appContext.bookmarks.value
    }
    return matchBookmarks(searchText.value)
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

const { list, containerProps, wrapperProps } = useVirtualList(filterBookmarks, {
    itemHeight: 70
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
                v-for="({ data: item }, index) in list"
                :key="index"
                class="list-item"
                @contextmenu="handleContextMenu($event, index)"
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
                    v-if="activeItemIndex === index"
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

        &:hover {
            background: var(--color-bg-hover);
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
