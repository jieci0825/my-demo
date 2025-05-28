<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, ref, type Ref } from 'vue'
import { restoreComponentStatus } from '@/utils/process-indexDB-data'
import { getRenderSnList, isQuestionType } from '@/utils'
import type { BaseBusinessComp } from '@/types'
import { ElMessage } from 'element-plus'

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

type AnswerValueType = string | number | Date | Array<string | number>
const answers: Ref<{ [key: number]: AnswerValueType }> = ref({})
const updateAnswer = (idx: number, answer: AnswerValueType) => {
    const sn = snList.value[idx]
    // 如果序号存在则表示是一个问题，则将答案更新到问题中
    if (sn) {
        answers.value[idx] = answer
    } else {
        console.warn(`索引 ${idx} 序列号为空`)
    }
}

const submitAnswer = async () => {
    // todo
    console.log('提交答案')
    const resp = await fetch('http://localhost:3000/api/answer/', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            id: id.value,
            answers: answers.value
        })
    })
    const data = await resp.json()
    console.log(data)
    ElMessage.success('提交成功')
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
                    @update-answer="updateAnswer(idx, $event)"
                ></Component>
            </div>
        </div>
        <div class="footer mt-20">
            <el-button
                type="primary"
                @click="submitAnswer"
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
            width: 100%;
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
