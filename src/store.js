// 全局用户数据存储
import {createStore} from "vuex";

export const store = createStore({
    state() {
        return {
            userInfo: null,
        };
    },
    mutations: {
        myself(state, data) {
            state.userInfo = data;
        },
    },
});