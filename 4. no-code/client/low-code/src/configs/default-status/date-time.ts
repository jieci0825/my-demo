// JSON Schema 配置

import { DateTime } from '@/components/survey-comps/materials/advanced-comps'
import {
    TitleEditor,
    BoldEditor,
    ColorEditor,
    SizeEditor,
    SlantEditor,
    PositionEditor,
    DescEditor,
    DateTimeEditor
} from '@/components/survey-comps/edit-items'
import { markRaw } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { predefineColors, DATE_TIME_KEY } from '@/constants'
import type { BaseBusinessComp, TypeEditCompStatus } from '@/types'

export default function () {
    const status: BaseBusinessComp<TypeEditCompStatus> = {
        type: markRaw(DateTime),
        name: DATE_TIME_KEY,
        id: uuidv4(),
        // 组件状态：组件每一个能够修改的状态都需要对应一个编辑组件
        editCompConfig: {
            title: {
                id: uuidv4(),
                state: '默认日期/时间题目标题',
                name: 'title-editor',
                isShow: true,
                editComp: markRaw(TitleEditor)
            },
            desc: {
                id: uuidv4(),
                state: '默认日期/时间题目描述',
                name: 'desc-editor',
                isShow: true,
                editComp: markRaw(DescEditor)
            },
            type: {
                id: uuidv4(),
                title: '日期类型',
                currentStage: 3,
                state: [
                    { value: 'week', state: '周' },
                    { value: 'year', state: '年' },
                    { value: 'month', state: '月' },
                    { value: 'date', state: '日期' }
                ],
                isShow: true,
                name: 'date-time-editor',
                editComp: markRaw(DateTimeEditor),
                isTooggle: false
            },
            position: {
                id: uuidv4(),
                title: '对齐方式',
                state: ['左', '居中', '右'],
                icons: ['icon-left-align', 'icon-center-align', 'icon-right-align'],
                currentStage: 0,
                name: 'position-editor',
                isShow: true,
                editComp: markRaw(PositionEditor)
            },
            titleSize: {
                id: uuidv4(),
                title: '标题尺寸',
                state: ['18', '20', '22'],
                icons: ['icon-font-size', 'icon-font-size', 'icon-font-size'],
                currentStage: 2,
                name: 'size-editor',
                isShow: true,
                editComp: markRaw(SizeEditor)
            },
            descSize: {
                id: uuidv4(),
                title: '描述尺寸',
                state: ['12', '14', '16'],
                icons: ['icon-font-size', 'icon-font-size', 'icon-font-size'],
                currentStage: 2,
                name: 'size-editor',
                isShow: true,
                editComp: markRaw(SizeEditor)
            },
            titleBold: {
                id: uuidv4(),
                title: '标题加粗',
                state: ['加粗', '正常'],
                icons: ['icon-font-bold', 'icon-font-bold'],
                currentStage: 1,
                name: 'bold-editor',
                isShow: true,
                editComp: markRaw(BoldEditor)
            },
            descBold: {
                id: uuidv4(),
                title: '描述加粗',
                state: ['加粗', '正常'],
                currentStage: 1,
                icons: ['icon-font-bold', 'icon-font-bold'],
                name: 'bold-editor',
                isShow: true,
                editComp: markRaw(BoldEditor)
            },
            titleSlant: {
                id: uuidv4(),
                title: '标题倾斜',
                state: ['倾斜', '正常'],
                icons: ['icon-font-slant', 'icon-font-slant'],
                currentStage: 1,
                name: 'slant-editor',
                isShow: true,
                editComp: markRaw(SlantEditor)
            },
            descSlant: {
                id: uuidv4(),
                title: '描述倾斜',
                state: ['倾斜', '正常'],
                icons: ['icon-font-slant', 'icon-font-slant'],
                currentStage: 1,
                name: 'slant-editor',
                isShow: true,
                editComp: markRaw(SlantEditor)
            },
            titleColor: {
                id: uuidv4(),
                title: '标题颜色',
                state: '#303133',
                predefineColors: predefineColors.slice(),
                name: 'color-editor',
                isShow: true,
                editComp: markRaw(ColorEditor)
            },
            descColor: {
                id: uuidv4(),
                title: '描述颜色',
                state: '#a8abb2',
                predefineColors: predefineColors.slice(),
                name: 'color-editor',
                isShow: true,
                editComp: markRaw(ColorEditor)
            }
        }
    }

    return status
}
