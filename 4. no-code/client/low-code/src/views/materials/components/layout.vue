<script setup lang="ts">
import EditPanel from '@/components/survey-comps/edit-items/edit-panel.vue'
import { GET_PIC_LINK, UPDATE_STATE } from '@/constants'
import { useMaterialStore } from '@/stores/use-material'
import { computed, provide, type ComputedRef } from 'vue'
import { dispatchStatus } from '@/stores/common-dispatch'
import type { FullEditCompStatus, PicLink } from '@/types'

const materialStore = useMaterialStore()

const currentComp = computed(() => {
    return materialStore.comps[materialStore.currentMaterialComp]
})

const editCompConfig = computed(() => {
    return currentComp.value.editCompConfig
})

const updateState = dispatchStatus(materialStore, editCompConfig as ComputedRef<FullEditCompStatus>)

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
