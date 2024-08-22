import {createStore} from "vuex";

// 全局用户数据存储
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