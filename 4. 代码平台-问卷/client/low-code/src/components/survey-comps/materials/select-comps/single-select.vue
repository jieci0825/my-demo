<script setup lang="ts">
import MaterialsHeader from '../../common/materials-header.vue'
</script>

<template>
    <div class="single-select">
        <MaterialsHeader></MaterialsHeader>
        <div class="radio-wrap">
            <el-radio-group>
                <el-radio :value="1">选项1</el-radio>
                <el-radio :value="2">选项2</el-radio>
                <el-radio :value="3">选项3</el-radio>
                <el-radio :value="4">选项4</el-radio>
            </el-radio-group>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
