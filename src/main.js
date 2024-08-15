import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
import router from './router';

import setupInterceptors from './axios-interceptors'; // 引入拦截器配置


createApp(App).mount('#app')
const app = createApp(App);
app.use(ElementPlus);
app.use(router);
app.mount('#app');
setupInterceptors(); // 配置拦截器
