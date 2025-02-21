import service from '@/utils/interceptors.js'


export const AuthApi = {

    // 登录
    login: async (loginVo) => {
        return await service.post('/user/v1/login', loginVo);
    },

    // 退出登录
    logout: async (router) => {
        return service.post('/user/v1/loginOut');
    },


}

