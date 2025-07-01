<template>
    <!-- 翻页时钟组件 -->
    <div class="flip-clock">
        <!-- 分为三组，即 时 | 分 | 秒 -->
        <div
            class="flip-clock-gp"
            v-if="showMode & 0b100"
        >
            <!-- 标签 -->
            <div
                class="flip-clock-tag"
                v-if="showTag"
            >
                时
            </div>
            <!-- 页片 -->
            <div class="flip-clock-gpm">
                <FlipClockItem
                    :mode="mode"
                    ref="hdx"
                />
                <FlipClockItem
                    :mode="mode"
                    ref="hdy"
                />
            </div>
        </div>
        <div
            class="flip-clock-gp"
            v-if="showMode & 0b010"
        >
            <!-- 标签 -->
            <div
                class="flip-clock-tag"
                v-if="showTag"
            >
                分
            </div>
            <!-- 页片 -->
            <div class="flip-clock-gpm">
                <FlipClockItem
                    :mode="mode"
                    ref="mdx"
                />
                <FlipClockItem
                    :mode="mode"
                    ref="mdy"
                />
            </div>
        </div>
        <div
            class="flip-clock-gp"
            v-if="showMode & 0b001"
        >
            <!-- 标签 -->
            <div
                class="flip-clock-tag"
                v-if="showTag"
            >
                秒
            </div>
            <!-- 页片 -->
            <div class="flip-clock-gpm">
                <FlipClockItem
                    :mode="mode"
                    ref="sdx"
                />
                <FlipClockItem
                    :mode="mode"
                    ref="sdy"
                />
            </div>
        </div>
        <!-- 12小时制的标签 -->
        <div
            class="flip-clock-pm"
            v-if="type === 'clock' && timeMode === '12'"
        >
            <span class="label">{{ meridium }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import FlipClockItem from './FlipClockItem.vue'

interface FlipClockProps {
    showMode?: number // 显示模式
    timeMode?: '12' | '24' // 时间模式
    showTag?: boolean // 是否显示标签
    type?: 'clock' | 'time' // 类型：时钟 | 计时器
    mode?: 'up' | 'down' // 向上|下翻
}

const props = withDefaults(defineProps<FlipClockProps>(), {
    /**
     * 显示模式：用三位二进制分别代表时分秒的显隐(1-显|0-隐)
     * - 0b111 表示时分秒均显示
     * - 计时有两种形式，按分和按秒
     *   - 由最低显示位决定，即如果秒有显示就按秒，秒无显示按分
     */
    showMode: 0b111,
    timeMode: '24',
    showTag: true,
    type: 'clock',
    mode: 'down'
})

const meridium = ref('AM')

// 控制时帧变化
const hdx = ref<InstanceType<typeof FlipClockItem>>()
const hdy = ref<InstanceType<typeof FlipClockItem>>()
// 分帧
const mdx = ref<InstanceType<typeof FlipClockItem>>()
const mdy = ref<InstanceType<typeof FlipClockItem>>()
// 秒帧
const sdx = ref<InstanceType<typeof FlipClockItem>>()
const sdy = ref<InstanceType<typeof FlipClockItem>>()

// 初始时间表
// 0 0 : 0 0 : 0 0
const timeNum = {
    hx: 0,
    hy: 0,
    mx: 0,
    my: 0,
    sx: 0,
    sy: 0
}

/**
 * 同步时钟变化
 * 翻页
 */
const turnFlip = () => {
    // 获取时间表
    let now: any = {}
    if (props.type === 'clock') now = getClockNum(new Date())
    else now = getTimingNum()
    // 可显示时
    if (props.showMode & 0b100) {
        // 变化时帧
        if (timeNum.hx !== now.hx) {
            // 当 当前时间的 时 与记录不同时，变换到当前 时
            hdx.value && hdx.value.turnNext(now.hx)
            // 记录当前时
            timeNum.hx = now.hx
        }
        if (timeNum.hy !== now.hy) {
            // 当 当前时间的 时 与记录不同时，变换到当前 时
            hdy.value && hdy.value.turnNext(now.hy)
            // 记录当前时
            timeNum.hy = now.hy
        }
    }
    // 可显示分
    if (props.showMode & 0b010) {
        // 分变换
        if (timeNum.mx !== now.mx) {
            mdx.value && mdx.value.turnNext(now.mx)
            timeNum.mx = now.mx
        }
        if (timeNum.my !== now.my) {
            mdy.value && mdy.value.turnNext(now.my)
            timeNum.my = now.my
        }
    }
    // 可显示秒
    if (props.showMode & 0b001) {
        if (timeNum.sx !== now.sx) {
            sdx.value && sdx.value.turnNext(now.sx)
            timeNum.sx = now.sx
        }
        if (timeNum.sy !== now.sy) {
            sdy.value && sdy.value.turnNext(now.sy)
            timeNum.sy = now.sy
        }
    }
}
/**
 * 获取时间表
 * 将传入的时间转化为类似timeNum的时间表
 * @param time
 */
const getClockNum = (time: Date) => {
    let hour = time.getHours()
    const minute = time.getMinutes()
    const second = time.getSeconds()
    // 12小时制特殊处理
    if (props.timeMode === '12') {
        if (hour >= 12) meridium.value = 'PM'
        else meridium.value = 'AM'
        hour %= 12
        hour = hour === 0 ? 12 : hour
    }
    return {
        hx: Math.floor(hour / 10),
        hy: hour % 10,
        mx: Math.floor(minute / 10),
        my: minute % 10,
        sx: Math.floor(second / 10),
        sy: second % 10
    }
}

/**
 * 获取当前与下一时刻的差值
 * @param {'m'|'s'} tp
 */
const getNextTip = (tp = 's') => {
    const now = new Date()
    const nowTmp = now.getTime()
    if (tp === 'm') {
        now.setMinutes(now.getMinutes() + 1)
    } else {
        now.setSeconds(now.getSeconds() + 1)
    }
    const nextTmp = Date.parse(now.toLocaleString())
    return nextTmp - nowTmp
}
/**
 * 获取当前计时模式： 按分 | 秒
 */
const getTimingMode = () => {
    if (props.showMode & 0b001) return { mode: 's', interval: 1000 }
    else return { mode: 'm', interval: 60000 }
}
// 计时器
let timer: any = null
/**
 * 开始时钟计时
 */
const startClock = () => {
    // 同步当前时钟一次
    turnFlip()
    // 获取当前计时模式
    const mode = getTimingMode()
    // 获取下一分|秒差值
    const tmp = getNextTip(mode.mode)
    if (timer) clearInterval(timer)
    setTimeout(() => {
        timer = setInterval(turnFlip, mode.interval)
    }, tmp)
}
// 计时器模式
// 记录时间
let timeCount = 0
// 获取计时时间表
const getTimingNum = () => {
    let tmp = timeCount
    const hour = props.timeMode === '12' ? Math.floor(tmp / 3600) % 12 : Math.floor(tmp / 3600)
    tmp %= 3600
    const minute = Math.floor(tmp / 60)
    tmp %= 60
    const second = tmp
    return {
        hx: Math.floor(hour / 10),
        hy: hour % 10,
        mx: Math.floor(minute / 10),
        my: minute % 10,
        sx: Math.floor(second / 10),
        sy: second % 10
    }
}
/**
 * 开始计时器
 */
const startTiming = () => {
    // 获取时间模式
    const mode = getTimingMode()
    if (timer) clearInterval(timer)
    timer = setInterval(() => {
        timeCount += 1
        turnFlip()
    }, mode.interval)
}

onMounted(() => {
    if (props.type === 'clock') startClock()
    else startTiming()
})
</script>

<style lang="scss" scoped>
.flip-clock {
    $size: 10px;
    $bg: #333;
    $dotShadow: 0 0 calc($size / 2) 0 rgba(0, 0, 0, 0.5);
    $tagColor: #1e2732;
    display: flex;
    user-select: none;
    .flip-clock-gp {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        row-gap: 8px;
        & + .flip-clock-gp {
            margin-left: 3.2 * $size;

            .flip-clock-gpm {
                // 分隔点
                &::before,
                &::after {
                    content: '';
                    display: block;
                    width: 1.2 * $size;
                    height: 1.2 * $size;
                    border-radius: 50%;
                    background-color: $bg;
                    box-shadow: $dotShadow;
                    position: absolute;
                    left: -2.2 * $size;
                }
                &::before {
                    top: 27%;
                }
                &::after {
                    bottom: 27%;
                }
            }
        }
    }
    .flip-clock-tag {
        font-size: 2.4 * $size;
        font-weight: bold;
        color: $tagColor;
    }
    .flip-clock-gpm {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }
    .flip-clock-pm {
        margin-left: 12px;
        font-size: 32px;
        font-weight: bold;
        color: $bg;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
    }
}
</style>
