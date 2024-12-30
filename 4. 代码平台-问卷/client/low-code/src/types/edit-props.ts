import { isString } from '@/utils'
import type { VueCompType } from './common'
import type { MaterialKeys } from './materials'

// 一个编辑组件所拥有的基础属性，即一个编辑组件 json schema 中必须包含的属性
export interface BaseEditProps {
    id: string
    isShow: boolean
    name: string
    editComp: VueCompType
}

export type StringStateArr = string[]

export type ValueState = { value: string; status: string }
export type ValueStateArr = ValueState[]

export type PicTitleDescState = { picTitle: string; picDesc: string; status: string }
export type PicTitleDescStateArr = PicTitleDescState[]

// 文本编辑组件在基础的编辑组件上添加了status属性，且为string类型
//  - 即文本编辑组件的 json schema 拥有string类型的status属性
export interface TextProps extends BaseEditProps {
    state: string
}

export type OptionsStateArr = StringStateArr | ValueStateArr | PicTitleDescStateArr
// 选项编辑组件在基础的编辑组件上添加了status、currentStatus属性，且类型更加多样化
export interface OptionProps extends BaseEditProps {
    state: OptionsStateArr
    icons?: string[]
    currentStage: number
}

export interface StringArrOptionProps extends BaseEditProps {
    state: StringStateArr
    currentStage: number
}

// 对应一个业务组件所拥有那些基础的编辑组件配置
// - 即单选题，多选题、图文选择题等等都具备这些基础编辑组件
export interface BaseEditCompStatus {
    title: TextProps
    desc: TextProps
    position: OptionProps
    titleSize: StringArrOptionProps
    descSize: StringArrOptionProps
    titleBold: StringArrOptionProps
    descBold: StringArrOptionProps
    titleSlant: StringArrOptionProps
    descSlant: StringArrOptionProps
    titleColor: TextProps
    descColor: TextProps
}

// 选项编辑组件在基础的编辑组件上添加了option属性
export interface OptionEditCompStatus extends BaseEditCompStatus {
    options: OptionProps
}

// 业务组件
export interface BaseBusinessComp<T = BaseEditCompStatus> {
    id: string
    name: MaterialKeys
    type: VueCompType
    editCompConfig: T
}

export function isStringStateArr(state: OptionsStateArr): state is StringStateArr {
    return Array.isArray(state) && state.every(item => isString(item))
}
