<script setup lang="ts">
import { getSurveryDataById } from '@/db/operation'
import { useRoute, useRouter } from 'vue-router'
import { useEditorStore } from '@/stores/use-editor'
import { computed } from 'vue'
import { getRenderSnList, isSupportPdfExport } from '@/utils'
import { restoreComponentStatus } from '@/utils/process-indexDB-data'
import { ElMessage, ElNotification } from 'element-plus'

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
                <el-button type="success">生成在线问卷</el-button>
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
