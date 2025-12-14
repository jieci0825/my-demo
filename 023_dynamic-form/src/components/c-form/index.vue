<script setup>
import { computed, watch } from 'vue'

const props = defineProps({
    config: {
        type: Object,
        required: true
    }
})

const formData = defineModel({ default: () => ({}) })

// 获取当前可见字段的 key 集合
const getVisibleFieldKeys = (fields, formDataValue) => {
    // 存储 key
    const keys = new Set()
    fields.forEach(field => {
        // 提取动态字段的 key
        if (field.type === 'dynamic' && field.dependOn) {
            const dependValue = formDataValue[field.dependOn]
            const rendered = field.render(dependValue)
            if (rendered && rendered.key) {
                keys.add(rendered.key)
            }
            return // 跳过后续逻辑
        }
        // 提取普通字段的 key
        keys.add(field.key)
    })
    return keys
}

// 递归清空依赖于指定 key 的所有字段
const clearDependentFields = (targetKey, formDataValue) => {
    props.config.fields.forEach(field => {
        // 如果当前表单项的依赖字段 key 为本次要清空的目标字段 key
        if (field.dependOn === targetKey) {
            let fieldKey = field.key
            if (field.type === 'dynamic') {
                const dependValue = formDataValue[field.dependOn]
                // 根据约定，dynamic 字段一定有 render 函数
                const rendered = field.render(dependValue)
                if (rendered && rendered.key) {
                    // 更新该字段实际渲染的 key
                    //  - 即真正渲染的表单项的 key
                    fieldKey = rendered.key
                }
            }

            // 如果这个 key 在 formData 中存在，则清空其值
            if (fieldKey && formDataValue[fieldKey] !== undefined) {
                // 本 demo 中，动态组件能否可见，主要通过从 formData 读取其值，传入 render 函数来决定，所以清空值，就可以达到删除该动态组件的效果
                formDataValue[fieldKey] = undefined
                // 通过递归处理处于这个依赖链的下游字段
                clearDependentFields(fieldKey, formDataValue)
            }
        }
    })
}

// 得到可见字段数组
const visibleFields = computed(() => {
    return props.config.fields
        .map(field => {
            // 动态字段的处理。主要就是通过传入 value 值，返回不同的表单项配置
            if (field.type === 'dynamic' && field.dependOn) {
                // 提取依赖字段的值
                const dependValue = formData.value[field.dependOn]

                // 根据依赖字段的值，获取需要渲染的表单项
                const rendered = field.render(dependValue)

                if (!rendered) return null

                // 字段覆盖
                return {
                    ...field,
                    ...rendered,
                    type: rendered.type
                }
            }
            return field
        })
        .filter(Boolean) // 过滤掉 null 和 undefined 值
})

// 保存上一次可见字段的 key 集合
let prevVisibleKeys = new Set()

// 监听依赖字段变化，清空被联动字段
watch(
    () => formData.value,
    newVal => {
        // 获取当前可见的字段 keys
        const currentVisibleKeys = getVisibleFieldKeys(
            props.config.fields,
            newVal
        )

        // console.log('currentVisibleKeys', currentVisibleKeys)
        // console.log('prevVisibleKeys', prevVisibleKeys)

        // 找出消失的字段 keys
        //  - 即上一次存在，现在不存在的字段 key
        const disappearedKeys = [...prevVisibleKeys].filter(
            key => !currentVisibleKeys.has(key)
        )

        // console.log('disappearedKeys', disappearedKeys)

        // 清空消失字段的值，以及依赖于消失字段的所有字段
        disappearedKeys.forEach(key => {
            // 清空 formData 中消失字段的值
            if (newVal[key] !== undefined) {
                newVal[key] = undefined
            }
            // 递归清空依赖于这个消失字段的其他字段
            clearDependentFields(key, newVal)
        })

        // 更新上一次的可见字段 keys
        prevVisibleKeys = currentVisibleKeys
    },
    { deep: true }
)

defineExpose({ formData })
</script>

<template>
    <el-form
        :model="formData"
        label-width="120px"
    >
        <template
            v-for="field in visibleFields"
            :key="field.key"
        >
            <el-form-item :label="field.label">
                <!-- 输入框 -->
                <el-input
                    v-if="field.type === 'input'"
                    v-model="formData[field.key]"
                    v-bind="field.props"
                />

                <!-- 单选框 -->
                <el-radio-group
                    v-else-if="field.type === 'radio'"
                    v-model="formData[field.key]"
                >
                    <el-radio
                        v-for="opt in field.options"
                        :key="opt.value"
                        :value="opt.value"
                    >
                        {{ opt.label }}
                    </el-radio>
                </el-radio-group>

                <!-- 下拉框 -->
                <el-select
                    v-else-if="field.type === 'select'"
                    v-model="formData[field.key]"
                    v-bind="field.props"
                >
                    <el-option
                        v-for="opt in field.options"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value"
                    />
                </el-select>

                <!-- 文本域 -->
                <el-input
                    v-else-if="field.type === 'textarea'"
                    v-model="formData[field.key]"
                    type="textarea"
                    v-bind="field.props"
                />

                <!-- 时间选择器 -->
                <el-date-picker
                    v-else-if="field.type === 'date'"
                    v-model="formData[field.key]"
                    v-bind="field.props"
                />

                <!-- 数字输入框 -->
                <el-input-number
                    v-else-if="field.type === 'number'"
                    v-model="formData[field.key]"
                    v-bind="field.props"
                />

                <!-- 开关 -->
                <el-switch
                    v-else-if="field.type === 'switch'"
                    v-model="formData[field.key]"
                    v-bind="field.props"
                />
            </el-form-item>
        </template>
    </el-form>
</template>

<style scoped lang="scss"></style>
