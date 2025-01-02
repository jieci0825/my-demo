import TextNode from '@/components/survey-comps/materials/node-comps/text-node.vue'
import {
    TitleEditor,
    BoldEditor,
    ColorEditor,
    SizeEditor,
    SlantEditor,
    PositionEditor,
    DescEditor,
    TypeEditor
} from '@/components/survey-comps/edit-items'
import { markRaw } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { predefineColors, SINGLE_SELECT_KEY } from '@/constants'
import type { BaseBusinessComp, TypeEditCompStatus } from '@/types'

export default function () {
    const status: BaseBusinessComp<TypeEditCompStatus> = {
        type: markRaw(TextNode),
        name: SINGLE_SELECT_KEY,
        id: uuidv4(),
        // 组件状态：组件每一个能够修改的状态都需要对应一个编辑组件
        editCompConfig: {
            type: {
                id: uuidv4(),
                title: '说明类型',
                state: ['标题', '段落'],
                icons: ['icon-title', 'icon-paragraph'],
                currentStage: 1,
                name: 'type-editor',
                isTooggle: true,
                isShow: true,
                editComp: markRaw(TypeEditor)
            },
            title: {
                id: uuidv4(),
                state: '备注说明标题',
                name: 'title-editor',
                isShow: false,
                editComp: markRaw(TitleEditor)
            },
            desc: {
                id: uuidv4(),
                state: '备注说明描述',
                name: 'desc-editor',
                isShow: true,
                editComp: markRaw(DescEditor)
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
                isShow: false,
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
                isShow: false,
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
                isShow: false,
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
                isShow: false,
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
