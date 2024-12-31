import { SinglePicSelect } from '@/components/survey-comps/materials/select-comps'
import {
    TitleEditor,
    BoldEditor,
    ColorEditor,
    SizeEditor,
    SlantEditor,
    PositionEditor,
    PicOptionsEditor,
    DescEditor
} from '@/components/survey-comps/edit-items'
import { predefineColors, SINGLE_PIC_SELECT_KEY } from '@/constants'
import { markRaw } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import type { BaseBusinessComp, OptionEditCompStatus } from '@/types'

export default function () {
    const status: BaseBusinessComp<OptionEditCompStatus> = {
        id: uuidv4(),
        type: markRaw(SinglePicSelect),
        name: SINGLE_PIC_SELECT_KEY,
        editCompConfig: {
            title: {
                id: uuidv4(),
                state: '默认图片单选题标题内容',
                name: 'title-editor',
                isShow: true,
                editComp: markRaw(TitleEditor)
            },
            desc: {
                id: uuidv4(),
                state: '默认图片单选题描述内容',
                name: 'desc-editor',
                isShow: true,
                editComp: markRaw(DescEditor)
            },
            options: {
                id: uuidv4(),
                state: [
                    {
                        picTitle: '图片标题1',
                        picDesc: '图片描述1',
                        value: ''
                    },
                    {
                        picTitle: '图片标题2',
                        picDesc: '图片描述2',
                        value: ''
                    }
                ],
                currentStage: 0,
                name: 'option-editor',
                isShow: true,
                editComp: markRaw(PicOptionsEditor)
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
