<script setup>
import { ref } from 'vue'

const props = defineProps(['questions'])

// 控制每道题答案和解析的显示状态
const showAnswers = ref({})

// 切换答案显示状态
const toggleAnswer = questionId => {
    showAnswers.value[questionId] = !showAnswers.value[questionId]
}

// 判断题目类型
const getQuestionType = type => {
    const typeMap = {
        'choice': '选择题',
        'short-answer': '简答题',
        'essay': '论述题'
    }
    return typeMap[type] || '未知题型'
}

// 格式化答案显示
const formatAnswer = (answer, type) => {
    if (type === 'choice') {
        return `正确答案：${answer}`
    }
    return answer
}
</script>

<template>
    <div class="preview-container">
        <div
            v-if="!questions || questions.length === 0"
            class="empty-state"
        >
            <p>暂无题目数据</p>
        </div>

        <div
            v-else
            class="questions-list"
        >
            <div
                v-for="question in questions"
                :key="question.id"
                class="question-item"
            >
                <!-- 题目头部 -->
                <div class="question-header">
                    <div class="question-info">
                        <span class="question-number">{{ question.sn }}.</span>
                        <span class="question-type">{{ getQuestionType(question.type) }}</span>
                    </div>
                    <el-button
                        type="primary"
                        size="small"
                        @click="toggleAnswer(question.id)"
                    >
                        {{ showAnswers[question.id] ? '隐藏答案' : '查看答案' }}
                    </el-button>
                </div>

                <!-- 题目内容 -->
                <div class="question-content">
                    <p class="question-text">{{ question.question }}</p>

                    <!-- 选择题选项 -->
                    <div
                        v-if="question.type === 'choice' && question.options"
                        class="options-list"
                    >
                        <div
                            v-for="option in question.options"
                            :key="option"
                            class="option-item"
                            :class="{
                                'correct-option': showAnswers[question.id] && option.startsWith(question.answer + '.')
                            }"
                        >
                            {{ option }}
                        </div>
                    </div>
                </div>

                <!-- 答案和解析区域 -->
                <div
                    v-if="showAnswers[question.id]"
                    class="answer-section"
                >
                    <!-- 答案 -->
                    <div class="answer-content">
                        <h4 class="section-title">答案</h4>
                        <div
                            class="answer-text"
                            :class="question.type"
                        >
                            {{ formatAnswer(question.answer, question.type) }}
                        </div>
                    </div>

                    <!-- 解析 -->
                    <div
                        v-if="question.analysis"
                        class="analysis-content"
                    >
                        <h4 class="section-title">解析</h4>
                        <div class="analysis-text">
                            {{ question.analysis }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.preview-container {
    padding: 20px;
    background: #f5f5f5;
    min-height: 100vh;
}

.empty-state {
    text-align: center;
    padding: 60px 0;
    color: #999;
    font-size: 16px;
}

.questions-list {
    max-width: 900px;
    margin: 0 auto;
}

.question-item {
    background: white;
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 20px;
    border: 1px solid #e0e0e0;
    transition: border-color 0.3s;

    &:hover {
        border-color: #409eff;
    }
}

.question-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #eee;
}

.question-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.question-number {
    font-size: 18px;
    font-weight: bold;
    color: #409eff;
}

.question-type {
    background: #409eff;
    color: white;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 12px;
}

.question-content {
    margin-bottom: 16px;
}

.question-text {
    font-size: 16px;
    line-height: 1.6;
    color: #333;
    margin-bottom: 16px;
    font-weight: 500;
}

.options-list {
    .option-item {
        padding: 12px 16px;
        margin: 8px 0;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        background: #fafafa;
        transition: all 0.3s;
        cursor: default;

        &.correct-option {
            background: #f0f9ff;
            border-color: #409eff;
            color: #409eff;
            font-weight: bold;
            position: relative;

            &::before {
                content: '✓';
                position: absolute;
                right: 12px;
                top: 50%;
                transform: translateY(-50%);
                color: #67c23a;
                font-weight: bold;
                font-size: 16px;
            }
        }
    }
}

.answer-section {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 2px solid #f0f0f0;
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.section-title {
    font-size: 14px;
    font-weight: bold;
    color: #666;
    margin: 0 0 8px 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.answer-content {
    margin-bottom: 16px;
}

.answer-text {
    padding: 12px 16px;
    border-radius: 6px;
    font-weight: 500;

    &.choice {
        background: #f0f9ff;
        border-left: 4px solid #409eff;
        color: #409eff;
    }

    &.short-answer,
    &.essay {
        background: #f8f9fa;
        border-left: 4px solid #67c23a;
        color: #333;
        white-space: pre-line;
        line-height: 1.6;
    }
}

.analysis-content {
    .analysis-text {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 16px;
        border-radius: 8px;
        line-height: 1.6;
        font-weight: 500;
        border: 1px solid #667eea;
        white-space: pre-line;
    }
}
</style>
