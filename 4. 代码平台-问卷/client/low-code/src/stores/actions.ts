import { type TextProps, type OptionProps, isStringStateArr } from '@/types'
import { ElMessage } from 'element-plus'

// 设置文本状态
export function setTextState(textProps: TextProps, text: string) {
    textProps.state = text
}

// 新增选项
export function addOption() {
    let prevCount = 0
    return function (textProps: OptionProps) {
        if (isStringStateArr(textProps.state)) {
            prevCount = textProps.state.length
            const content = `默认选项${prevCount + 1}`
            textProps.state.push(content)
        }
    }
}

// 删除选项
export function removeOption(textProps: OptionProps, index: number) {
    if (textProps.state.length <= 2) {
        return false
    }
    if (isStringStateArr(textProps.state)) {
        textProps.state.splice(index, 1)
    }
    return true
}
