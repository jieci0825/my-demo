<script setup>
import { ref, onMounted, inject } from 'vue'
import CButton from '@/components/c-button/index.vue'
import { dbTool, SETTINGS_KEY, message } from '@/utils'
import { useTheme } from '@/hooks'

const emit = defineEmits(['close', 'saved'])

const appContext = inject('appContext')
const { refreshBookmarks } = appContext

// 配置项
const config = ref({
    chromePath: '',
    edgePath: '',
    sortType: 'default', // default | usage
    matchType: 'multiple', // multiple | exact
    theme: false, // false: light, true: dark
    splitCharHighlight: false // 是否开启单字符拆分高亮
})

const { setTheme } = useTheme()

// 从数据库加载配置
const loadConfig = () => {
    const savedConfig = dbTool.get(SETTINGS_KEY)
    if (savedConfig) {
        config.value = { ...config.value, ...savedConfig }
    }
}

// 保存配置
const saveConfig = () => {
    const success = dbTool.set(SETTINGS_KEY, config.value)
    if (success) {
        // 应用主题设置
        setTheme(config.value.theme)
        // 刷新书签数据（如果路径有变化）
        refreshBookmarks()
        message.success('设置保存成功！')
        // 通知设置已保存
        emit('saved')
        // 成功则关闭设置界面
        emit('close')
    } else {
        message.error('设置保存失败！')
    }
}

// 选择 Chrome 书签文件
const selectChromeFile = () => {
    const result = utools.showOpenDialog({
        title: '选择 Chrome 书签文件',
        filters: [
            { name: 'Bookmarks', extensions: ['*'] },
            { name: 'All Files', extensions: ['*'] }
        ],
        properties: ['openFile']
    })

    if (result && result.length > 0) {
        config.value.chromePath = result[0]
    }
}

// 选择 Edge 书签文件
const selectEdgeFile = () => {
    const result = utools.showOpenDialog({
        title: '选择 Edge 书签文件',
        filters: [
            { name: 'Bookmarks', extensions: ['*'] },
            { name: 'All Files', extensions: ['*'] }
        ],
        properties: ['openFile']
    })

    if (result && result.length > 0) {
        config.value.edgePath = result[0]
    }
}

onMounted(() => {
    loadConfig()
})
</script>

<template>
    <div class="settings">
        <div class="settings__content">
            <!-- 书签文件配置 -->
            <section class="settings__section">
                <h3 class="settings__section-title">书签文件</h3>

                <!-- Chrome 书签 -->
                <div class="settings__item">
                    <label class="settings__label">
                        <img
                            src="/chrome.png"
                            alt="Chrome"
                            class="settings__icon"
                        />
                        Chrome 书签文件
                    </label>
                    <div class="settings__file-input">
                        <input
                            v-model="config.chromePath"
                            type="text"
                            class="settings__input"
                            placeholder="请选择或输入 Chrome 书签文件路径"
                        />
                        <CButton
                            size="small"
                            @click="selectChromeFile"
                        >
                            浏览
                        </CButton>
                    </div>
                </div>

                <!-- Edge 书签 -->
                <div class="settings__item">
                    <label class="settings__label">
                        <img
                            src="/edge.png"
                            alt="Edge"
                            class="settings__icon"
                        />
                        Edge 书签文件
                    </label>
                    <div class="settings__file-input">
                        <input
                            v-model="config.edgePath"
                            type="text"
                            class="settings__input"
                            placeholder="请选择或输入 Edge 书签文件路径"
                        />
                        <CButton
                            size="small"
                            @click="selectEdgeFile"
                        >
                            浏览
                        </CButton>
                    </div>
                </div>
            </section>

            <!-- 排序方式 -->
            <!-- <section class="settings__section">
                <h3 class="settings__section-title">排序方式</h3>
                <div class="settings__item">
                    <div class="settings__radio-group">
                        <label class="settings__radio">
                            <input
                                v-model="config.sortType"
                                type="radio"
                                value="default"
                            />
                            <span class="settings__radio-label">默认排序</span>
                        </label>
                        <label class="settings__radio">
                            <input
                                v-model="config.sortType"
                                type="radio"
                                value="usage"
                            />
                            <span class="settings__radio-label"
                                >使用次数排序</span
                            >
                        </label>
                    </div>
                </div>
            </section> -->

            <!-- 匹配方式 -->
            <!-- <section class="settings__section">
                <h3 class="settings__section-title">匹配方式</h3>
                <div class="settings__item">
                    <div class="settings__radio-group">
                        <label class="settings__radio">
                            <input
                                v-model="config.matchType"
                                type="radio"
                                value="multiple"
                            />
                            <span class="settings__radio-label"
                                >多关键词匹配</span
                            >
                        </label>
                        <label class="settings__radio">
                            <input
                                v-model="config.matchType"
                                type="radio"
                                value="exact"
                            />
                            <span class="settings__radio-label">精准匹配</span>
                        </label>
                    </div>
                </div>
            </section> -->

            <!-- 主题设置 -->
            <section class="settings__section">
                <h3 class="settings__section-title">主题设置</h3>
                <div class="settings__item">
                    <div class="settings__radio-group">
                        <label class="settings__radio">
                            <input
                                v-model="config.theme"
                                type="radio"
                                :value="false"
                            />
                            <span class="settings__radio-label">明亮主题</span>
                        </label>
                        <label class="settings__radio">
                            <input
                                v-model="config.theme"
                                type="radio"
                                :value="true"
                            />
                            <span class="settings__radio-label">黑暗主题</span>
                        </label>
                    </div>
                </div>
            </section>

            <!-- 高亮设置 -->
            <section class="settings__section">
                <h3 class="settings__section-title">高亮设置</h3>
                <div class="settings__item">
                    <label class="settings__checkbox">
                        <input
                            v-model="config.splitCharHighlight"
                            type="checkbox"
                        />
                        <span class="settings__checkbox-label"
                            >开启单字符拆分高亮</span
                        >
                    </label>
                    <p class="settings__hint">
                        开启后，搜索关键词会拆分成单个字符进行高亮匹配（可能影响性能）
                    </p>
                </div>
            </section>

            <!-- 保存按钮 -->
            <div class="settings__actions">
                <CButton @click="emit('close')"> 取消 </CButton>
                <CButton
                    type="primary"
                    @click="saveConfig"
                >
                    保存设置
                </CButton>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.settings {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: 24px;

    &__content {
        max-width: 800px;
        margin: 0 auto;
    }

    &__section {
        margin-bottom: 32px;

        &:last-of-type {
            margin-bottom: 24px;
        }
    }

    &__section-title {
        font-size: 16px;
        font-weight: 600;
        color: var(--color-text-title);
        margin: 0 0 16px 0;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--color-border);
    }

    &__item {
        margin-bottom: 20px;

        &:last-child {
            margin-bottom: 0;
        }
    }

    &__label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: var(--color-text-body);
        margin-bottom: 8px;
        font-weight: 500;
    }

    &__icon {
        width: 20px;
        height: 20px;
        object-fit: contain;
    }

    &__file-input {
        display: flex;
        gap: 8px;
        align-items: center;
    }

    &__input {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid var(--color-border);
        border-radius: 4px;
        background: var(--color-bg);
        color: var(--color-text-body);
        font-size: 14px;
        outline: none;
        transition: all 0.3s ease;

        &:focus {
            border-color: var(--color-border-active);
        }

        &::placeholder {
            color: var(--color-text-tip);
        }
    }

    &__radio-group {
        display: flex;
        gap: 24px;
        flex-wrap: wrap;
    }

    &__radio {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        user-select: none;

        input[type='radio'] {
            width: 16px;
            height: 16px;
            cursor: pointer;
            accent-color: var(--color-accent);
        }
    }

    &__radio-label {
        font-size: 14px;
        color: var(--color-text-body);
    }

    &__checkbox {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        user-select: none;

        input[type='checkbox'] {
            width: 16px;
            height: 16px;
            cursor: pointer;
            accent-color: var(--color-accent);
        }
    }

    &__checkbox-label {
        font-size: 14px;
        color: var(--color-text-body);
    }

    &__hint {
        margin: 8px 0 0 24px;
        font-size: 12px;
        color: var(--color-text-tip);
    }

    &__actions {
        margin-top: 32px;
        padding-top: 24px;
        border-top: 1px solid var(--color-border);
        display: flex;
        justify-content: flex-end;
        gap: 20px;
    }
}
</style>
