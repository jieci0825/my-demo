<script setup lang="ts">
import { componentMap } from '@/configs/componentMap'
import { getSurveryDataById } from '@/db/operation'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import type { BaseBusinessComp, EditCompName } from '@/types'

const $route = useRoute()
const id = +$route.params.id

const currentData = ref()

const fetchData = async (id: number) => {
    if (!id) return
    const resp = await getSurveryDataById(id)
    if (!resp) return
    // 存储时，组件的函数丢失了，获取数据后，还原组件状态
    restoreComponentStatus(resp.comps)
    currentData.value = resp
}
fetchData(id)

// 还原组件状态
function restoreComponentStatus(comps: BaseBusinessComp[]) {
    // 通过 name 去映射表中查找需要的组件状态
    for (const comp of comps) {
        // 获取业务组件
        const material = componentMap[comp.name]
        comp.type = material
        for (const key in comp.editCompConfig) {
            const editCompConfItem = comp.editCompConfig[key as keyof BaseBusinessComp['editCompConfig']]
            editCompConfItem.editComp = componentMap[editCompConfItem.name as EditCompName]
        }
    }
}
</script>

<template>
    <div class="preview-container mc">预览问卷</div>
</template>

<style scoped lang="scss">
.preview-container {
    width: var(--center-width);
}
</style>
