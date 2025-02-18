import service from '@/utils/interceptors.js'
import { useUserStore } from '@/utils/user'
import { ElMessage } from 'element-plus'

export function logout(router) {
    const userStore = useUserStore()

    return service.post('/user/v1/loginOut').finally(() => {
        userStore.clearUser()
        ElMessage.success('退出登录成功')
        router.push({ name: 'Login' })
    })
}

// 获取用户信息
export const getUserInfo = (id) => service.get(`/user/v1/user/${id}`)

