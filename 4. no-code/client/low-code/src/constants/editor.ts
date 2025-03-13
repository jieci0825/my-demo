export enum EditorMode {
    EDIT = 'edit',
    CREATE = 'create'
}

export const EditorModeTextMap = {
    [EditorMode.EDIT]: '编辑问卷',
    [EditorMode.CREATE]: '创建问卷'
}

export const SINGLE_SELECT_KEY = 'single-select'
export const MULTIPLE_SELECT_KEY = 'multiple-select'
export const OPTION_SELECT_KEY = 'option-select'
export const SINGLE_PIC_SELECT_KEY = 'single-pic-select'
export const MULTIPLE_PIC_SELECT_KEY = 'multiple-pic-select'
export const TEXT_NODE_KEY = 'text-node'
export const TEXT_INPUT_KEY = 'text-input'
export const RATE_SCORE_KEY = 'rate-score'
export const DATE_TIME_KEY = 'date-time'

// 个人信息预设
//  - 文本
export const PRESET_PERSONAL_INFO_NAME_KEY = 'preset-personal-info-name'
export const PRESET_PERSONAL_INFO_ID_KEY = 'preset-personal-info-id'
export const PRESET_PERSONAL_INFO_COLLAGE_KEY = 'preset-personal-info-collage'
export const PRESET_PERSONAL_INFO_MAJOR_KEY = 'preset-personal-info-major'
export const PRESET_PERSONAL_INFO_INDUSTRY_KEY = 'preset-personal-info-industry'
export const PRESET_PERSONAL_INFO_COMPANY_KEY = 'preset-personal-info-company'
export const PRESET_PERSONAL_INFO_POSITION_KEY = 'preset-personal-info-position'
//  - 日期
export const PRESET_PERSONAL_INFO_BIRTH_KEY = 'preset-personal-birth-position'
//  - 单选
export const PRESET_PERSONAL_INFO_GENDER_KEY = 'preset-personal-info-gender'
export const PRESET_PERSONAL_INFO_AGE_KEY = 'preset-personal-age-position'
export const PRESET_PERSONAL_INFO_EDUCATION_KEY = 'preset-personal-education-position'
export const PRESET_PERSONAL_INFO_CAREER_KEY = 'preset-personal-career-position'

// 联系方式预设-文本
export const PRESET_CONTACT_PHONE_KEY = 'preset-contact-phone'
export const PRESET_CONTACT_EMAIL_KEY = 'preset-contact-email'
export const PRESET_CONTACT_QQ_KEY = 'preset-contact-qq'
export const PRESET_CONTACT_WECHAT_KEY = 'preset-contact-wechat'
export const PRESET_CONTACT_ADDRESS_KEY = 'preset-contact-address'

export const predefineColors = ['#ff4500', '#ff8c00', '#ffd700', '#90ee90', '#00ced1', '#1e90ff', '#c71585']
