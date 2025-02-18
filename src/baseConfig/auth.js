import service from '@/utils/interceptors.js'
import {useUserStore} from '@/utils/user'
import {ElMessage} from 'element-plus'


export const AuthApi = {

    // 登录
    login: async (loginVo) => {
        return await service.post('/user/v1/login', loginVo);
    },

    // 退出登录
    logout: async (router) => {
        const userStore = useUserStore()
        return service.post('/user/v1/loginOut').finally(() => {
            userStore.clearUser()
            ElMessage.success('退出登录成功')
            router.push({name: 'Login'})
        });
    },

    // 获取用户信息
    getUserInfo: async (id) => {
        const userStore = useUserStore()
        return service.get(`/user/v1/user/${id}`).then((res) => {
            userStore.setUser(res)
        });
    }


}

