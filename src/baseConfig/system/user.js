import service from '@/utils/interceptors.js'

export const UserApi = {

    // 新增
    save: async (userVO) => {
        return await service.post('/user/v1/user', userVO);
    },

    // 修改
    update: async (userVO) => {
        return await service.put('/user/v1/user', userVO);
    },

    // 删除
    delete: async (id) => {
        return await service.delete(`/user/v1/user/` + id)
    },

    // 批量删除
    batchDelete: async (ids) => {
        return await service.delete('/user/v1/user/batchDelete', {data: {ids}});
    },

    // 启用-禁用
    enableStatus: async (enableVo) => {
        return await service.put('/user/v1/user/forbidden', enableVo);
    },

    // 批量启用
    batchEnable: async (enableVo) => {
        return await service.put('/user/v1/user/batchEnable', enableVo);
    },

    // 重置密码
    resetPassword: async (id) => {
        return await service.put(`/user/v1/user/resetPassword/` + id)
    },

    // 修改密码
    updatePassword: async (formData) => {
        return await service.put(`/user/v1/user/password`, formData)
    },

    // 获取用户信息
    getUserInfo: async (id) => {
        return await service.get(`/user/v1/user/${id}`)
    },

    // 分页查询
    getPage: async (params) => {
        return await service.get(`/user/v1/user`, {params})
    },

    // 修改头像
    editAvatar: async (formData) => {
        return await service.put(`/user/v1/user/avatar`, formData)
    },

    //获取统计数据
    statistics: async (params) => {
        return await service.get(`/user/v1/user/statistics`, {params})
    },


}
