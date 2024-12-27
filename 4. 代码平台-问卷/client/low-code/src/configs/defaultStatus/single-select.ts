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

export default function () {
    return {
        type: markRaw(SingleSelect),
        name: 'single-select',
        id: uuidv4(),
        // 组件状态：组件每一个能够修改的状态都需要对应一个编辑组件
        status: {
            title: {
                id: uuidv4(),
                status: '单选题默认标题',
                name: 'title-editor',
                isShow: true,
                editComp: markRaw(TitleEditor)
            },
            desc: {
                id: uuidv4(),
                status: '单选题默认描述',
                name: 'desc-editor',
                isShow: true,
                editComp: markRaw(DescEditor)
            },
            options: {
                id: uuidv4(),
                status: ['默认选项1', '默认选项2'],
                currentStatus: 0,
                name: 'option-editor',
                isShow: true,
                editComp: markRaw(OptionEditor)
            },
            position: {
                id: uuidv4(),
                status: ['左对齐', '居中对齐', '右对齐'],
                currentStatus: 0,
                name: 'position-editor',
                isShow: true,
                editComp: markRaw(PositionEditor)
            },
            titleColor: {
                id: uuidv4(),
                status: '#000',
                name: 'color-editor',
                isShow: true,
                editComp: markRaw(ColorEditor)
            },
            descColor: {
                id: uuidv4(),
                status: '#909399',
                name: 'color-editor',
                isShow: true,
                editComp: markRaw(ColorEditor)
            },
            titleSize: {
                id: uuidv4(),
                status: [22, 20, 18],
                currentStatus: 0,
                name: 'size-editor',
                isShow: true,
                editComp: markRaw(SizeEditor)
            },
            descSize: {
                id: uuidv4(),
                status: [12, 14, 16],
                currentStatus: 0,
                name: 'size-editor',
                isShow: true,
                editComp: markRaw(SizeEditor)
            },
            titleBold: {
                id: uuidv4(),
                status: ['正常', '加粗'],
                currentStatus: 0,
                name: 'bold-editor',
                isShow: true,
                editComp: markRaw(BoldEditor)
            },
            descBold: {
                id: uuidv4(),
                status: ['正常', '加粗'],
                currentStatus: 0,
                name: 'bold-editor',
                isShow: true,
                editComp: markRaw(BoldEditor)
            },
            titleSlant: {
                id: uuidv4(),
                status: ['正常', '倾斜'],
                currentStatus: 0,
                name: 'slant-editor',
                isShow: true,
                editComp: markRaw(SlantEditor)
            },
            descSlant: {
                id: uuidv4(),
                status: ['正常', '倾斜'],
                currentStatus: 0,
                name: 'slant-editor',
                isShow: true,
                editComp: markRaw(SlantEditor)
            }
        }
    }
}
