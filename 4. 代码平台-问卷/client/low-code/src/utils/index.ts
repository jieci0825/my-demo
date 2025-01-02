import { genderInitStatus, multiplePicSelectStatus } from '@/configs/default-status/init-status'
import { MULTIPLE_PIC_SELECT_KEY, PRESET_PERSONAL_INFO_GENDER_KEY } from '@/constants'
import { isOptionEditCompStatusObject, type BaseBusinessComp, type TextProps } from '@/types'
import type { MaterialKeys } from '@/types/materials'

export function getTextEditCompStatus(props: TextProps) {
    return props.state
}

export const isString = (value: any): value is string => typeof value === 'string'
export const isNumber = (value: any): value is number => typeof value === 'number'
export const isBoolean = (value: any): value is boolean => typeof value === 'boolean'
export const isFunction = (value: any): value is Function => typeof value === 'function'
export const isObject = (value: any): value is object => typeof value === 'object' && value !== null
export const isArray = Array.isArray
export const extend = Object.assign

export type KeysOfT<T> = keyof T
// 确定一个值是一个对象，且具备指定的属性
export const isObjectWithKeys = <T>(value: any, keys: KeysOfT<T>[]): value is T => {
    if (!isObject(value)) return false
    for (const key of keys) {
        if (!(key in value)) return false
    }
    return true
}

// 更新初始化状态，在状态添加之前
export const updateInitStatusBeforeAdd = (comStatus: BaseBusinessComp, newMaterialName: MaterialKeys) => {
    switch (newMaterialName) {
        case PRESET_PERSONAL_INFO_GENDER_KEY:
            comStatus.name = newMaterialName
            if (isOptionEditCompStatusObject(comStatus.editCompConfig)) {
                const { title, desc, options, currentStage } = genderInitStatus()
                comStatus.editCompConfig.title.state = title
                comStatus.editCompConfig.desc.state = desc
                comStatus.editCompConfig.options.state = options
                comStatus.editCompConfig.options.currentStage = currentStage
            }
            break
        case MULTIPLE_PIC_SELECT_KEY:
            comStatus.name = newMaterialName
            if (isOptionEditCompStatusObject(comStatus.editCompConfig)) {
                const { title, desc } = multiplePicSelectStatus()
                comStatus.editCompConfig.title.state = title
                comStatus.editCompConfig.desc.state = desc
            }
            break
    }

    return comStatus
}
