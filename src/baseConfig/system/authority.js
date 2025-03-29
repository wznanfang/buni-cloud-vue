import service from '@/utils/interceptors.js'

export const AuthorityApi = {

    // 新增
    save: async (AddVO) => {
        return await service.post({url: '/user/v1/authority', AddVO});
    },

    update: async (UpdateVO) => {
        return await service.put({url: '/user/v1/authority', UpdateVO});
    },

    delete: async (id) => {
        return await service.delete(`/user/v1/authority/` + id)
    },

    batchDelete: async (ids) => {
        return await service.delete({url: `/user/v1/authority`, ids})
    },

    findById: async (id) => {
        return await service.get(`/user/v1/authority/` + id)
    },

    // 查询父级菜单
    findParent: async () => {
        return await service.get({url: `user/v1/findMenuTree`})
    },

    // 分页查询
    getPage: async (params) => {
        return await service.get(`/user/v1/authority`, { params })
    },


}
