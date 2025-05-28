import {
    SingleSelect,
    MultipleSelect,
    OptionSelect,
    SinglePicSelect,
    MultiplePicSelect
} from '@/components/survey-comps/materials/select-comps'
import { TextInput } from '@/components/survey-comps/materials/input-comps'
import { TextNode } from '@/components/survey-comps/materials/node-comps'
import { RateScore, DateTime } from '@/components/survey-comps/materials/advanced-comps'
import {
    DATE_TIME_KEY,
    MULTIPLE_PIC_SELECT_KEY,
    MULTIPLE_SELECT_KEY,
    OPTION_SELECT_KEY,
    PRESET_CONTACT_ADDRESS_KEY,
    PRESET_CONTACT_EMAIL_KEY,
    PRESET_CONTACT_PHONE_KEY,
    PRESET_CONTACT_QQ_KEY,
    PRESET_CONTACT_WECHAT_KEY,
    PRESET_PERSONAL_INFO_AGE_KEY,
    PRESET_PERSONAL_INFO_BIRTH_KEY,
    PRESET_PERSONAL_INFO_CAREER_KEY,
    PRESET_PERSONAL_INFO_COLLAGE_KEY,
    PRESET_PERSONAL_INFO_COMPANY_KEY,
    PRESET_PERSONAL_INFO_EDUCATION_KEY,
    PRESET_PERSONAL_INFO_GENDER_KEY,
    PRESET_PERSONAL_INFO_ID_KEY,
    PRESET_PERSONAL_INFO_INDUSTRY_KEY,
    PRESET_PERSONAL_INFO_MAJOR_KEY,
    PRESET_PERSONAL_INFO_NAME_KEY,
    PRESET_PERSONAL_INFO_POSITION_KEY,
    RATE_SCORE_KEY,
    SINGLE_PIC_SELECT_KEY,
    SINGLE_SELECT_KEY,
    TEXT_INPUT_KEY,
    TEXT_NODE_KEY
} from '@/constants'
import {
    TitleEditor,
    BoldEditor,
    ColorEditor,
    SizeEditor,
    SlantEditor,
    PositionEditor,
    OptionEditor,
    DescEditor,
    DateTimeEditor,
    RateScoreEditor,
    TypeEditor,
    PicOptionsEditor
} from '@/components/survey-comps/edit-items'
import { markRaw } from 'vue'
import type { ComponentMap } from '@/types'

export const componentMap: ComponentMap = {
    // 业务组件
    [MULTIPLE_SELECT_KEY]: markRaw(MultipleSelect),
    [SINGLE_SELECT_KEY]: markRaw(SingleSelect),
    [OPTION_SELECT_KEY]: markRaw(OptionSelect),
    [SINGLE_PIC_SELECT_KEY]: markRaw(SinglePicSelect),
    [MULTIPLE_PIC_SELECT_KEY]: markRaw(MultiplePicSelect),
    [TEXT_INPUT_KEY]: markRaw(TextInput),
    [TEXT_NODE_KEY]: markRaw(TextNode),
    [RATE_SCORE_KEY]: markRaw(RateScore),
    [DATE_TIME_KEY]: markRaw(DateTime),
    [PRESET_PERSONAL_INFO_NAME_KEY]: markRaw(TextInput),
    [PRESET_PERSONAL_INFO_ID_KEY]: markRaw(TextInput),
    [PRESET_PERSONAL_INFO_COLLAGE_KEY]: markRaw(TextInput),
    [PRESET_PERSONAL_INFO_MAJOR_KEY]: markRaw(TextInput),
    [PRESET_PERSONAL_INFO_INDUSTRY_KEY]: markRaw(TextInput),
    [PRESET_PERSONAL_INFO_COMPANY_KEY]: markRaw(TextInput),
    [PRESET_PERSONAL_INFO_POSITION_KEY]: markRaw(TextInput),
    [PRESET_CONTACT_PHONE_KEY]: markRaw(TextInput),
    [PRESET_CONTACT_EMAIL_KEY]: markRaw(TextInput),
    [PRESET_CONTACT_QQ_KEY]: markRaw(TextInput),
    [PRESET_CONTACT_WECHAT_KEY]: markRaw(TextInput),
    [PRESET_CONTACT_ADDRESS_KEY]: markRaw(TextInput),
    [PRESET_PERSONAL_INFO_BIRTH_KEY]: markRaw(DateTime),
    [PRESET_PERSONAL_INFO_GENDER_KEY]: markRaw(SingleSelect),
    [PRESET_PERSONAL_INFO_AGE_KEY]: markRaw(SingleSelect),
    [PRESET_PERSONAL_INFO_EDUCATION_KEY]: markRaw(SingleSelect),
    [PRESET_PERSONAL_INFO_CAREER_KEY]: markRaw(SingleSelect),
    // 编辑器组件
    //  - base
    'title-editor': markRaw(TitleEditor),
    'desc-editor': markRaw(DescEditor),
    'position-editor': markRaw(PositionEditor),
    'size-editor': markRaw(SizeEditor),
    'bold-editor': markRaw(BoldEditor),
    'color-editor': markRaw(ColorEditor),
    'slant-editor': markRaw(SlantEditor),
    //  - append
    'option-editor': markRaw(OptionEditor),
    'date-time-editor': markRaw(DateTimeEditor),
    'rate-score-editor': markRaw(RateScoreEditor),
    'type-editor': markRaw(TypeEditor),
    'pic-option-editor': markRaw(PicOptionsEditor)
}
