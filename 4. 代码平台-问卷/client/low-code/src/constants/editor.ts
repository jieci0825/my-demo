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
export const SINGLE_PIC_KEY = 'single-pic'
export const MULTIPLE_PIC_KEY = 'multiple-pic'
