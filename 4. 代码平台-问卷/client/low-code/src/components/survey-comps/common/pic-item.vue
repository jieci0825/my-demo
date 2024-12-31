<script setup lang="ts">
import { Upload } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import type { UploadProps } from 'element-plus'

interface Props {
    picTitle: string
    picDesc: string
    value: string
}
const props = defineProps<Props>()

const imageUrl = ref(props.value || '')

const handleSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
    imageUrl.value = response.url
    ElMessage.success('上传成功')
}

const beforeUpload: UploadProps['beforeUpload'] = rawFile => {
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(rawFile.type)) {
        ElMessage.error('上传图片只能是 JPEG、JPG、PNG 格式!')
        return false
    } else if (rawFile.size / 1024 / 1024 > 5) {
        ElMessage.error('上传图片大小不能超过 5MB!')
        return false
    }
    return true
}
</script>

<template>
    <div class="pic-item flex flex-direction-column mb-10">
        <div class="show-image flex-center flex-1">
            <el-upload
                class="image-uploader flex-center"
                action="http://localhost:3000/api/upload"
                :show-file-list="false"
                :on-success="handleSuccess"
                :before-upload="beforeUpload"
            >
                <img
                    v-if="imageUrl"
                    :src="imageUrl"
                    class="imgae"
                />
                <div
                    v-else
                    class="flex-center"
                >
                    <el-icon><Upload /></el-icon>
                    <div class="ml-5">上传图片</div>
                </div>
            </el-upload>
        </div>
        <div class="show-info text-center flex flex-direction-column pt-25 pb-25">
            <div class="title">{{ props.picTitle }}</div>
            <div class="desc mt-5">{{ props.picDesc }}</div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.pic-item {
    width: 200px;
    height: 280px;
    border-radius: var(--border-radius-large);
    border: 1px solid var(--border-color);
    overflow: hidden;
    .show-image {
        color: var(--font-color-light);
        background-color: var(--el-color-info-light-7);
        overflow: hidden;
        :deep(.el-upload) {
            width: 100%;
            height: 100%;
        }
        .image-uploader {
            width: 100%;
            height: 100%;
            .imgae {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
    }
    .show-info {
        border-top: 1px solid var(--border-color);
        .title {
            font-size: 16px;
            font-weight: 500;
            color: var(--font-color-light);
        }
        .desc {
            font-size: 14px;
            color: var(--font-color-lighter);
        }
    }
}
</style>
