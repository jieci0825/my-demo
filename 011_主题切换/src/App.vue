<script setup lang="ts">
import { useTheme } from './hooks'

const { isDark, toggleTheme, followSystem, switchFollowSystem } = useTheme()
</script>

<template>
    <div class="container">
        <header>
            <div class="logo">主题切换Demo</div>
            <button
                class="theme-toggle"
                @click="() => toggleTheme()"
            >
                <span id="theme-icon">{{ isDark ? '☀️' : '🌙' }}</span> 切换主题
            </button>
            <button @click="() => switchFollowSystem()">{{ followSystem ? '关闭' : '开启' }}-跟随系统</button>
        </header>

        <main>
            <div class="card">
                <h2>欢迎使用主题切换功能</h2>
                <p>这是一个展示CSS变量实现主题切换的Demo界面。点击右上角按钮可以在亮色和暗色主题之间切换。</p>
            </div>

            <div class="card">
                <h3>示例组件</h3>
                <div class="input-group">
                    <input
                        type="text"
                        placeholder="输入示例..."
                    />
                </div>
                <button class="btn">主要按钮</button>
                <button
                    class="btn"
                    style="background: var(--card-bg); color: var(--text); border: 1px solid var(--border)"
                >
                    次要按钮
                </button>
            </div>
        </main>
    </div>
</template>

<style scoped>
.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0;
    border-bottom: 1px solid var(--border);
    margin-bottom: 30px;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--primary);
}

.theme-toggle {
    background: var(--card-bg);
    border: 1px solid var(--border);
    color: var(--text);
    padding: 8px 15px;
    border-radius: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
}

.theme-toggle:hover {
    background: var(--primary);
    color: white;
}

.card {
    background: var(--card-bg);
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 10px var(--shadow);
}

.btn {
    background: var(--primary);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 10px;
    transition: opacity 0.2s;
}

.btn:hover {
    opacity: 0.9;
}

.input-group {
    margin: 15px 0;
}

input {
    padding: 10px;
    border: 1px solid var(--border);
    border-radius: 4px;
    background: var(--bg);
    color: var(--text);
    width: 200px;
}
</style>
