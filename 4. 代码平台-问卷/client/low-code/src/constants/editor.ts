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

// 预设
export const PRESET_PERSONAL_INFO_NAME_KEY = 'preset-personal-info-name'
export const PRESET_PERSONAL_INFO_GENDER_KEY = 'preset-personal-info-gender'

export const predefineColors = ['#ff4500', '#ff8c00', '#ffd700', '#90ee90', '#00ced1', '#1e90ff', '#c71585']
