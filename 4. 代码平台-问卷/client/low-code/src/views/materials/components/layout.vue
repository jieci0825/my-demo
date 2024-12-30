<script setup lang="ts">
import EditPanel from '@/components/survey-comps/edit-items/edit-panel.vue'
import { UPDATE_STATE } from '@/constants'
import { useMaterialStore } from '@/stores/use-material'
import { isNumber, isString } from '@/utils'
import { computed, provide } from 'vue'
import type { OptionEditCompStatus } from '@/types'

const materialStore = useMaterialStore()

const currentComp = computed(() => {
    return materialStore.comps[materialStore.currentMaterialComp]
})

const updateState = (confKey: string, payload?: string | number | boolean | object) => {
    switch (confKey) {
        case 'title':
        case 'desc':
            if (isString(payload)) {
                materialStore.setTextState(currentComp.value.editCompConfig[confKey], payload)
            }
            break
        case 'options':
            const curEditCompConf = currentComp.value.editCompConfig as OptionEditCompStatus
            const addOption = materialStore.addOption()
            // payload 为数值时，表示删除选项
            if (isNumber(payload)) {
                materialStore.removeOption(curEditCompConf[confKey], payload)
            } else {
                addOption(curEditCompConf[confKey])
            }
            break
    }
}

provide(UPDATE_STATE, updateState)
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
    height: 100%;
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
    }
}
</style>
