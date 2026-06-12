<script setup lang="ts">
import MarkdownRender from 'markstream-vue'
import { onBeforeUnmount, onMounted, ref } from 'vue'

import { streamingContent } from '../content/demos'

const visibleContent = ref('')
const isStreaming = ref(false)
const isFinal = ref(false)

let timer: ReturnType<typeof setInterval> | undefined

function stopStreaming() {
    if (timer !== undefined) {
        clearInterval(timer)
        timer = undefined
    }
}

function play() {
    stopStreaming()
    visibleContent.value = ''
    isFinal.value = false
    isStreaming.value = true

    let cursor = 0

    timer = setInterval(() => {
        const chunkSize = Math.floor(Math.random() * 4) + 2
        cursor = Math.min(cursor + chunkSize, streamingContent.length)
        visibleContent.value = streamingContent.slice(0, cursor)

        if (cursor >= streamingContent.length) {
            stopStreaming()
            isStreaming.value = false
            isFinal.value = true
        }
    }, 24)
}

onMounted(play)
onBeforeUnmount(stopStreaming)
</script>

<template>
    <section class="demo-card">
        <div class="demo-toolbar">
            <div class="demo-identity">
                <span class="demo-badge">Streaming</span>
                <span class="stream-status">
                    <i :class="{ 'is-active': isStreaming }" />
                    {{ isStreaming ? '内容接收中' : '渲染已完成' }}
                </span>
            </div>
            <div class="toolbar-actions">
                <div class="config-tags" aria-label="当前配置">
                    <code>typewriter: true</code>
                    <code>maxLiveNodes: 0</code>
                    <code>batchSize: 12</code>
                </div>
                <button class="replay-button" type="button" @click="play">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19 8V4m0 0h-4m4 0-3.1 3.1A7 7 0 1 0 19 15" />
                    </svg>
                    重新播放
                </button>
            </div>
        </div>

        <div class="renderer-surface streaming-surface">
            <MarkdownRender
                :content="visibleContent"
                :final="isFinal"
                :typewriter="true"
                :smooth-streaming="false"
                :max-live-nodes="0"
                :batch-rendering="true"
                :initial-render-batch-size="12"
                :render-batch-size="12"
                :render-batch-delay="8"
                :render-batch-budget-ms="4"
                :fade="false"
            />
        </div>
    </section>
</template>
