import {createRouter, createWebHistory} from 'vue-router';
import Login from '@/components/Login.vue';
import Home from '@/components/Home.vue';
import User from '@/components/system/user/User.vue';
import Role from '@/components/system/role/Role.vue';
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
        path: '/Role',
        name: 'Role',
        component: Role,
        meta: {requiresAuth: true},
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

const tokenVO = JSON.parse(localStorage.getItem('authToken'));

// 添加导航守卫,避免直接访问页面，未登录则跳转回登录页面
router.beforeEach((to, from, next) => {
    let isAuthenticated = false;
    if (tokenVO !== null && typeof tokenVO === 'object' && Object.keys(tokenVO).length > 0) {
        isAuthenticated = true;
    }
    if (to.matched.some(record => record.meta.requiresAuth)) {
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