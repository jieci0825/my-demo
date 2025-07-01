<script setup>
import { ref, nextTick } from 'vue'

const { max = 10 } = defineProps({
    max: Number
})

const containerRef = ref(null)

const isActive = ref(false)

let nextNum = 0

const turnNext = async () => {
    nextNum = (nextNum + 1) % max
    // 1. 给容器添加 down 类名，触发动画
    isActive.value = true

    await nextTick()

    // 2. 动画时间 0.5s，做完之后，前后展示的顺序就改变了
    //  - 即原来的 before 变成 after 的位置，原来的 after 变成 before 的位置
    //  - 所以此时就要将两者之间的类名进行替换。
    setTimeout(() => {
        // 3. 移除 down 类名
        isActive.value = false

        if (!containerRef.value) return
    }, 600)
}

window.turnNext = turnNext
</script>

<template>
    <div
        ref="containerRef"
        :class="['flip-clock', { 'flip-clock--down': isActive }]"
    >
        <!-- 前面的数字页 -->
        <div class="flip-clock__card flip-clock__card--before">
            <!-- 上半片 -->
            <div class="flip-clock__half flip-clock__half--top">
                <!-- 遮罩 -->
                <!-- <div class="flip-clock__shadow"></div> -->
                <!-- 数字 -->
                <div class="flip-clock__number">3</div>
            </div>
            <!-- 下半片 -->
            <div class="flip-clock__half flip-clock__half--bottom">
                <!-- <div class="flip-clock__shadow"></div> -->
                <div class="flip-clock__number">3</div>
            </div>
        </div>
        <!-- 后面的数字页 -->
        <div class="flip-clock__card flip-clock__card--after">
            <!-- 上半片 -->
            <div class="flip-clock__half flip-clock__half--top">
                <!-- <div class="flip-clock__shadow"></div> -->
                <div class="flip-clock__number">4</div>
            </div>
            <!-- 下半片 -->
            <div class="flip-clock__half flip-clock__half--bottom">
                <!-- <div class="flip-clock__shadow"></div> -->
                <div class="flip-clock__number">4</div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
$size: 10px;
$width: 12 * $size;
$height: 16 * $size;
$bg: #333;
$fontColor: #fff;

.flip-clock {
    width: $width;
    height: $height;
    background-color: $bg;
    border-radius: $size;
    position: relative;
    transform-style: preserve-3d;
    perspective: 300px;

    // 中横线
    &::after {
        position: absolute;
        content: '';
        width: 100%;
        height: 2px;
        top: calc(50% - 3px);
        left: 0;
        background-color: rgba(0, 0, 0, 0.3);
        z-index: 999;
    }

    &--down {
        .flip-clock__card--before {
            .flip-clock__half--top {
                transform: rotateX(180deg);
            }
        }
        .flip-clock__card--after {
            .flip-clock__half--bottom {
                transform: rotateX(0deg);
            }
        }
    }

    // 两个卡片都设置为绝对定位，让其重叠在一起
    &__card {
        position: absolute;
        inset: 0;
        border-radius: inherit;

        &--before {
            .flip-clock__half--top {
                z-index: 2;
                backface-visibility: hidden;
                transform: rotateX(0deg);
                transform-origin: bottom center;
            }
        }

        &--after {
            .flip-clock__half--bottom {
                z-index: 2;
                backface-visibility: hidden;
                transform-origin: top center;
                transform: rotateX(180deg);
            }
        }
    }

    &__half {
        position: absolute;
        left: 0;
        width: 100%;
        height: 50%;
        font-size: $height;
        text-align: center;
        color: $fontColor;
        overflow: hidden;
        background-color: $bg;
        transition: all 0.5s linear;

        &--top {
            top: 0;
            border-radius: $size $size 0 0;
            line-height: $height;
        }

        &--bottom {
            bottom: 0;
            border-radius: 0 0 $size $size;
            line-height: 0;
        }
    }
}

// 旋转动画-前
@keyframes turn-before {
    0% {
        transform: rotateY(0deg);
    }
    100% {
        transform: rotateY(-90deg);
    }
}

// 旋转动画-后
@keyframes turn-after {
    0% {
        transform: rotateY(90deg);
    }
    100% {
        transform: rotateY(0deg);
    }
}

// 显隐动画
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

// 层级提升动画
@keyframes up-index {
    0% {
        z-index: 2;
    }
    100% {
        z-index: 4;
    }
}
</style>
