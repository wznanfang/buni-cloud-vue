import service from '@/utils/interceptors.js'

export const UserApi = {

    // 新增
    save: async (userVO) => {
        return await service.post({url: '/user/v1/user', userVO});
    },

    // 修改
    update: async (userVO) => {
        return await service.put({url: '/user/v1/user', userVO});
    },

    // 删除
    delete: async (id) => {
        return await service.delete({url: `/user/v1/user/` + id})
    },

    // 批量删除
    batchDelete: async (ids) => {
        return await service.delete({url: '/user/v1/user/batchDelete', data: ids});
    },

    // 启用-禁用
    enableStatus: async (enableVo) => {
        return await service.put({url: '/user/v1/user/forbidden', data: enableVo});
    },

    // 批量启用
    batchEnable: async (enableVo) => {
        return await service.put({url: '/user/v1/user/batchEnable', data: enableVo});
    },

    // 重置密码
    resetPassword: async (id) => {
        return await service.put({url: `/user/v1/user/resetPassword/` + id})
    },

    // 获取用户信息
    getUserInfo: async (id) => {
        return await service.get(`/user/v1/user/${id}`)
    },

    // 分页查询
    getPage: async (params) => {
        return await service.get({url: `/user/v1/user`, params})
    },


}
