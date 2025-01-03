import {
    type TextProps,
    type OptionProps,
    type PicLink,
    isStringStateArr,
    isPicTitleDescStateArr,
    isPicTitleDescStateObject,
    type BaseEditCompStatus,
    type TypeEditCompStatus
} from '@/types'
import type { KeysOfT } from '@/utils'

// 设置文本状态
export function setTextState(textProps: TextProps, text: string) {
    textProps.state = text
}

// 新增选项
export function addOption() {
    let prevCount = 0
    return function (optionProps: OptionProps, payload?: string | number | boolean | PicLink) {
        if (payload === undefined && isStringStateArr(optionProps.state)) {
            prevCount = optionProps.state.length
            const content = `默认选项${prevCount + 1}`
            optionProps.state.push(content)
        } else if (payload && isPicTitleDescStateArr(optionProps.state)) {
            if (isPicTitleDescStateObject(payload)) {
                optionProps.state.push(payload)
            }
        }
    }
}

// 删除选项
export function removeOption(optionProps: OptionProps, index: number) {
    if (optionProps.state.length <= 2) {
        return false
    }
    optionProps.state.splice(index, 1)
    return true
}

// 更新当前选项状态
export function updateCurrentState(optionProps: OptionProps, index: number) {
    optionProps.currentStage = index
}

// 切换备注说明类型
export function toggleType(editCompConf: TypeEditCompStatus, index: number) {
    const remarkProps: OptionProps = editCompConf.type
    updateCurrentState(remarkProps, index)

    // 切换显示隐藏字段
    const totalFields: KeysOfT<BaseEditCompStatus>[] = [
        'title',
        'titleBold',
        'titleColor',
        'titleSlant',
        'titleSize',
        'desc',
        'descBold',
        'descColor',
        'descSlant',
        'descSize'
    ]

    // 将字段取反进行切换
    for (const key of totalFields) {
        editCompConf[key].isShow = !editCompConf[key].isShow
    }
}

export function setUse(optionProps: OptionProps, payload: boolean) {
    optionProps.isUse = payload
}

// 根据index设置图片选项
export function setPicLinkByIndex(optionProps: OptionProps, payload: PicLink) {
    if (isPicTitleDescStateArr(optionProps.state)) {
        optionProps.state[payload.idx].value = payload.link
    }
}
