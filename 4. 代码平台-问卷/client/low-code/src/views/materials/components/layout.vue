<script setup lang="ts">
import EditPanel from '@/components/survey-comps/edit-items/edit-panel.vue'
import { GET_PIC_LINK, UPDATE_STATE } from '@/constants'
import { useMaterialStore } from '@/stores/use-material'
import { isNumber, isObjectWithKeys, isString } from '@/utils'
import { computed, provide } from 'vue'
import { ElMessage } from 'element-plus'
import type { OptionEditCompStatus, PicLink } from '@/types'

const materialStore = useMaterialStore()

const currentComp = computed(() => {
    return materialStore.comps[materialStore.currentMaterialComp]
})

const updateState = (confKey: string, payload?: string | number | boolean | PicLink) => {
    switch (confKey) {
        case 'title':
        case 'desc':
        case 'titleColor':
        case 'descColor':
            if (isString(payload)) {
                materialStore.setTextState(currentComp.value.editCompConfig[confKey], payload)
            }
            break
        case 'options':
            const curEditCompConf = currentComp.value.editCompConfig as OptionEditCompStatus
            const addOption = materialStore.addOption()
            // payload 为数值时，表示为索引，进行删除选项
            if (isNumber(payload)) {
                const result = materialStore.removeOption(curEditCompConf[confKey], payload)
                if (result) return ElMessage.success('删除成功')
                ElMessage.error('至少保留两个选项')
            }
            // 限定为图片链接类型
            else if (isObjectWithKeys<PicLink>(payload, ['link', 'idx'])) {
                materialStore.setPicLinkByIndex(curEditCompConf[confKey], payload)
            } else {
                addOption(curEditCompConf[confKey], payload)
            }
            break
        case 'position':
        case 'titleSize':
        case 'descSize':
        case 'titleBold':
        case 'descBold':
        case 'titleSlant':
        case 'descSlant':
            if (isNumber(payload)) {
                materialStore.updateCurrentState(currentComp.value.editCompConfig[confKey], payload)
            }
            break
    }
}

const getPicLink = (payload: PicLink) => {
    updateState('options', payload)
}

provide(UPDATE_STATE, updateState)
provide(GET_PIC_LINK, getPicLink)
</script>

<template>
    <div class="layout-container flex">
        <!-- 选择业务组件 -->
        <div class="left p-20">
            <slot>选择业务组件</slot>
        </div>
        <!-- 展示业务组件 -->
        <div class="center p-20">
            <router-view v-slot="{ Component }">
                <Component
                    :editCompConfig="currentComp.editCompConfig"
                    :sn="1"
                    :is="Component"
                />
            </router-view>
        </div>
        <!-- 编辑业务组件 -->
        <div class="right">
            <EditPanel :comp="currentComp"></EditPanel>
        </div>
    </div>
</template>

<style scoped lang="scss">
.layout-container {
    height: 100%;
    height: calc(100vh - 60px - 40px);
    overflow: hidden;
    align-items: flex-start;
    border: 1px solid var(--border-color);
    border-top-right-radius: var(--border-radius-large);
    border-bottom-right-radius: var(--border-radius-large);
    border-bottom-left-radius: var(--border-radius-large);
    .left {
        width: 240px;
        height: 100%;
    }
    .center {
        flex: 1;
        height: 100%;
        overflow-y: auto;
        border-left: 1px solid var(--border-color);
    }
    .right {
        width: 320px;
        height: 100%;
        border-left: 1px solid var(--border-color);
        overflow-y: auto;
    }
}
</style>
