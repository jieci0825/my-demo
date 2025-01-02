// 导出各种初始化值状态

export const genderInitStatus = () => {
    return {
        title: '您的性别是？',
        desc: '请选择您的性别',
        options: ['男', '女', '保密'],
        currentStage: 2
    }
}

export const multiplePicSelectStatus = () => {
    return {
        title: '默认图片多选题标题内容',
        desc: '默认图片多选题描述内容'
    }
}
