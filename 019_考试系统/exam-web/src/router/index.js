import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/components/layout/index.vue'

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login/index.vue'),
        meta: {
            title: '登录',
            requiresAuth: false
        }
    },
    {
        path: '/',
        component: Layout,
        redirect: '/home',
        meta: {
            requiresAuth: true
        },
        children: [
            {
                path: 'home',
                name: 'Home',
                component: () => import('@/views/home/index.vue'),
                meta: {
                    title: '首页',
                    requiresAuth: true
                }
            },
            {
                path: 'exam-data',
                name: 'ExamData',
                redirect: '/exam-data/paper-manage',
                meta: {
                    title: '考试数据',
                    requiresAuth: true
                },
                children: [
                    {
                        path: 'paper-manage',
                        name: 'PaperManage',
                        component: () => import('@/views/exam-data/paper-manage/index.vue'),
                        meta: {
                            title: '考卷管理',
                            requiresAuth: true
                        }
                    },
                    {
                        path: 'question-manage',
                        name: 'QuestionManage',
                        component: () => import('@/views/exam-data/question-manage/index.vue'),
                        meta: {
                            title: '问题管理',
                            requiresAuth: true
                        }
                    }
                ]
            },
            {
                path: 'exam-manage',
                name: 'ExamManage',
                redirect: '/exam-manage/exam-list',
                meta: {
                    title: '考试管理',
                    requiresAuth: true
                },
                children: [
                    {
                        path: 'exam-list',
                        name: 'ExamList',
                        component: () => import('@/views/exam-manage/exam-list/index.vue'),
                        meta: {
                            title: '考试记录',
                            requiresAuth: true
                        }
                    }
                ]
            }
        ]
    },
    {
        path: '/404',
        name: 'NotFound',
        component: () => import('@/views/404/index.vue'),
        meta: {
            title: '页面不存在',
            requiresAuth: false
        }
    },
    {
        path: '/exam-paper',
        name: 'ExamPaper',
        component: () => import('@/views/exam-paper/index.vue'),
        meta: {
            title: '考卷',
            requiresAuth: true
        }
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/404'
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
    // 设置页面标题
    if (to.meta.title) {
        document.title = to.meta.title
    }

    // 检查是否需要登录
    if (to.meta.requiresAuth) {
        // 这里可以检查用户登录状态，比如从localStorage或store中获取token
        const token = localStorage.getItem('token')

        if (!token) {
            // 未登录，重定向到登录页
            next('/login')
            return
        }
    }

    // 如果已经登录且访问登录页，重定向到首页
    if (to.path === '/login') {
        const token = localStorage.getItem('token')
        if (token) {
            next('/')
            return
        }
    }

    next()
})

export default router
