<script setup>
import { computed, ref, useTemplateRef } from 'vue'
import FormBuilder from './components/FormBuilder/index.vue'
import { useFormBuilder } from './hooks/useFormBuilder'

const formData = ref({})

const formInstance = useTemplateRef('formRef')

const formItems = computed(() => {
    return [
        {
            label: '名称',
            type: 'input',
            key: 'name',
            placeholder: '请输入名称',
            span: 12
        },
        {
            label: '年龄',
            type: 'number',
            key: 'age',
            placeholder: '请输入年龄',
            style: {
                width: '240px'
            },
            span: 12
        },
        {
            label: '性别',
            type: 'select',
            key: 'sex',
            // hidden: true,
            // 使用 computed 包裹，进行计算，动态控制隐藏
            hidden: formData.value.name === '张三',
            placeholder: '请选择性别',
            // isSlot: true,
            options: [
                { label: '男', value: 'man' },
                { label: '女', value: 'woman' }
            ]
        },
        {
            label: '网络',
            key: 'network',
            placeholder: '请输入网络地址',
            slots: {
                // 插槽时，会将 item 作为组件的 props 传递下来，也就可以在此处进行接收使用
                prepend: props => 'http://' + props.item.key
            }
        }
    ]
})

const rules = {
    name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    age: [{ required: true, message: '请输入年龄', trigger: 'blur' }]
}

const submit = async () => {
    await formInstance.value.validate()
    console.log('校验成功：', formData.value)
}

// 共有一个 formData 测试
const [FormBuilder2, FormBuilder2Instance] = useFormBuilder(formData, {
    formItems,
    rules
})

const submit2 = async () => {
    await FormBuilder2Instance.value.validate()
    console.log('校验成功2：', formData.value)
}
</script>

<template>
    <div class="container">
        <FormBuilder
            :form-items="formItems"
            :rules="rules"
            ref="formRef"
            v-model="formData"
        >
        </FormBuilder>
        <el-button
            type="primary"
            @click="submit"
            >提交</el-button
        >
        <div style="width: 100%; height: 30px"></div>
        <!-- <FormBuilder2></FormBuilder2>
        <el-button
            type="primary"
            @click="submit2"
            >提交2</el-button
        > -->
    </div>
</template>

<style scoped lang="scss">
.container {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #a4b0be;
}
</style>
