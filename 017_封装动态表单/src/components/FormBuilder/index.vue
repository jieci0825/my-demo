<script setup>
import { ElInput, ElForm, ElFormItem, ElInputNumber } from 'element-plus'
import JcSelect from './JcSelect.vue'
import { computed, useTemplateRef } from 'vue'

const props = defineProps(['formItems', 'rules'])

const modelValue = defineModel()

const formItmeCompMap = {
    input: ElInput,
    number: ElInputNumber,
    select: JcSelect
}

function omit(obj, keys) {
    return Object.fromEntries(Object.entries(obj).filter(([key]) => !keys.includes(key)))
}

const withProps = ['label', 'key', 'type', 'hidden', 'isSlot', 'gutter', 'span']

const getFormItemProps = item => {
    if (item.props && typeof item.props === 'object') {
        return item.props
    }
    return omit(item, withProps)
}

const getFormItemComp = item => {
    const { type } = item

    if (type === undefined) {
        return ElInput
    }

    if (typeof type === 'string') {
        return formItmeCompMap[type]
    }

    return type
}

const items = computed(() => props.formItems.filter(item => !item.hidden))

const elFormInstance = useTemplateRef('elFormRef')

defineExpose({
    validate(...args) {
        return elFormInstance.value.validate(...args)
    },
    rest() {
        elFormInstance.value.resetFields()
    }
})
</script>

<template>
    <el-form
        :model="modelValue"
        :rules="rules"
        ref="elFormRef"
        label-width="auto"
    >
        <el-row :gutter="items.length === 1 ? 0 : 24">
            <el-col
                v-for="item in items"
                :key="item.key"
                :span="item.span || 24"
            >
                <el-form-item
                    :label="item.label"
                    :prop="item.key"
                >
                    <template v-if="item.isSlot">
                        <slot :name="item.key"></slot>
                    </template>
                    <template v-else>
                        <Component
                            :is="getFormItemComp(item)"
                            v-model="modelValue[item.key]"
                            v-bind="getFormItemProps(item)"
                        ></Component>
                    </template>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<style scoped lang="scss"></style>
