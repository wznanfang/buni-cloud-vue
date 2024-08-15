import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/components/Login.vue';
import CommonLayout from '@/components/CommonLayout.vue';
import Home from '@/components/Home.vue';
import User from '@/components/User.vue';
import Role from '@/components/Role.vue';

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
        path: '/CommonLayout',
        name: 'CommonLayout',
        component: CommonLayout
    },
    {
        path: '/Home',
        name: 'Home',
        component: Home
    },
    {
        path: '/User',
        name: 'User',
        component: User
    },
    {
        path: '/Role',
        name: 'Role',
        component: Role
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;