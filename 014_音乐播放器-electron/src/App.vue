<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'

// 播放状态
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(0.7)
const currentSongIndex = ref(0)

// 播放模式: 'list' | 'random' | 'single'
const playMode = ref('list')

// 音频元素引用
const audioRef = ref(null)

// 歌曲列表
const songList = ref([
    { name: 'BEYOND - 光辉岁月', file: 'BEYOND - 光辉岁月.mp3', artist: 'BEYOND' },
    { name: 'BEYOND - 海阔天空', file: 'BEYOND - 海阔天空.mp3', artist: 'BEYOND' },
    { name: '不才 - 化身孤岛的鲸', file: '不才 - 化身孤岛的鲸.mp3', artist: '不才' },
    { name: '李克勤 - 护花使者', file: '李克勤 - 护花使者.mp3', artist: '李克勤' },
    { name: '李克勤 - 月半小夜曲', file: '李克勤 - 月半小夜曲.mp3', artist: '李克勤' },
    { name: '李荣浩 - 不搭', file: '李荣浩 - 不搭.mp3', artist: '李荣浩' },
    { name: '李荣浩 - 作曲家', file: '李荣浩 - 作曲家.mp3', artist: '李荣浩' },
    { name: '李荣浩 - 李白', file: '李荣浩 - 李白.mp3', artist: '李荣浩' },
    { name: '李荣浩 - 笑忘书 (Live)', file: '李荣浩 - 笑忘书 (Live).mp3', artist: '李荣浩' },
    { name: '李荣浩 - 老街', file: '李荣浩 - 老街.mp3', artist: '李荣浩' },
    { name: '陈奕迅 - 富士山下', file: '陈奕迅 - 富士山下.mp3', artist: '陈奕迅' },
    { name: '陈学冬 - 不再见', file: '陈学冬 - 不再见.mp3', artist: '陈学冬' },
    { name: '陈柏宇 - 你瞒我瞒', file: '陈柏宇 - 你瞒我瞒.mp3', artist: '陈柏宇' }
])

// 当前歌曲
const currentSong = computed(() => songList.value[currentSongIndex.value])

// 格式化时间
const formatTime = time => {
    if (isNaN(time)) return '00:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

// 播放/暂停
const togglePlay = () => {
    if (isPlaying.value) {
        audioRef.value.pause()
    } else {
        audioRef.value.play()
    }
    isPlaying.value = !isPlaying.value
}

// 上一首
const previousSong = () => {
    if (playMode.value === 'random') {
        currentSongIndex.value = Math.floor(Math.random() * songList.value.length)
    } else {
        currentSongIndex.value = currentSongIndex.value > 0 ? currentSongIndex.value - 1 : songList.value.length - 1
    }
    loadCurrentSong()
}

// 下一首
const nextSong = () => {
    if (playMode.value === 'random') {
        currentSongIndex.value = Math.floor(Math.random() * songList.value.length)
    } else {
        currentSongIndex.value = currentSongIndex.value < songList.value.length - 1 ? currentSongIndex.value + 1 : 0
    }
    loadCurrentSong()
}

// 切换播放模式
const togglePlayMode = () => {
    const modes = ['list', 'random', 'single']
    const currentIndex = modes.indexOf(playMode.value)
    playMode.value = modes[(currentIndex + 1) % modes.length]
}

// 获取播放模式图标
const getPlayModeIcon = () => {
    switch (playMode.value) {
        case 'list':
            return '🔄'
        case 'random':
            return '🔀'
        case 'single':
            return '🔂'
        default:
            return '🔄'
    }
}

// 加载当前歌曲
const loadCurrentSong = () => {
    if (audioRef.value) {
        // 尝试多种路径格式以确保兼容性
        const possiblePaths = [
            `./src/assets/music/${currentSong.value.file}`,
            `/src/assets/music/${currentSong.value.file}`,
            `./assets/music/${currentSong.value.file}`
        ]

        audioRef.value.src = possiblePaths[0]
        audioRef.value.load()
        if (isPlaying.value) {
            audioRef.value.play()
        }
    }
}

// 设置进度
const setProgress = event => {
    const progressBar = event.currentTarget
    const rect = progressBar.getBoundingClientRect()
    const percent = (event.clientX - rect.left) / rect.width
    const newTime = percent * duration.value
    audioRef.value.currentTime = newTime
    currentTime.value = newTime
}

// 设置音量
const setVolume = event => {
    const volumeBar = event.currentTarget
    const rect = volumeBar.getBoundingClientRect()
    const percent = (event.clientX - rect.left) / rect.width
    volume.value = Math.max(0, Math.min(1, percent))
    audioRef.value.volume = volume.value
}

// 选择歌曲
const selectSong = index => {
    currentSongIndex.value = index
    loadCurrentSong()
    if (!isPlaying.value) {
        togglePlay()
    }
}

// 音频事件处理
const handleAudioEvents = () => {
    const audio = audioRef.value

    audio.addEventListener('loadedmetadata', () => {
        duration.value = audio.duration
    })

    audio.addEventListener('timeupdate', () => {
        currentTime.value = audio.currentTime
    })

    audio.addEventListener('ended', () => {
        if (playMode.value === 'single') {
            audio.currentTime = 0
            audio.play()
        } else {
            nextSong()
        }
    })
}

// 组件挂载
onMounted(() => {
    handleAudioEvents()
    audioRef.value.volume = volume.value
    loadCurrentSong()
})

// 监听音量变化
watch(volume, newVolume => {
    if (audioRef.value) {
        audioRef.value.volume = newVolume
    }
})
</script>

<template>
    <div class="music-player">
        <audio
            ref="audioRef"
            preload="metadata"
        ></audio>

        <!-- 背景装饰 -->
        <div class="ink-bg">
            <div class="ink-circle circle1"></div>
            <div class="ink-circle circle2"></div>
            <div class="ink-circle circle3"></div>
        </div>

        <!-- 主播放器 -->
        <div class="player-container">
            <!-- 当前歌曲信息 -->
            <div class="song-info">
                <div class="song-cover">
                    <div
                        class="vinyl-record"
                        :class="{ spinning: isPlaying }"
                    >
                        <div class="vinyl-center"></div>
                    </div>
                </div>
                <div class="song-details">
                    <h2 class="song-title">{{ currentSong.name }}</h2>
                    <p class="song-artist">{{ currentSong.artist }}</p>
                </div>
            </div>

            <!-- 进度条 -->
            <div class="progress-section">
                <span class="time-display">{{ formatTime(currentTime) }}</span>
                <div
                    class="progress-bar"
                    @click="setProgress"
                >
                    <div class="progress-track"></div>
                    <div
                        class="progress-fill"
                        :style="{ width: `${(currentTime / duration) * 100}%` }"
                    ></div>
                    <div
                        class="progress-thumb"
                        :style="{ left: `${(currentTime / duration) * 100}%` }"
                    ></div>
                </div>
                <span class="time-display">{{ formatTime(duration) }}</span>
            </div>

            <!-- 控制按钮 -->
            <div class="controls">
                <button
                    class="control-btn mode-btn"
                    @click="togglePlayMode"
                    :title="playMode"
                >
                    {{ getPlayModeIcon() }}
                </button>
                <button
                    class="control-btn"
                    @click="previousSong"
                >
                    ⏮️
                </button>
                <button
                    class="control-btn play-btn"
                    @click="togglePlay"
                >
                    {{ isPlaying ? '⏸️' : '▶️' }}
                </button>
                <button
                    class="control-btn"
                    @click="nextSong"
                >
                    ⏭️
                </button>
                <div class="volume-control">
                    <span class="volume-icon">🔊</span>
                    <div
                        class="volume-bar"
                        @click="setVolume"
                    >
                        <div class="volume-track"></div>
                        <div
                            class="volume-fill"
                            :style="{ width: `${volume * 100}%` }"
                        ></div>
                        <div
                            class="volume-thumb"
                            :style="{ left: `${volume * 100}%` }"
                        ></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 播放列表 -->
        <div class="playlist">
            <h3 class="playlist-title">播放列表</h3>
            <div class="playlist-items">
                <div
                    v-for="(song, index) in songList"
                    :key="index"
                    class="playlist-item"
                    :class="{ active: index === currentSongIndex }"
                    @click="selectSong(index)"
                >
                    <div class="item-index">{{ index + 1 }}</div>
                    <div class="item-info">
                        <div class="item-name">{{ song.name }}</div>
                        <div class="item-artist">{{ song.artist }}</div>
                    </div>
                    <div
                        class="item-indicator"
                        v-if="index === currentSongIndex && isPlaying"
                    >
                        🎵
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.music-player {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    position: relative;
    overflow: hidden;
    padding: 2rem;
    font-family: 'Microsoft YaHei', sans-serif;
}

// 水墨背景
.ink-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
}

.ink-circle {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(24, 24, 24, 0.1) 0%, rgba(24, 24, 24, 0.05) 70%, transparent 100%);

    &.circle1 {
        width: 300px;
        height: 300px;
        top: -150px;
        right: -150px;
        animation: float 20s ease-in-out infinite;
    }

    &.circle2 {
        width: 200px;
        height: 200px;
        bottom: 100px;
        left: -100px;
        animation: float 25s ease-in-out infinite reverse;
    }

    &.circle3 {
        width: 150px;
        height: 150px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        animation: float 30s ease-in-out infinite;
    }
}

@keyframes float {
    0%,
    100% {
        transform: translateY(0px) rotate(0deg);
    }
    33% {
        transform: translateY(-20px) rotate(120deg);
    }
    66% {
        transform: translateY(10px) rotate(240deg);
    }
}

// 主播放器容器
.player-container {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(24, 24, 24, 0.1);
    position: relative;
    z-index: 1;
    margin-bottom: 2rem;
    border: 1px solid rgba(24, 24, 24, 0.1);
}

// 歌曲信息
.song-info {
    display: flex;
    align-items: center;
    gap: 2rem;
    margin-bottom: 2rem;
}

.song-cover {
    flex-shrink: 0;
}

.vinyl-record {
    width: 120px;
    height: 120px;
    background: #181818;
    border-radius: 50%;
    position: relative;
    transition: transform 0.3s ease;

    &.spinning {
        animation: spin 3s linear infinite;
    }

    .vinyl-center {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 30px;
        height: 30px;
        background: #666;
        border-radius: 50%;
    }
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.song-details {
    flex: 1;
}

.song-title {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
    color: #181818;
    font-weight: 600;
}

.song-artist {
    margin: 0;
    color: #666;
    font-size: 1rem;
}

// 进度条
.progress-section {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
}

.progress-bar {
    flex: 1;
    height: 6px;
    background: #e0e0e0;
    border-radius: 3px;
    position: relative;
    cursor: pointer;

    .progress-track {
        height: 100%;
        background: #e0e0e0;
        border-radius: 3px;
    }

    .progress-fill {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background: #181818;
        border-radius: 3px;
        transition: width 0.1s ease;
    }

    .progress-thumb {
        position: absolute;
        top: -4px;
        width: 14px;
        height: 14px;
        background: #181818;
        border-radius: 50%;
        transform: translateX(-50%);
        cursor: grab;

        &:active {
            cursor: grabbing;
        }
    }
}

.time-display {
    font-size: 0.9rem;
    color: #666;
    min-width: 40px;
    text-align: center;
}

// 控制按钮
.controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
}

.control-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.3s ease;

    &:hover {
        background: rgba(24, 24, 24, 0.1);
        transform: scale(1.1);
    }

    &.play-btn {
        font-size: 2rem;
        background: #181818;
        color: white;
        width: 60px;
        height: 60px;

        &:hover {
            background: #333;
        }
    }

    &.mode-btn {
        font-size: 1.2rem;
    }
}

// 音量控制
.volume-control {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: 1rem;
}

.volume-icon {
    font-size: 1.2rem;
}

.volume-bar {
    width: 100px;
    height: 4px;
    background: #e0e0e0;
    border-radius: 2px;
    position: relative;
    cursor: pointer;

    .volume-track {
        height: 100%;
        background: #e0e0e0;
        border-radius: 2px;
    }

    .volume-fill {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background: #181818;
        border-radius: 2px;
        transition: width 0.1s ease;
    }

    .volume-thumb {
        position: absolute;
        top: -3px;
        width: 10px;
        height: 10px;
        background: #181818;
        border-radius: 50%;
        transform: translateX(-50%);
        cursor: grab;

        &:active {
            cursor: grabbing;
        }
    }
}

// 播放列表
.playlist {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 1.5rem;
    box-shadow: 0 10px 30px rgba(24, 24, 24, 0.1);
    position: relative;
    z-index: 1;
    border: 1px solid rgba(24, 24, 24, 0.1);
}

.playlist-title {
    margin: 0 0 1rem 0;
    color: #181818;
    font-size: 1.2rem;
    font-weight: 600;
}

.playlist-items {
    max-height: 400px;
    overflow-y: auto;
}

.playlist-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background: rgba(24, 24, 24, 0.05);
    }

    &.active {
        background: rgba(24, 24, 24, 0.1);
        color: #181818;
    }
}

.item-index {
    width: 30px;
    text-align: center;
    font-size: 0.9rem;
    color: #666;
}

.item-info {
    flex: 1;
}

.item-name {
    font-weight: 500;
    margin-bottom: 0.2rem;
}

.item-artist {
    font-size: 0.9rem;
    color: #666;
}

.item-indicator {
    font-size: 1.2rem;
    animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
    0%,
    100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}

// 响应式设计
@media (max-width: 768px) {
    .music-player {
        padding: 1rem;
    }

    .song-info {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
    }

    .controls {
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .volume-control {
        margin-left: 0;
        margin-top: 0.5rem;
    }

    .playlist-item {
        padding: 0.5rem;
    }
}
</style>
