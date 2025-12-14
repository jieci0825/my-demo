<script setup>
import { ref } from 'vue'
import CForm from './components/c-form/index.vue'

const formData = ref({})
const submittedData = ref(null)

const formConfig = {
    fields: [
        {
            key: 'name',
            type: 'input',
            label: '姓名',
            props: { placeholder: '请输入姓名' }
        },
        {
            key: 'type',
            type: 'radio',
            label: '类型',
            options: [
                { label: '下拉', value: '1' },
                { label: '文本域', value: '2' }
            ]
        },
        {
            type: 'dynamic', // 动态字段-不会进行渲染
            dependOn: 'type', // 定义依赖字段 key
            render: value => {
                // 根据不同的 value 值，返回不同的表单项配置
                if (value === '1') {
                    return {
                        type: 'select',
                        label: '下拉',
                        key: 'selectKey',
                        options: [
                            { label: '日期', value: 'date' },
                            { label: '开关', value: 'switch' }
                        ],
                        props: { placeholder: '请选择' }
                    }
                }
                if (value === '2') {
                    return {
                        label: '文本域',
                        type: 'textarea',
                        key: 'textareaKey',
                        props: {
                            rows: 4,
                            placeholder:
                                '请输入文本，尝试输入 op 会有不一样的选择'
                        }
                    }
                }
                return null
            }
        },
        {
            key: 'sign',
            type: 'input',
            label: '签名',
            props: { placeholder: '请输入签名' }
        },
        {
            type: 'dynamic',
            dependOn: 'selectKey', // 定义依赖字段 key
            render: value => {
                if (value === 'date') {
                    return {
                        key: 'birthday',
                        label: '生日',
                        type: 'date',
                        props: { placeholder: '请选择生日' }
                    }
                } else if (value === 'switch') {
                    return {
                        key: 'switchKey',
                        label: '开关',
                        type: 'switch',
                        props: { placeholder: '请选择开关' }
                    }
                } else {
                    return null
                }
            }
        },
        {
            type: 'dynamic',
            dependOn: 'textareaKey',
            render: value => {
                if (value?.trim() === 'op') {
                    return {
                        type: 'select',
                        key: 'animation',
                        label: '动画',
                        options: [
                            { label: '弹珠传说', value: 'dzcs' },
                            { label: '骑刃王', value: 'qrw' },
                            { label: '战龙四驱', value: 'zlsq' }
                        ],
                        props: { placeholder: '请选择动画' }
                    }
                } else {
                    return null
                }
            }
        }
    ]
}

const handleSubmit = () => {
    submittedData.value = JSON.stringify(formData.value, null, 2)
    console.log('表单数据：', formData.value)
}
</script>

<template>
    <div class="container">
        <h2>动态联动表单示例</h2>
        <CForm
            v-model="formData"
            :config="formConfig"
        />
        <el-button
            type="primary"
            @click="handleSubmit"
            style="margin-top: 20px"
        >
            提交
        </el-button>
        <div
            v-if="submittedData"
            style="margin-top: 20px"
        >
            <h3>提交的数据：</h3>
            <pre>{{ submittedData }}</pre>
        </div>
    </div>
</template>

<style scoped lang="scss">
.container {
    width: 500px;
    margin: 20px auto;
}
</style>
