<script setup lang="ts">
import { getSurveryDataById } from '@/db/operation'
import { useRoute, useRouter } from 'vue-router'
import { useEditorStore } from '@/stores/use-editor'
import { computed, ref } from 'vue'
import { getRenderSnList, isSupportPdfExport } from '@/utils'
import { restoreComponentStatus } from '@/utils/process-indexDB-data'
import { ElMessage, ElNotification } from 'element-plus'
import { v4 as uuidV4 } from 'uuid'

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

const goBack = () => {
    const path = history.state.from
    if (path === 'home') {
        $router.back()
    } else if (path === 'editor') {
        $router.push(`/editor/${id}/survey-type`)
    } else {
        $router.push('/')
    }
}

const genPDF = () => {
    // 检测当前组件列表中，是否存在不支持 pdf 导出的组件
    const errorMessage = editorStore.comps.filter(comp => !isSupportPdfExport(comp.name))
    if (errorMessage.length) {
        ElMessage.error('当前问卷存在不支持PDF导出的题型，请修改后再试')
        ElNotification({
            title: '以下题型不支持PDF导出',
            message: errorMessage
                .map(item => {
                    return `<p>${item.editCompConfig.title.state}</p>`
                })
                .join(''),
            type: 'error',
            dangerouslyUseHTMLString: true
        })
        return
    }

    // 偷懒直接调用浏览器的打印功能
    window.print()
}

const dialogTableVisible = ref(false)
const link = ref('')

const genOnLienQuestion = () => {
    const id = uuidV4()

    const data = {
        id,
        questions: JSON.stringify(editorStore.comps)
    }

    fetch('http://localhost:3000/api/questionnaire', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(_ => {
        dialogTableVisible.value = true
        const onLineLink = `${window.location.origin}/questionnaire/${id}`
        link.value = onLineLink
    })
}

const handleCopyLink = () => {
    navigator.clipboard.writeText(link.value)
    ElMessage.success('复制成功')
}
</script>

<template>
    <div class="preview-container mc p-10">
        <div class="header no-print flex mb-10">
            <div class="btns">
                <el-button
                    type="primary"
                    @click="goBack"
                    >返回</el-button
                >
                <el-button
                    type="success"
                    @click="genOnLienQuestion"
                    >生成在线问卷</el-button
                >
                <el-button
                    type="warning"
                    @click="genPDF"
                    >生成PDF文件</el-button
                >
            </div>
            <div class="info">题目数量：{{ editorStore.surveyCount }}</div>
        </div>
        <div class="content p-20 no-border">
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

    <el-dialog
        v-model="dialogTableVisible"
        title="问卷在线链接"
        width="800"
    >
        <div>
            <a
                target="_blank"
                :href="link"
                >分享链接：{{ link }}</a
            >
        </div>
        <div style="display: flex; justify-content: flex-end; margin-top: 20px">
            <el-button
                type="primary"
                @click="handleCopyLink"
                >复制连接</el-button
            >
        </div>
    </el-dialog>
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

// 媒体查询，打印时隐藏不需要打印的内容
@media print {
    .no-print {
        display: none;
    }
    .no-border {
        border: none !important;
    }
}
</style>
