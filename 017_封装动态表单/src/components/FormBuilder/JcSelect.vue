<script setup>
import { ElSelect, ElOption } from 'element-plus'
import { useAttrs, useTemplateRef } from 'vue'

const attrs = useAttrs()

const modelValue = defineModel()
</script>

<template>
    <el-select
        v-model="modelValue"
        v-bind="attrs"
    >
        <el-option
            v-for="item in attrs.options"
            :key="item.value"
            :value="item.value"
            :label="item.label"
        >
            <template v-if="item.slots">
                <component
                    :is="item.slots.default"
                    :item="item"
                />
            </template>
        </el-option>
    </el-select>
</template>

<style scoped lang="scss"></style>
