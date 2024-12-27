<script setup lang="ts">
import PageHeader from '@/components/common/page-header/index.vue'
import { type Component } from 'vue'
import { CircleCheck, Files, EditPen, ChatLineSquare, User, Message } from '@element-plus/icons-vue'

interface NavItem {
    to: string
    icon: Component
    text: string
}

const navList: NavItem[] = [
    { to: '/materials/select', icon: CircleCheck, text: '选择' },
    { to: '/materials/input', icon: Files, text: '文本输入' },
    { to: '/materials/advanced', icon: EditPen, text: '高级题型' },
    { to: '/materials/note', icon: ChatLineSquare, text: '备注说明' },
    { to: '/materials/personal-info', icon: User, text: '个人信息' },
    { to: '/materials/contact', icon: Message, text: '联系方式' }
]
</script>

<template>
    <div class="materials-container flex flex-direction-column align-items-center">
        <PageHeader></PageHeader>
        <div class="main flex flex-1 p-20">
            <!-- 导航 -->
            <div class="nav-list">
                <router-link
                    v-for="(item, idx) in navList"
                    :key="idx"
                    :to="item.to"
                    class="nav-item flex-center flex-direction-column mb-10 text-center"
                >
                    <el-icon :size="16">
                        <Component :is="item.icon" />
                    </el-icon>
                    <div class="text">{{ item.text }}</div>
                </router-link>
            </div>
            <!-- content -->
            <div class="content flex-1">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.materials-container {
    width: 100%;
    height: 100%;
    .main {
        width: var(--center-width);
        .nav-list {
            --size: 80px;
            width: var(--size);
            height: 100%;
            .nav-item {
                width: 100%;
                height: var(--size);
                text-decoration: none;
                font-size: var(--font-size-base);
                color: var(--white);
                border-top-left-radius: var(--border-radius-large);
                border-bottom-left-radius: var(--border-radius-large);
                transition: background-color 0.25s ease-in;
                &:hover {
                    background-color: var(--el-color-primary-light-3);
                }
                .text {
                    margin-top: 5px;
                }
            }
            @for $i from 1 through 4 {
                .nav-item:nth-child(4n + #{$i}) {
                    @if $i == 1 {
                        background-color: var(--primary-color);
                    } @else if $i == 2 {
                        background-color: var(--success-color);
                    } @else if $i == 3 {
                        background-color: var(--warning-color);
                    } @else if $i == 4 {
                        background-color: var(--error-color);
                    }

                    &:hover {
                        @if $i == 1 {
                            background-color: var(--el-color-primary-light-3);
                        } @else if $i == 2 {
                            background-color: var(--el-color-success-light-3);
                        } @else if $i == 3 {
                            background-color: var(--el-color-warning-light-3);
                        } @else if $i == 4 {
                            background-color: var(--el-color-error-light-3);
                        }
                    }
                }
            }
        }
    }
}
</style>
