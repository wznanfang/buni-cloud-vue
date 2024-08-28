import {createRouter, createWebHistory} from 'vue-router';
import Login from '@/components/Login.vue';
import Home from '@/components/Home.vue';
import User from '@/components/system/user/User.vue';
import Authority from '@/components/system/authority/Authority.vue';
import UserProfile from '@/components/system/user/UserProfile.vue';

const routes = [
    {
        path: '/',
        redirect: '/Login'
    },
    {
        path: '/Login',
        name: 'Login',
        component: Login
    },
    {
        path: '/UserProfile',
        name: 'UserProfile',
        component: UserProfile,
        meta: {requiresAuth: true},
    },
    {
        path: '/Home',
        name: 'Home',
        component: Home,
        meta: {requiresAuth: true},
    },
    {
        path: '/User',
        name: 'User',
        component: User,
        meta: {requiresAuth: true},
    },
    {
        path: '/Authority',
        name: 'Authority',
        component: Authority,
        meta: {requiresAuth: true},
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});



// 添加导航守卫,避免直接访问页面，未登录则跳转回登录页面
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        const tokenVO = JSON.parse(localStorage.getItem('authToken'));
        const isAuthenticated = Boolean(tokenVO && typeof tokenVO === 'object' && Object.keys(tokenVO).length > 0);
        if (isAuthenticated) {
            next();
        } else {
            next('/Login');
        }
    } else {
        next();
    }
});

export default router;