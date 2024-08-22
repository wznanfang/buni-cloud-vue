import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'; // 导入中文语言包
import router from './router';
import setupInterceptors from './axios-interceptors'; // 引入拦截器配置
import { store } from './store';

const app = createApp(App)

app.use(ElementPlus, {
    locale: zhCn, // 设置语言
    // 自定义分页器的文本
    i18n: (key, value) => {
        if (key === 'el.pagination.items_per_page') {
            return `${value}条/页`; // 自定义“条/页”文本
        } else if (key === 'el.pagination.jump_to') {
            return `跳至`; // 自定义“跳至”文本
        } else if (key === 'el.pagination.prev_page') {
            return '上一页'; // 自定义“上一页”文本
        } else if (key === 'el.pagination.next_page') {
            return '下一页'; // 自定义“下一页”文本
        } else if (key === 'el.pagination.pageClassifier') {
            return `页`; // 自定义“页”文本
        }
        return value;
    }
});

app.use(router);
app.use(store);
setupInterceptors(); // 配置拦截器
app.mount('#app');
