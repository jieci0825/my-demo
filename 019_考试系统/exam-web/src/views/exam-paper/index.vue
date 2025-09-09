<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { examPaperApi } from '@/api'
import Preview from './components/preview.vue'
import Edit from './components/edit.vue'

// 1. 根据页面上的id获取考卷详情
// 2. 考卷详情包含题目，然后渲染这些题目
// 3. 如果 action === 'preview'，则显示预览模式，不是则默认为答题模式

const isPreview = ref(false)
const examPaperId = ref(0)
const route = useRoute()
const detail = ref(null)

onMounted(() => {
    examPaperId.value = route.query.id
    isPreview.value = route.query.action === 'preview'
    getExamPaperDetail()
})

async function getExamPaperDetail() {
    if (!examPaperId.value) {
        return
    }
    const resp = await examPaperApi.getExamPaperById(examPaperId.value)
    detail.value = resp.data
}
</script>

<template>
    <div class="exam-paper-detail">
        <template v-if="detail">
            <div class="header">
                <h1>{{ detail.name }}</h1>
            </div>
            <div class="content">
                <Preview
                    v-if="isPreview"
                    :questions="detail.questions"
                />
                <Edit
                    v-else
                    :detail="detail"
                />
            </div>
        </template>
    </div>
</template>

<style scoped lang="scss">
.exam-paper-detail {
    width: 100vw;
    height: 100vh;
    overflow: auto;

    .header {
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        height: 50px;
        border-bottom: 1px solid #e0e0e0;

        h1 {
            font-size: 20px;
            font-weight: bold;
        }
    }

    .content {
        height: calc(100vh - 70px);
    }
}
</style>
