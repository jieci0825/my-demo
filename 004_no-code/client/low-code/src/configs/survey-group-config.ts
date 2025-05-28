import {
    DATE_TIME_KEY,
    MULTIPLE_PIC_SELECT_KEY,
    MULTIPLE_SELECT_KEY,
    OPTION_SELECT_KEY,
    PRESET_CONTACT_ADDRESS_KEY,
    PRESET_CONTACT_EMAIL_KEY,
    PRESET_CONTACT_PHONE_KEY,
    PRESET_CONTACT_QQ_KEY,
    PRESET_CONTACT_WECHAT_KEY,
    PRESET_PERSONAL_INFO_AGE_KEY,
    PRESET_PERSONAL_INFO_BIRTH_KEY,
    PRESET_PERSONAL_INFO_CAREER_KEY,
    PRESET_PERSONAL_INFO_COLLAGE_KEY,
    PRESET_PERSONAL_INFO_COMPANY_KEY,
    PRESET_PERSONAL_INFO_EDUCATION_KEY,
    PRESET_PERSONAL_INFO_GENDER_KEY,
    PRESET_PERSONAL_INFO_ID_KEY,
    PRESET_PERSONAL_INFO_INDUSTRY_KEY,
    PRESET_PERSONAL_INFO_MAJOR_KEY,
    PRESET_PERSONAL_INFO_NAME_KEY,
    PRESET_PERSONAL_INFO_POSITION_KEY,
    RATE_SCORE_KEY,
    SINGLE_PIC_SELECT_KEY,
    SINGLE_SELECT_KEY,
    TEXT_INPUT_KEY,
    TEXT_NODE_KEY
} from '@/constants'
import type { MaterialGroup } from '@/types'
import { CircleCheck, Files, EditPen, ChatLineSquare, User, Message } from '@element-plus/icons-vue'

export const SurveyComsList: MaterialGroup[] = [
    {
        title: '选择',
        icon: CircleCheck,
        list: [
            { materialName: SINGLE_SELECT_KEY, comName: '单选' },
            { materialName: MULTIPLE_SELECT_KEY, comName: '多选' },
            { materialName: OPTION_SELECT_KEY, comName: '下拉' },
            { materialName: SINGLE_PIC_SELECT_KEY, comName: '图片单选' },
            { materialName: MULTIPLE_PIC_SELECT_KEY, comName: '图片多选' }
        ]
    },

    {
        title: '文本输入',
        icon: EditPen,
        list: [{ materialName: TEXT_INPUT_KEY, comName: '文本输入' }]
    },
    {
        title: '高级题型',
        icon: Files,
        list: [
            { materialName: RATE_SCORE_KEY, comName: '评价/打分' },
            { materialName: DATE_TIME_KEY, comName: '日期/时间' }
        ]
    },
    {
        title: '备注说明',
        icon: ChatLineSquare,
        list: [
            {
                materialName: TEXT_NODE_KEY,
                comName: '备注说明'
            }
        ]
    },
    {
        title: '个人信息',
        icon: User,
        list: [
            { materialName: PRESET_PERSONAL_INFO_NAME_KEY, comName: '姓名' },
            { materialName: PRESET_PERSONAL_INFO_ID_KEY, comName: '身份证' },
            { materialName: PRESET_PERSONAL_INFO_BIRTH_KEY, comName: '出生日期' },
            { materialName: PRESET_PERSONAL_INFO_GENDER_KEY, comName: '性别' },
            { materialName: PRESET_PERSONAL_INFO_AGE_KEY, comName: '年龄' },
            { materialName: PRESET_PERSONAL_INFO_EDUCATION_KEY, comName: '学历' },
            { materialName: PRESET_PERSONAL_INFO_COLLAGE_KEY, comName: '大学' },
            { materialName: PRESET_PERSONAL_INFO_MAJOR_KEY, comName: '专业' },
            { materialName: PRESET_PERSONAL_INFO_INDUSTRY_KEY, comName: '行业' },
            { materialName: PRESET_PERSONAL_INFO_CAREER_KEY, comName: '职业' },
            { materialName: PRESET_PERSONAL_INFO_COMPANY_KEY, comName: '公司' },
            { materialName: PRESET_PERSONAL_INFO_POSITION_KEY, comName: '职位' }
        ]
    },
    {
        title: '联系方式',
        icon: Message,
        list: [
            { materialName: PRESET_CONTACT_PHONE_KEY, comName: '手机' },
            { materialName: PRESET_CONTACT_WECHAT_KEY, comName: '微信号' },
            { materialName: PRESET_CONTACT_QQ_KEY, comName: 'QQ号' },
            { materialName: PRESET_CONTACT_EMAIL_KEY, comName: '邮箱' },
            { materialName: PRESET_CONTACT_ADDRESS_KEY, comName: '地址' }
        ]
    }
]
