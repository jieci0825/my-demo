import { OptionSelect } from '@/components/survey-comps/materials/select-comps'
import { markRaw } from 'vue'
// 导出各种初始化值状态

export const genderInitStatus = () => {
    return {
        title: '您的性别是？',
        desc: '请选择您的性别',
        options: ['男', '女', '保密'],
        currentStage: 2
    }
}

export const ageInitStatus = () => {
    return {
        title: '您的年龄是？',
        desc: '请选择您的年龄',
        options: ['18岁以下', '18-24岁', '25-34岁', '35-44岁', '45-54岁', '55岁以上'],
        currentStage: 1
    }
}

export const careerInitStatus = () => {
    return {
        title: '您的职业是？',
        desc: '请选择您的职业',
        options: [
            '在校学生',
            '政府/机关干部/公务员',
            '企业管理者（包括基层及中高层管理者）',
            '专业人员（如医生/律师/文体/记者/老师等）',
            '普通职员（办公室/写字楼工作人员）',
            '普通工人（如工厂工人/体力劳动者等）',
            '商业服务业职工（如销售人员/商店职员/服务员等）',
            '个体经营者/承包商',
            '自由职业者',
            '农林牧渔劳动者',
            '退休',
            '暂无职业',
            '其他'
        ],
        currentStage: 1
    }
}

export const educationInitStatus = () => {
    return {
        title: '您的学历是？',
        desc: '请选择您的学历',
        options: ['初中及以下', '高中/中专/技校', '大学大专', '大学本科', '硕士及以上'],
        currentStage: 1
    }
}

export const nameInitStatus = () => {
    return {
        title: '您的姓名是？',
        desc: '请输入您的姓名',
        titleSizeOptions: ['18', '20', '22']
    }
}

export const idInitStatus = () => {
    return {
        title: '您的身份证号是？',
        desc: '请输入您的身份证号',
        titleSizeOptions: ['18', '20', '22']
    }
}

export const collageInitStatus = () => {
    return {
        title: '您的学校是？',
        desc: '请输入您的学校',
        titleSizeOptions: ['18', '20', '22']
    }
}

export const majorInitStatus = () => {
    return {
        title: '您的专业是？',
        desc: '请输入您的专业',
        titleSizeOptions: ['18', '20', '22']
    }
}

export const industryInitStatus = () => {
    return {
        title: '您的行业是？',
        desc: '请选择您的行业',
        titleSizeOptions: ['18', '20', '22']
    }
}

export const companyInitStatus = () => {
    return {
        title: '您的公司是？',
        desc: '请输入您的公司',
        titleSizeOptions: ['18', '20', '22']
    }
}

export const positionInitStatus = () => {
    return {
        title: '您的职位是？',
        desc: '请输入您的职位',
        titleSizeOptions: ['18', '20', '22']
    }
}

export const phoneInitStatus = () => {
    return {
        title: '您的手机号是？',
        desc: '请输入您的手机号',
        titleSizeOptions: ['18', '20', '22']
    }
}

export const emailInitStatus = () => {
    return {
        title: '您的邮箱是？',
        desc: '请输入您的邮箱',
        titleSizeOptions: ['18', '20', '22']
    }
}

export const qqInitStatus = () => {
    return {
        title: '您的QQ是？',
        desc: '请输入您的QQ',
        titleSizeOptions: ['18', '20', '22']
    }
}

export const wechatInitStatus = () => {
    return {
        title: '您的微信是？',
        desc: '请输入您的微信',
        titleSizeOptions: ['18', '20', '22']
    }
}

export const addressInitStatus = () => {
    return {
        title: '您的地址是？',
        desc: '请输入您的地址',
        titleSizeOptions: ['18', '20', '22']
    }
}

export const optionSelectInitStatus = () => {
    return {
        title: '默认下拉选择题标题内容',
        desc: '默认下拉选择题描述内容',
        typeComp: markRaw(OptionSelect)
    }
}

export const birthInitStatus = () => {
    return {
        title: '您的出生日期是？',
        desc: '请选择您的出生日期'
    }
}
