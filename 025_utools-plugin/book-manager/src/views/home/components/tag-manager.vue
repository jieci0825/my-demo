<script setup>
import { ref, computed } from 'vue'
import { useTag } from '@/hooks/use-tag'

// 使用 useTag hook
const { tagList, addTag, delTag } = useTag()

// 输入框的值
const inputValue = ref('')

// 已有标签数量
const tagCount = computed(() => tagList.value.length)

// 处理回车添加标签
const handleAddTag = () => {
    addTag(inputValue.value)
    inputValue.value = ''
}

// 删除标签
const handleRemoveTag = index => {
    delTag(index)
}
</script>

<template>
    <div class="tag-manager">
        <div class="tag-manager__input-section">
            <input
                v-model="inputValue"
                type="text"
                class="tag-manager__input"
                placeholder="输入标签名称后按回车添加"
                @keyup.enter="handleAddTag"
            />
            <div class="tag-manager__count">
                已有标签：<span class="tag-manager__count-num">{{
                    tagCount
                }}</span>
                个
            </div>
        </div>

        <div class="tag-manager__list">
            <div
                v-for="(tag, index) in tagList"
                :key="tag.createTime"
                class="tag-manager__item"
            >
                <span class="tag-manager__item-text">{{ tag.tagName }}</span>
                <button
                    class="tag-manager__item-remove"
                    @click="handleRemoveTag(index)"
                >
                    <svg
                        viewBox="0 0 1024 1024"
                        width="12"
                        height="12"
                    >
                        <path
                            fill="currentColor"
                            d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"
                        />
                    </svg>
                </button>
            </div>
        </div>

        <div
            v-if="tagList.length === 0"
            class="tag-manager__empty"
        >
            暂无标签，请在上方输入框中添加
        </div>
    </div>
</template>

<style scoped lang="scss">
.tag-manager {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 24px;

    &__input-section {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    &__input {
        width: 100%;
        padding: 12px 16px;
        font-size: 14px;
        border: 1px solid var(--color-border);
        border-radius: 6px;
        background: var(--color-bg);
        color: var(--color-text-body);
        outline: none;
        transition: all 0.3s ease;

        &:hover {
            border-color: var(--color-border-active);
        }

        &:focus {
            border-color: var(--color-border-active);
            box-shadow: 0 0 0 2px var(--color-bg-hover);
        }

        &::placeholder {
            color: var(--color-text-tip);
        }
    }

    &__count {
        font-size: 14px;
        color: var(--color-text-tip);
        display: flex;
        align-items: center;
        gap: 4px;
    }

    &__count-num {
        font-weight: 600;
        color: var(--color-accent);
        font-size: 16px;
    }

    &__list {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        align-content: flex-start;
        overflow-y: auto;
        padding: 4px;
    }

    &__item {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 4px 8px;
        background: var(--color-bg-hover);
        border: 1px solid var(--color-border);
        border-radius: 6px;
        font-size: 14px;
        color: var(--color-text-body);
        transition: all 0.3s ease;

        &:hover {
            background: var(--color-bg-sub);
            border-color: var(--color-border-active);
        }
    }

    &__item-text {
        user-select: none;
    }

    &__item-remove {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        border: none;
        border-radius: 50%;
        background: transparent;
        color: var(--color-text-tip);
        cursor: pointer;
        transition: all 0.3s ease;
        outline: none;
        padding: 0;

        &:hover {
            background: rgba(255, 77, 79, 0.1);
            color: #ff4d4f;
        }

        &:active {
            transform: scale(0.9);
        }
    }

    &__empty {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-text-tip);
        font-size: 14px;
    }
}
</style>
