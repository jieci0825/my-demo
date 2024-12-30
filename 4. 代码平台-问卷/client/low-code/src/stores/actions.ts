import { type TextProps, type OptionProps, isStringStateArr } from '@/types'

// 设置文本状态
export function setTextState(textProps: TextProps, text: string) {
    textProps.state = text
}

// 新增选项
export function addOption() {
    let prevCount = 0
    return function (optionProps: OptionProps) {
        if (isStringStateArr(optionProps.state)) {
            prevCount = optionProps.state.length
            const content = `默认选项${prevCount + 1}`
            optionProps.state.push(content)
        }
    }
}

// 删除选项
export function removeOption(optionProps: OptionProps, index: number) {
    if (optionProps.state.length <= 2) {
        return false
    }
    if (isStringStateArr(optionProps.state)) {
        optionProps.state.splice(index, 1)
    }
    return true
}

// 更新当前选项状态
export function updateCurrentState(optionProps: OptionProps, index: number) {
    optionProps.currentStage = index
}
