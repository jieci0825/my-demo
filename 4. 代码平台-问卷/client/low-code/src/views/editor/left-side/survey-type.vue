<script setup lang="ts">
import SurveyCompGroup from '@/components/editor/survey-comp-group.vue'
import { SurveyComsList } from '@/configs/survey-group-config'
</script>

<template>
    <div class="survey-type-container p-15">
        <SurveyCompGroup
            v-for="(item, idx) in SurveyComsList"
            v-bind="item"
            :key="idx"
        ></SurveyCompGroup>
    </div>
</template>

<style scoped lang="scss">
.survey-type-container {
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 30px;
}
</style>
