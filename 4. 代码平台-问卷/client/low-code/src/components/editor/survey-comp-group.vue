<script setup lang="ts">
import SurveyCompItem from './survey-comp-item.vue'
import type { MaterialItemList, VueCompType } from '@/types'

interface Props {
    title: string
    icon: VueCompType
    list: MaterialItemList
}

const props = defineProps<Props>()
</script>

<template>
    <div class="survey-comp-group mc">
        <!-- title -->
        <div class="mb-10 flex align-items-center">
            <el-icon :size="20">
                <Component :is="props.icon" />
            </el-icon>
            <span class="ml-10">{{ props.title }}</span>
        </div>

        <!-- button-group -->
        <div class="button-group-wrap">
            <SurveyCompItem
                v-for="(item, idx) in props.list"
                v-bind="item"
                :key="idx"
            ></SurveyCompItem>
        </div>
    </div>
</template>

<style scoped lang="scss">
.survey-comp-group {
    width: 100%;
    .button-group-wrap {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 10px;
    }
}
</style>
