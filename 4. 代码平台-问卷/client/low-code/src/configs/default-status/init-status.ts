// 导出各种初始化值状态

export const genderInitStatus = () => {
    return {
        title: '您的性别是？',
        desc: '请选择您的性别',
        options: ['男', '女', '保密'],
        currentStage: 2
    }
}

export const nameInitStatus = () => {
    return {
        title: '您的姓名是？',
        desc: '请输入您的姓名'
    }
}

export const multipleSelectInitStatus = () => {
    return {
        title: '默认多选题标题内容',
        desc: '默认多选题描述内容'
    }
}

export const multiplePicSelectInitStatus = () => {
    return {
        title: '默认图片多选题标题内容',
        desc: '默认图片多选题描述内容'
    }
}

export const optionSelectInitStatus = () => {
    return {
        title: '默认下拉选择题标题内容',
        desc: '默认下拉选择题描述内容'
    }
}

export const textInputInitStatus = () => {
    return {
        title: '默认标题内容',
        desc: '默认描述内容',
        typeTitle: '文本类型',
        typeOptions: ['单行文本', '多行文本'],
        typeIcons: ['icon-single-line', 'icon-multiple-line'],
        titleSizeOptions: ['18', '20', '22']
    }
}
