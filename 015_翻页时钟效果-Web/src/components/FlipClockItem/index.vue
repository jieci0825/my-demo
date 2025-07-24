<script setup>
import { ref, onMounted } from 'vue'

const { max = 10 } = defineProps({
    max: Number
})

const containerRef = ref(null)

let nextNum = 0
let prevNum = nextNum

const turnNext = num => {
    if (!containerRef.value) return
    containerRef.value.classList.add('flip-clock--down')

    prevNum = nextNum
    nextNum = num !== undefined ? num : (nextNum + 1) % max

    const card1 = containerRef.value.querySelector('.card1')
    const card2 = containerRef.value.querySelector('.card2')
    const card3 = containerRef.value.querySelector('.card3')
    const card4 = containerRef.value.querySelector('.card4')

    card1.textContent = prevNum
    card2.textContent = prevNum
    card3.textContent = nextNum
    card4.textContent = nextNum

    setTimeout(() => {
        containerRef.value.classList.remove('flip-clock--down')

        card1.textContent = nextNum
        card2.textContent = nextNum

        card1.classList.replace('card1', 'card3')
        card3.classList.replace('card3', 'card1')
        card4.classList.replace('card4', 'card2')
        card2.classList.replace('card2', 'card4')
    }, 600)
}

defineExpose({
    turnNext
})
</script>

<template>
    <div
        ref="containerRef"
        class="flip-clock"
    >
        <div class="flip-clock__card card1">0</div>
        <div class="flip-clock__card card2">0</div>
        <div class="flip-clock__card card3">1</div>
        <div class="flip-clock__card card4">1</div>
    </div>
</template>

<style scoped lang="scss">
$size: 6px;
$width: 7 * $size;
$height: 10 * $size;
$fontSize: 7 * $size;
$bg: #181818;
$fontColor: #fff;

.flip-clock {
    width: $width;
    height: $height;
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

    &.flip-clock--down {
        .flip-clock__card {
            transition: all 0.5s linear;
        }
        .card1 {
            transform: rotateX(-180deg);
        }

        .card4 {
            transform: rotateX(0deg);
            z-index: 2;
        }
    }

    // 两个卡片都设置为绝对定位，让其重叠在一起
    &__card {
        position: absolute;
        width: 100%;
        height: 50%;
        font-size: $fontSize;
        text-align: center;
        color: $fontColor;
        font-weight: bold;
        overflow: hidden;
        background-color: $bg;
        backface-visibility: hidden;
    }

    .card1 {
        top: 0;
        line-height: $height;
        border-radius: $size $size 0 0;
        z-index: 2;
        transform-origin: bottom center;
        transform: rotateX(0deg);
    }

    .card2 {
        bottom: 0;
        line-height: 0;
        border-radius: 0 0 $size $size;
    }

    .card3 {
        top: 0;
        line-height: $height;
        border-radius: $size $size 0 0;
    }

    .card4 {
        bottom: 0;
        line-height: 0;
        border-radius: 0 0 $size $size;
        backface-visibility: hidden;
        transform-origin: top center;
        transform: rotateX(180deg);
        z-index: 1;
    }
}
</style>
