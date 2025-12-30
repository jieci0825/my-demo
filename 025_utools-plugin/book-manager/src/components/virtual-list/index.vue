<script setup>
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
    // 数据数组
    data: {
        type: Array,
        default: () => []
    },
    // 容器高度，不传则自动适应父元素高度
    height: {
        type: Number,
        default: undefined
    },
    // 单个项目高度
    itemHeight: {
        type: Number,
        default: 40
    },
    // 缓冲区大小（上下各缓冲多少个项目）
    bufferSize: {
        type: Number,
        default: 10
    }
})

// 滚动容器的引用
const scrollContainer = ref(null)

// 当前滚动位置
const scrollTop = ref(0)

// 自动计算的容器高度（当未传入height时使用）
const autoHeight = ref(0)

// 监听滚动事件
const handleScroll = e => {
    scrollTop.value = e.target.scrollTop
}

// 计算总高度
const totalHeight = computed(() => {
    return props.data.length * props.itemHeight
})

// 计算可视区域开始索引
const visibleStartIndex = computed(() => {
    return Math.floor(scrollTop.value / props.itemHeight)
})

// 计算可视区域结束索引
const visibleEndIndex = computed(() => {
    return Math.min(
        visibleStartIndex.value +
            Math.ceil(containerHeight.value / props.itemHeight),
        props.data.length - 1
    )
})

// 计算渲染开始索引（包含缓冲区）
const renderStartIndex = computed(() => {
    return Math.max(0, visibleStartIndex.value - props.bufferSize)
})

// 计算渲染结束索引（包含缓冲区）
const renderEndIndex = computed(() => {
    return Math.min(
        props.data.length - 1,
        visibleEndIndex.value + props.bufferSize
    )
})

// 要渲染的项目
const renderItems = computed(() => {
    return props.data.slice(renderStartIndex.value, renderEndIndex.value + 1)
})

// 计算渲染容器的偏移量
const offsetY = computed(() => {
    return renderStartIndex.value * props.itemHeight
})

// 计算实际使用的容器高度
const containerHeight = computed(() => {
    return props.height || autoHeight.value
})

// ResizeObserver实例
let resizeObserver = null

// 更新容器高度
const updateHeight = () => {
    if (scrollContainer.value && !props.height) {
        autoHeight.value = scrollContainer.value.clientHeight
    }
}

// 设置尺寸监听器
const setupResizeObserver = () => {
    if (!scrollContainer.value || props.height) return

    resizeObserver = new ResizeObserver(() => {
        updateHeight()
    })
    resizeObserver.observe(scrollContainer.value)
}

// 清理尺寸监听器
const cleanupResizeObserver = () => {
    if (resizeObserver) {
        resizeObserver.disconnect()
        resizeObserver = null
    }
}

// 组件挂载后设置监听器
onMounted(async () => {
    await nextTick()
    if (!props.height) {
        updateHeight()
        setupResizeObserver()
    }
})

// 组件卸载前清理监听器
onUnmounted(() => {
    cleanupResizeObserver()
})
</script>

<template>
    <div
        ref="scrollContainer"
        class="virtual-list-container"
        :style="{ height: props.height ? `${props.height}px` : '100%' }"
        @scroll="handleScroll"
    >
        <div
            class="virtual-list-phantom"
            :style="{ height: `${totalHeight}px` }"
        ></div>
        <div
            class="virtual-list-content"
            :style="{ transform: `translateY(${offsetY}px)` }"
        >
            <slot
                v-for="(item, index) in renderItems"
                :key="renderStartIndex + index"
                :item="item"
                :index="renderStartIndex + index"
                name="item"
            >
                <!-- 默认插槽内容，如果没有提供item插槽 -->
                <div
                    class="virtual-list-item"
                    :style="{
                        height: `${itemHeight}px`,
                        lineHeight: `${itemHeight}px`
                    }"
                >
                    {{ item }}
                </div>
            </slot>
        </div>
    </div>
</template>

<style scoped lang="scss">
.virtual-list-container {
    overflow-y: auto;
    position: relative;
    width: 100%;

    .virtual-list-phantom {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
    }

    .virtual-list-content {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
    }

    .virtual-list-item {
        width: 100%;
        padding: 0 16px;
        box-sizing: border-box;
        border-bottom: 1px solid #f0f0f0;
        background: white;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        user-select: none;

        &:hover {
            background: #f5f5f5;
        }
    }
}
</style>
