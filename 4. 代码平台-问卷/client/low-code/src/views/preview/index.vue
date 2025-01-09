<script setup lang="ts">
import { componentMap } from '@/configs/componentMap'
import { getSurveryDataById } from '@/db/operation'
import { useRoute, useRouter } from 'vue-router'
import { useEditorStore } from '@/stores/use-editor'
import type { BaseBusinessComp, EditCompName } from '@/types'
import { computed } from 'vue'
import { getRenderSnList } from '@/utils'

const $route = useRoute()
const $router = useRouter()
const id = +$route.params.id

const editorStore = useEditorStore()

const fetchData = async (id: number) => {
    if (!id) return
    const resp = await getSurveryDataById(id)
    if (!resp) return
    // 存储时，组件的函数丢失了，获取数据后，还原组件状态
    restoreComponentStatus(resp.comps)
    editorStore.setStore(resp.comps)
}
fetchData(id)

const snList = computed(() => getRenderSnList(editorStore.comps).value)

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

const goBack = () => {
    $router.back()
}
</script>

<template>
    <div class="preview-container mc p-10">
        <div class="header flex mb-10">
            <div class="btns">
                <el-button
                    type="primary"
                    @click="goBack"
                    >返回</el-button
                >
                <el-button type="success">生成在线问卷</el-button>
                <el-button type="warning">生成PDF文件</el-button>
            </div>
            <div class="info">题目数量：{{ editorStore.surveyCount }}</div>
        </div>
        <div class="content p-20">
            <div
                v-for="(item, idx) in editorStore.comps"
                class="content-item"
                :key="item.id"
            >
                <Component
                    v-bind="item"
                    :sn="snList[idx]"
                    :is="item.type"
                ></Component>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.preview-container {
    width: 800px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .header {
        flex-shrink: 0;
        align-items: flex-end;
        .info {
            margin-left: auto;
            color: var(--font-color-lighter);
        }
    }
    .content {
        overflow: hidden auto;
        flex: 1;
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius-base);
        .content-item {
            margin-bottom: 20px;
            &:last-child {
                margin-bottom: 0;
            }
        }
    }
}
</style>
