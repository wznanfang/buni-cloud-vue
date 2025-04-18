import service from '@/utils/interceptors.js'


export const SystemFileApi = {

    // 上传文件
    upload: async (formData) => {
        return await service.post('/file/v1/upload', formData);
    },


}
