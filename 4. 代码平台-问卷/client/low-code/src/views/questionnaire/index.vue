<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, ref } from 'vue'
import { restoreComponentStatus } from '@/utils/process-indexDB-data'
import { getRenderSnList, isQuestionType } from '@/utils'
import type { BaseBusinessComp } from '@/types'

const $route = useRoute()

const id = computed(() => $route.params.id)

const questionnaireData = ref<{
    comps: BaseBusinessComp[]
    currentCompIndex: number
}>({
    comps: [],
    currentCompIndex: 0
})

const surveyCount = computed(() => {
    let count = 0
    questionnaireData.value.comps.forEach(comp => {
        if (isQuestionType(comp.name)) {
            count++
        }
    })
    return count
})

const snList = computed(() => getRenderSnList(questionnaireData.value.comps).value)

const fetchData = async () => {
    const resp = await fetch('http://localhost:3000/api/questionnaire/' + id.value)
    const data = await resp.json()
    const result = JSON.parse(data.data) as BaseBusinessComp[]
    restoreComponentStatus(result)
    questionnaireData.value.comps = result
}
fetchData()

const handleSubmit = () => {
    // todo
    console.log('提交答案')
}
</script>

<template>
    <div class="questionnaire-container p-20">
        <div class="header mb-20">题目数量：{{ surveyCount }}</div>
        <div class="content p-20">
            <div
                class="content-item"
                v-for="(item, idx) in questionnaireData.comps"
                :key="item.id"
            >
                <Component
                    v-bind="item"
                    :sn="snList[idx]"
                    :is="item.type"
                ></Component>
            </div>
        </div>
        <div class="footer mt-20">
            <el-button
                type="primary"
                @click="handleSubmit"
                >提交答案</el-button
            >
        </div>
    </div>
</template>

<style scoped lang="scss">
.questionnaire-container {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    --w: 800px;
    .header {
        flex-shrink: 0;
        width: var(--w);
    }
    .content {
        flex: 1;
        width: var(--w);
        overflow: hidden auto;
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius-base);
        .content-item {
            margin-bottom: 20px;
            &:last-child {
                margin-bottom: 0;
            }
        }
    }
    .footer {
        flex-shrink: 0;
        width: var(--w);
        display: flex;
        justify-content: flex-end;
    }
}
</style>
