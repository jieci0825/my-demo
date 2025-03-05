<script setup>
import { reactive, ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { FormStorage } from '@/utils'

const formConfig = [
    {
        title: '基本信息',
        formItems: [
            { prop: 'name', label: '姓名', type: 'input' },
            { prop: 'age', label: '年龄', type: 'input' },
            { prop: 'address', label: '地址', type: 'input' },
            {
                prop: 'hobby',
                label: '爱好',
                type: 'radio',
                options: [
                    { label: '美食', value: 'food' },
                    { label: '运动', value: 'sports' },
                    { label: '旅游', value: 'travel' },
                    { label: '游戏', value: 'geme' }
                ]
            }
        ]
    },
    {
        title: '教育信息',
        formItems: [
            { prop: 'school', label: '学校', type: 'input' },
            {
                prop: 'degree',
                label: '学历',
                type: 'radio',
                options: [
                    { label: '初中', value: '1' },
                    { label: '高中', value: '2' },
                    { label: '大专', value: '3' },
                    { label: '本科', value: '4' }
                ]
            },
            { prop: 'major', label: '专业', type: 'input' }
        ]
    },
    {
        title: '工作信息',
        formItems: [
            { prop: 'company', label: '公司', type: 'input' },
            { prop: 'position', label: '职位', type: 'input' },
            { prop: 'salary', label: '薪资', type: 'input' }
        ]
    }
]
const curFormConfigIndex = ref(0)
const curFormConfig = computed(() => {
    return formConfig[curFormConfigIndex.value]
})
const formData = ref({
    name: '',
    age: '',
    address: '',
    hobby: '',
    school: '',
    degree: '',
    major: '',
    company: '',
    position: '',
    salary: ''
})
const ruleFormRef = ref()

const validateForm = async () => {
    if (!ruleFormRef.value) return
    await ruleFormRef.value.validate()
}

const wrap = fn => {
    return async () => {
        try {
            await validateForm()
            fn()
        } catch (error) {
            ElMessage.error('请检查表单是否填写完整')
        }
    }
}

const next = wrap(() => {
    if (curFormConfigIndex.value < formConfig.length - 1) {
        curFormConfigIndex.value++
    }
})

const prev = wrap(() => {
    if (curFormConfigIndex.value > 0) {
        curFormConfigIndex.value--
    }
})

const submit = wrap(() => {
    console.log(formData)
})

const formStorage = new FormStorage('rule1', formData)
formStorage.init()
</script>

<template>
    <div class="contianer">
        <div class="form-wrap">
            <div class="head-wrap">
                {{ curFormConfig.title }}
            </div>
            <div class="content-wrap">
                <el-form
                    ref="ruleFormRef"
                    label-width="auto"
                    :model="formData"
                >
                    <el-form-item
                        required
                        :prop="item.prop"
                        :label="item.label"
                        v-for="item in curFormConfig.formItems"
                        :key="item.prop"
                    >
                        <el-input
                            v-if="item.type === 'input'"
                            v-model="formData[item.prop]"
                        />
                        <el-radio-group
                            v-else-if="item.type === 'radio'"
                            v-model="formData[item.prop]"
                        >
                            <el-radio
                                v-for="o in item.options"
                                :value="o.value"
                                >{{ o.label }}</el-radio
                            >
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item>
                        <div class="action-wrap">
                            <el-button
                                v-if="curFormConfigIndex > 0"
                                type="info"
                                @click="prev"
                                >上一页</el-button
                            >
                            <el-button
                                v-if="curFormConfigIndex < formConfig.length - 1"
                                type="warning"
                                @click="next"
                                >下一页</el-button
                            >
                            <el-button
                                v-if="curFormConfigIndex === formConfig.length - 1"
                                type="primary"
                                >提交</el-button
                            >
                        </div>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.contianer {
    width: 100vw;
    height: 100vh;
    .form-wrap {
        margin: 100px auto;
        width: 400px;
        padding: 20px;
        border: 2px solid #a4b0be;
        border-radius: 4px;
        .head-wrap {
            font-weight: bold;
            font-size: 20px;
            margin-bottom: 20px;
            color: #2c3e50;
        }
        .content-wrap {
            .el-form-item:last-child {
                margin-bottom: 0;
            }
        }
        .action-wrap {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
}
</style>
