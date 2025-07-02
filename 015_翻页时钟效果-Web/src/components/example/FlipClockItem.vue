<template>
    <!-- 翻页时钟项 -->
    <div
        class="flip-clock-item"
        :class="{
            'flip-mode-up': mode === 'up',
            'flip-mode-down': mode === 'down'
        }"
        ref="itemDom"
    >
        <!-- 前一帧 -->
        <div class="flip-clock-item-bf">
            <!-- 上片 -->
            <div class="flip-clock-item-up">
                <!-- 遮罩 -->
                <div class="shadow"></div>
                <!-- 数字 -->
                <div class="num">9</div>
            </div>
            <!-- 下片 -->
            <div class="flip-clock-item-down">
                <div class="shadow"></div>
                <div class="num">9</div>
            </div>
        </div>
        <!-- 当前帧 -->
        <div class="flip-clock-item-af">
            <div class="flip-clock-item-up">
                <div class="shadow"></div>
                <div class="num">0</div>
            </div>
            <div class="flip-clock-item-down">
                <div class="shadow"></div>
                <div class="num">0</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface FlipItemProps {
    mode?: 'up' | 'down' // 向上|下翻
    max?: number // 最大值
}

const props = withDefaults(defineProps<FlipItemProps>(), {
    mode: 'down',
    max: 10
})

// 本体DOM
const itemDom = ref<HTMLDivElement>()

// 将要展示值
let afNum: number = 0
/**
 * 翻向下一帧
 * @param num 目标值
 */
const turnNext = (num: number | undefined = void 0) => {
    afNum = num !== void 0 ? num : (afNum + 1) % props.max
    const el = itemDom.value
    if (el) {
        const bfEl = el.getElementsByClassName('flip-clock-item-bf')[0]
        const afEl = el.getElementsByClassName('flip-clock-item-af')[0]
        if (afEl) {
            afEl.className = 'flip-clock-item-bf'
        }
        if (bfEl) {
            const numEls = bfEl.getElementsByClassName('num') as HTMLCollectionOf<HTMLElement>
            for (let i = 0; i < numEls.length; i++) {
                numEls[i].innerText = afNum + ''
            }
            bfEl.className = 'flip-clock-item-af'
        }
    }
}

defineExpose({
    turnNext
})
</script>

<style lang="scss" scoped>
.flip-clock-item {
    $size: 10px;
    $width: 6 * $size;
    $height: 9 * $size;
    $bg: #333;
    $fontColor: #ccc;
    $upShadow: linear-gradient(0deg, #000, rgba(0, 0, 0, 0.1));
    $downShadow: linear-gradient(180deg, #000, rgba(0, 0, 0, 0.1));
    width: $width;
    height: $height;
    position: relative;
    border-radius: $size;
    perspective: 200px;
    box-sizing: border-box;
    user-select: none;
    .flip-clock-item-bf,
    .flip-clock-item-af {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border-radius: $size;
        box-sizing: border-box;
        transition: 0.5s linear;
        backface-visibility: hidden;
        perspective: 200px;
    }
    .flip-clock-item-up,
    .flip-clock-item-down {
        position: absolute;
        left: 0;
        width: 100%;
        height: 50%;
        overflow: hidden;
        background-color: $bg;
        line-height: $height;
        .shadow {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            z-index: 2;
        }
        .num {
            position: absolute;
            left: 0;
            width: 100%;
            height: 200%;
            color: $fontColor;
            text-shadow: 0 1px 2px #000;
            text-align: center;
            background-color: $bg;
            border-radius: 6px;
            font-size: 7 * $size;
            font-weight: bold;
        }
    }
    .flip-clock-item-up {
        top: 0;
        transform-origin: 50% 100%;
        border-radius: $size $size 0 0;
        .shadow {
            background: $upShadow;
        }
        &::after {
            content: '';
            display: block;
            width: 100%;
            position: absolute;
            bottom: -1px;
            height: 2px;
            background-color: rgba(0, 0, 0, 0.5);
        }
    }
    .flip-clock-item-down {
        bottom: 0;
        transform-origin: 50% 0%;
        border-radius: 0 0 $size $size;
        .shadow {
            background: $downShadow;
        }
        .num {
            bottom: 0;
        }
    }
    .flip-clock-item-bf {
        z-index: 3;
        .shadow {
            animation: show 0.5s linear both;
        }
    }
    .flip-clock-item-af {
        z-index: 5;
        animation: up-index 0.01s 0.49s linear both;
        .shadow {
            animation: hide 0.5s 0.2s linear both;
        }
    }
    // 向上翻页
    &.flip-mode-up {
        .flip-clock-item-bf {
            .flip-clock-item-down {
                animation: turn-af 0.5s linear both reverse;
            }
        }
        .flip-clock-item-af {
            .flip-clock-item-up {
                animation: turn-bf 0.5s 0.5s linear both reverse;
            }
        }
    }
    // 向下翻页
    &.flip-mode-down {
        .flip-clock-item-bf {
            .flip-clock-item-up {
                animation: turn-bf 0.5s linear both;
            }
        }
        .flip-clock-item-af {
            .flip-clock-item-down {
                animation: turn-af 0.5s 0.5s linear both;
            }
        }
    }
}

@keyframes turn-bf {
    0% {
        transform: rotateX(0deg);
    }
    100% {
        transform: rotateX(-90deg);
    }
}

@keyframes turn-af {
    0% {
        transform: rotateX(90deg);
    }
    100% {
        transform: rotateX(0deg);
    }
}

@keyframes show {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

@keyframes hide {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}

@keyframes up-index {
    0% {
        z-index: 2;
    }
    100% {
        z-index: 4;
    }
}
</style>
