<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps(['detail'])

// 当前题目索引
const currentIndex = ref(0)

// 用户答案
const userAnswers = ref({})

// 是否显示答案
const showAnswer = ref(false)

// 当前题目
const currentQuestion = computed(() => {
    return props.detail?.questions?.[currentIndex.value] || null
})

// 题目总数
const totalQuestions = computed(() => {
    return props.detail?.questions?.length || 0
})

// 已答题数
const answeredCount = computed(() => {
    return Object.keys(userAnswers.value).length
})

// 判断某道题是否已作答
const isAnswered = questionId => {
    return !!userAnswers.value[questionId]
}

// 切换到指定题目
const goToQuestion = index => {
    if (index >= 0 && index < totalQuestions.value) {
        currentIndex.value = index
    }
}

// 上一题
const prevQuestion = () => {
    goToQuestion(currentIndex.value - 1)
}

// 下一题
const nextQuestion = () => {
    goToQuestion(currentIndex.value + 1)
}

// 切换答案显示
const toggleAnswer = () => {
    showAnswer.value = !showAnswer.value
}

// 更新用户答案
const updateAnswer = value => {
    if (currentQuestion.value) {
        userAnswers.value[currentQuestion.value.id] = value
    }
}

// 获取题型名称
const getQuestionType = type => {
    const typeMap = {
        'choice': '选择题',
        'short-answer': '简答题',
        'essay': '论述题'
    }
    return typeMap[type] || '未知题型'
}

const submitExam = () => {
    // TODO 提交之前需要展示弹窗
    console.log(userAnswers.value)
}

// 键盘事件处理
const handleKeydown = event => {
    // 左方向键 - 上一题
    if (event.key === 'ArrowLeft') {
        event.preventDefault()
        prevQuestion()
    }
    // 右方向键 - 下一题
    else if (event.key === 'ArrowRight') {
        event.preventDefault()
        nextQuestion()
    }
}

// 组件挂载时添加键盘监听
onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
})

// 组件卸载时移除键盘监听
onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
    <div class="edit-container">
        <!-- 左侧主内容区 -->
        <div class="main-content">
            <div
                v-if="currentQuestion"
                class="question-wrapper"
            >
                <!-- 题目信息 -->
                <div class="question-header">
                    <span class="question-number">第{{ currentIndex + 1 }}题</span>
                    <span class="question-type">{{ getQuestionType(currentQuestion.type) }}</span>
                </div>

                <!-- 题目内容 -->
                <div class="question-body">
                    <p class="question-text">{{ currentQuestion.question }}</p>

                    <!-- 选择题 -->
                    <el-radio-group
                        v-if="currentQuestion.type === 'choice'"
                        v-model="userAnswers[currentQuestion.id]"
                        @change="updateAnswer"
                        style="gap: 10px"
                    >
                        <div
                            class="option-item"
                            v-for="option in currentQuestion.options"
                            :key="option"
                        >
                            <el-radio :label="option.charAt(0)">
                                {{ option }}
                            </el-radio>
                        </div>
                    </el-radio-group>

                    <!-- 简答题和论述题 -->
                    <el-input
                        v-else
                        v-model="userAnswers[currentQuestion.id]"
                        type="textarea"
                        :rows="currentQuestion.type === 'essay' ? 10 : 5"
                        placeholder="请输入你的答案..."
                        @input="updateAnswer"
                    />
                </div>

                <!-- 答案和解析（默认隐藏） -->
                <div
                    v-if="showAnswer"
                    class="answer-section"
                >
                    <div class="answer-wrapper">
                        <h4>参考答案</h4>
                        <div class="answer-content">
                            {{ currentQuestion.answer }}
                        </div>
                    </div>
                    <div
                        v-if="currentQuestion.analysis"
                        class="analysis-wrapper"
                    >
                        <h4>解析</h4>
                        <div class="analysis-content">
                            {{ currentQuestion.analysis }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 右侧侧边栏 -->
        <div class="sidebar">
            <!-- 答题进度 -->
            <div class="progress-section">
                <div class="progress-info">
                    <p>总题数：{{ totalQuestions }}</p>
                    <p>已答：{{ answeredCount }}</p>
                    <p>未答：{{ totalQuestions - answeredCount }}</p>
                </div>
            </div>

            <!-- 题目导航 -->
            <div class="question-nav">
                <div class="nav-grid">
                    <div
                        v-for="(question, index) in detail.questions"
                        :key="question.id"
                        class="nav-item"
                        :class="{
                            active: index === currentIndex,
                            answered: isAnswered(question.id)
                        }"
                        @click="goToQuestion(index)"
                    >
                        {{ index + 1 }}
                    </div>
                </div>
            </div>

            <!-- 操作按钮 -->
            <div class="action-buttons">
                <el-button
                    type="primary"
                    :disabled="currentIndex === 0"
                    @click="prevQuestion"
                >
                    上一题
                </el-button>
                <el-button
                    type="primary"
                    :disabled="currentIndex === totalQuestions - 1"
                    @click="nextQuestion"
                >
                    下一题
                </el-button>
                <el-button
                    type="warning"
                    @click="toggleAnswer"
                >
                    {{ showAnswer ? '隐藏答案' : '显示答案' }}
                </el-button>
                <el-button
                    type="success"
                    @click="submitExam"
                    >提交试卷</el-button
                >
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.edit-container {
    display: flex;
    height: calc(100vh - 70px);
    background: #f5f5f5;
}

.main-content {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
}

.question-wrapper {
    background: white;
    border-radius: 8px;
    padding: 24px;
    min-height: 100%;
}

.question-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 2px solid #e0e0e0;
}

.question-number {
    font-size: 20px;
    font-weight: bold;
    color: #409eff;
}

.question-type {
    background: #409eff;
    color: white;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 14px;
}

.question-body {
    .question-text {
        font-size: 18px;
        line-height: 1.8;
        margin-bottom: 24px;
        color: #333;
    }

    .option-item {
        display: block;
        padding: 6px 10px;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        transition: all 0.3s;

        &:hover {
            background: #f5f5f5;
            border-color: #409eff;
        }

        :deep(.el-radio__label) {
            font-size: 16px;
            line-height: 1.6;
        }
    }

    :deep(.el-textarea__inner) {
        font-size: 16px;
        line-height: 1.6;
        padding: 12px;
    }
}

.answer-section {
    margin-top: 32px;
    padding-top: 24px;
    border-top: 2px solid #e0e0e0;
    animation: fadeIn 0.3s ease-in-out;

    h4 {
        font-size: 16px;
        font-weight: bold;
        color: #666;
        margin-bottom: 12px;
    }

    .answer-wrapper,
    .analysis-wrapper {
        margin-bottom: 20px;
    }

    .answer-content {
        background: #f0f9ff;
        padding: 16px;
        border-radius: 6px;
        border-left: 4px solid #409eff;
        font-size: 16px;
        line-height: 1.6;
    }

    .analysis-content {
        background: #f3f4f6;
        padding: 16px;
        border-radius: 6px;
        border-left: 4px solid #67c23a;
        font-size: 16px;
        line-height: 1.6;
    }
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

.sidebar {
    width: 280px;
    background: white;
    border-left: 1px solid #e0e0e0;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.progress-section {
    .progress-info {
        p {
            margin: 8px 0;
            font-size: 14px;
            color: #666;

            &:first-child {
                font-size: 16px;
                font-weight: bold;
                color: #333;
            }
        }
    }
}

.question-nav {
    flex: 1;
    overflow-y: auto;

    .nav-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 8px;
    }

    .nav-item {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.3s;

        &:hover {
            background: #f5f5f5;
            border-color: #409eff;
        }

        &.active {
            background: #409eff;
            color: white;
            border-color: #409eff;
        }

        &.answered {
            background: #67c23a;
            color: white;
            border-color: #67c23a;

            &.active {
                background: #409eff;
                border-color: #409eff;
            }
        }
    }
}

.action-buttons {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .el-button {
        width: 100%;
        margin-left: 0;
    }
}
</style>
