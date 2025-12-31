<script setup>
import { inject } from 'vue'
import { useVirtualList } from '@vueuse/core'

const appContext = inject('appContext')

const { list, containerProps, wrapperProps } = useVirtualList(
    appContext.bookmarks,
    {
        itemHeight: 70
    }
)
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
                        <div class="content-top-title">{{ item.name }}</div>
                        <div
                            class="content-top-alias"
                            v-if="item.alias"
                        >
                            （{{ item.alias }}）
                        </div>
                    </div>
                    <div class="content-middle">
                        <div class="content-middle-url">{{ item.url }}</div>
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
                                {{ tag }}
                            </div>
                        </div>
                        <div class="content-bottom-group">
                            {{ item?.path?.join(' > ') }}
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
                    color: var(--color-text-tip);
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
    }
}
</style>
