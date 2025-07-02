<script setup>
import { ref, onMounted, computed } from 'vue'
import FlipClockItem from '../FlipClockItem/index.vue'

// 获取各个组件的引用
const hourTenRef = ref(null)
const hourUnitRef = ref(null)
const minuteTenRef = ref(null)
const minuteUnitRef = ref(null)
const secondTenRef = ref(null)
const secondUnitRef = ref(null)

const refs = [
    { ref: hourTenRef, key: 'hourTen' },
    { ref: hourUnitRef, key: 'hourUnit' },
    { ref: minuteTenRef, key: 'minuteTen' },
    { ref: minuteUnitRef, key: 'minuteUnit' },
    { ref: secondTenRef, key: 'secondTen' },
    { ref: secondUnitRef, key: 'secondUnit' }
]

// 当前时间状态
const currentTime = ref({
    hour: 0,
    minute: 0,
    second: 0
})

const setTime = () => {
    // 存储上一次的时间
    const prevTimeDigits = { ...timeDigits.value }

    const time = new Date()
    const hour = time.getHours()
    const minute = time.getMinutes()
    const second = time.getSeconds()

    currentTime.value = { hour, minute, second }

    // 更新各个组件的值
    refs.forEach(({ ref, key }) => {
        if (!ref.value) return
        // 检测当前时间与上一次的时间是否一致，若一致也无需触发
        if (prevTimeDigits[key] === timeDigits.value[key]) return
        // 触发动画
        ref.value.turnNext(timeDigits.value[key])
    })
}

// 计算各位数字
const timeDigits = computed(() => ({
    hourTen: Math.floor(currentTime.value.hour / 10),
    hourUnit: currentTime.value.hour % 10,
    minuteTen: Math.floor(currentTime.value.minute / 10),
    minuteUnit: currentTime.value.minute % 10,
    secondTen: Math.floor(currentTime.value.second / 10),
    secondUnit: currentTime.value.second % 10
}))

let timer = null

const start = () => {
    // 同步一次时间
    setTime()
    // 计算当前时间与下一刻(秒)的时间差
    const diff = timeDiff()

    if (timer) clearInterval(timer)

    setTimeout(() => {
        // 开始计时
        timer = setInterval(setTime, 1000)
    }, diff)
}

// 计算当前时间与下一刻的时间差
const timeDiff = () => {
    const now = new Date()
    now.setSeconds(now.getSeconds() + 1)

    const currentTime = Date.now()
    const nextTime = Date.parse(now.toLocaleString())

    return nextTime - currentTime
}

onMounted(() => {
    start()
})
</script>

<template>
    <div class="clock-wrap">
        <FlipClockItem
            ref="hourTenRef"
            :max="3"
        />
        <FlipClockItem
            ref="hourUnitRef"
            :max="10"
        />
        <div class="divide"></div>
        <FlipClockItem
            ref="minuteTenRef"
            :max="6"
        />
        <FlipClockItem
            ref="minuteUnitRef"
            :max="10"
        />
        <div class="divide"></div>
        <FlipClockItem
            ref="secondTenRef"
            :max="6"
        />
        <FlipClockItem
            ref="secondUnitRef"
            :max="10"
        />
    </div>
</template>

<style scoped lang="scss">
.clock-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    .divide {
        $size: 10px;
        font-weight: bold;
        font-size: 40px;
        color: #181818;
        width: $size;
        height: 30px;
        position: relative;
        &::before,
        &::after {
            content: '';
            position: absolute;
            width: $size;
            height: $size;
            border-radius: 50%;
            background-color: #181818;
        }
        &::before {
            top: 0;
        }
        &::after {
            bottom: 0;
        }
    }
}
</style>
