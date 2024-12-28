// 单选题的 JSON Schema 配置

import { SingleSelect } from '@/components/survey-comps/materials/select-comps'
import {
    TitleEditor,
    BoldEditor,
    ColorEditor,
    SizeEditor,
    SlantEditor,
    PositionEditor,
    OptionEditor,
    DescEditor
} from '@/components/survey-comps/edit-items'
import { markRaw } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { SINGLE_SELECT_KEY } from '@/constants'

export default function () {
    return {
        type: markRaw(SingleSelect),
        name: SINGLE_SELECT_KEY,
        id: uuidv4(),
        // 组件状态：组件每一个能够修改的状态都需要对应一个编辑组件
        editCompConfig: {
            title: {
                id: uuidv4(),
                state: '单选题默认标题',
                name: 'title-editor',
                isShow: true,
                editComp: markRaw(TitleEditor)
            },
            desc: {
                id: uuidv4(),
                state: '单选题默认描述',
                name: 'desc-editor',
                isShow: true,
                editComp: markRaw(DescEditor)
            },
            options: {
                id: uuidv4(),
                state: ['默认选项1', '默认选项2'],
                currentStage: 0,
                name: 'option-editor',
                isShow: true,
                editComp: markRaw(OptionEditor)
            },
            position: {
                id: uuidv4(),
                state: ['左对齐', '居中对齐', '右对齐'],
                currentStage: 0,
                name: 'position-editor',
                isShow: true,
                editComp: markRaw(PositionEditor)
            },
            titleColor: {
                id: uuidv4(),
                state: '#000',
                name: 'color-editor',
                isShow: true,
                editComp: markRaw(ColorEditor)
            },
            descColor: {
                id: uuidv4(),
                state: '#909399',
                name: 'color-editor',
                isShow: true,
                editComp: markRaw(ColorEditor)
            },
            titleSize: {
                id: uuidv4(),
                state: [22, 20, 18],
                currentStage: 0,
                name: 'size-editor',
                isShow: true,
                editComp: markRaw(SizeEditor)
            },
            descSize: {
                id: uuidv4(),
                state: [12, 14, 16],
                currentStage: 0,
                name: 'size-editor',
                isShow: true,
                editComp: markRaw(SizeEditor)
            },
            titleBold: {
                id: uuidv4(),
                state: ['正常', '加粗'],
                currentStage: 0,
                name: 'bold-editor',
                isShow: true,
                editComp: markRaw(BoldEditor)
            },
            descBold: {
                id: uuidv4(),
                state: ['正常', '加粗'],
                currentStage: 0,
                name: 'bold-editor',
                isShow: true,
                editComp: markRaw(BoldEditor)
            },
            titleSlant: {
                id: uuidv4(),
                state: ['正常', '倾斜'],
                currentStage: 0,
                name: 'slant-editor',
                isShow: true,
                editComp: markRaw(SlantEditor)
            },
            descSlant: {
                id: uuidv4(),
                state: ['正常', '倾斜'],
                currentStage: 0,
                name: 'slant-editor',
                isShow: true,
                editComp: markRaw(SlantEditor)
            }
        }
    }
}
