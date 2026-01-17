<script setup>
import { nextTick, ref, watch } from 'vue'

const props = defineProps({
    messages: {
        type: Array,
        required: true
    }
})

const scrollContainer = ref(null)

const scrollToBottom = async () => {
    await nextTick()
    if (scrollContainer.value) {
        scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
    }
}

watch(() => props.messages, scrollToBottom, { deep: true })
</script>

<template>
    <main class="chat-messages" ref="scrollContainer">
        <div 
            v-for="(msg, index) in messages" 
            :key="index"
            :class="['message-wrapper', msg.role]"
        >
            <div class="avatar">{{ msg.role === 'user' ? 'U' : 'AI' }}</div>
            <div class="message-content">
                {{ msg.content }}
            </div>
        </div>
    </main>
</template>

<style scoped lang="scss">
.chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;

    &::-webkit-scrollbar {
        width: 6px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: var(--scrollbar-color);
        border-radius: 3px;
    }

    .message-wrapper {
        display: flex;
        gap: 12px;
        max-width: 80%;

        &.user {
            align-self: flex-end;
            flex-direction: row-reverse;
            
            .message-content {
                background-color: var(--user-msg-bg);
                color: var(--text-color);
                border-radius: 12px 2px 12px 12px;
            }
            .avatar {
                background-color: var(--active-text-color);
            }
        }

        &.ai {
            align-self: flex-start;
            
            .message-content {
                background-color: var(--ai-msg-bg);
                color: var(--text-color);
                border-radius: 2px 12px 12px 12px;
            }
            .avatar {
                background-color: var(--sub-bg-color);
                border: 1px solid var(--border-color);
            }
        }

        .avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            flex-shrink: 0;
        }

        .message-content {
            padding: 10px 15px;
            line-height: 1.5;
            word-break: break-all;
            white-space: pre-wrap;
        }
    }
}
</style>

