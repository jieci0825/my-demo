<script setup>
import VueOfficeDocx from '@vue-office/docx'
import '@vue-office/docx/lib/index.css'
import VueOfficeExcel from '@vue-office/excel'
import '@vue-office/excel/lib/index.css'
import VueOfficePdf from '@vue-office/pdf'
import VueOfficePptx from '@vue-office/pptx'
import { onMounted, ref } from 'vue'

const fileInput = ref(null)
const filename = ref('')
const fileType = ref('')
const src = ref('')

const processFile = e => {
    const file = e.target.files[0]
    filename.value = file.name
    fileType.value = filename.value.split('.').pop()

    let fileReader = new FileReader()
    fileReader.onload = () => {
        src.value = fileReader.result
    }
    fileReader.readAsArrayBuffer(file)
}

const previewOnline = type => {
    const filenameMap = {
        docx: '获取 AppID',
        xlsx: '产品信息表',
        pdf: 'JavaScript柯里化',
        pptx: '双十一'
    }
    const filename = encodeURIComponent(filenameMap[type])
    const cosUrl = `https://coderjcnodejs-1312270807.cos.ap-guangzhou.myqcloud.com/${filename}.${type}`
    fileType.value = type
    src.value = cosUrl
}

onMounted(() => {
    fileInput.value.addEventListener('change', processFile)
})
</script>

<template>
    <div class="container">
        <div class="header">
            <input
                type="file"
                ref="fileInput"
            />
            <button @click="previewOnline('docx')">预览在线的DOCX</button>
            <button @click="previewOnline('xlsx')">预览在线的EXCEL</button>
            <button @click="previewOnline('pdf')">预览在线的PDF</button>
            <button @click="previewOnline('pptx')">预览在线的PPTX</button>
        </div>
        <div class="preview-box">
            <template v-if="fileType === 'docx'">
                <vue-office-docx
                    style="height: 100%"
                    :src="src"
                />
            </template>
            <template v-else-if="fileType === 'xlsx'">
                <vue-office-excel
                    style="height: 100%"
                    :src="src"
                />
            </template>
            <template v-else-if="fileType === 'pdf'">
                <vue-office-pdf
                    style="height: 100%"
                    :src="src"
                />
            </template>
            <template v-else-if="fileType === 'pptx'">
                <vue-office-pptx
                    style="height: 100%"
                    :src="src"
                />
            </template>
        </div>
    </div>
</template>

<style scoped lang="scss">
.container {
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    padding: 20px;

    button {
        padding: 2px 6px;
    }

    .header {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 20px;
        height: 50px;
        background-color: #ccc;
        flex-shrink: 0;
        gap: 10px;
    }

    .preview-box {
        flex: 1;
        width: 100%;
        border: 1px solid #ccc;
        overflow: hidden auto;
    }
}
</style>
