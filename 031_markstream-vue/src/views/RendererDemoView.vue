<script setup lang="ts">
import MarkdownRender from 'markstream-vue'
import { computed } from 'vue'

import { demoConfigs } from '../content/demos'

import type { DemoKey } from '../router'

const props = defineProps<{
    demo: Exclude<DemoKey, 'streaming'>
}>()

const config = computed(() => demoConfigs[props.demo])
</script>

<template>
    <section class="demo-card">
        <div class="demo-toolbar">
            <div class="demo-identity">
                <span class="demo-badge">{{ config.label }}</span>
                <span>{{ config.hint }}</span>
            </div>
            <div class="config-tags" aria-label="当前配置">
                <code v-for="tag in config.tags" :key="tag">{{ tag }}</code>
            </div>
        </div>

        <div
            class="renderer-surface"
            :class="{ 'is-dark': config.darkSurface, dark: config.darkSurface }"
        >
            <MarkdownRender
                :content="config.content"
                v-bind="config.rendererProps"
            />
        </div>
    </section>
</template>
