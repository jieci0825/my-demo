import singleSelectDefaultStatus from './single-select'
import multipleSelectDefaultStatus from './multiple-select'
import singlePicSelectDefaultStatus from './single-pic-select'
import multiplePicSelectDefaultStatus from './multiple-pic-select'
import textNodeDefaultStatus from './text-node'
import textInputDefaultStatus from './text-input'
import rateScoreDefaultStatus from './rate-score'
import dateTimeDefaultStatus from './date-time'
import {
    SINGLE_PIC_SELECT_KEY,
    SINGLE_SELECT_KEY,
    TEXT_NODE_KEY,
    PRESET_PERSONAL_INFO_GENDER_KEY,
    MULTIPLE_SELECT_KEY,
    MULTIPLE_PIC_SELECT_KEY,
    OPTION_SELECT_KEY,
    TEXT_INPUT_KEY,
    RATE_SCORE_KEY,
    DATE_TIME_KEY,
    PRESET_PERSONAL_INFO_NAME_KEY,
    PRESET_PERSONAL_INFO_ID_KEY,
    PRESET_PERSONAL_INFO_COLLAGE_KEY,
    PRESET_PERSONAL_INFO_MAJOR_KEY,
    PRESET_PERSONAL_INFO_INDUSTRY_KEY,
    PRESET_PERSONAL_INFO_COMPANY_KEY,
    PRESET_PERSONAL_INFO_POSITION_KEY,
    PRESET_PERSONAL_INFO_BIRTH_KEY,
    PRESET_PERSONAL_INFO_AGE_KEY,
    PRESET_PERSONAL_INFO_EDUCATION_KEY,
    PRESET_PERSONAL_INFO_CAREER_KEY,
    PRESET_CONTACT_PHONE_KEY,
    PRESET_CONTACT_EMAIL_KEY,
    PRESET_CONTACT_QQ_KEY,
    PRESET_CONTACT_WECHAT_KEY,
    PRESET_CONTACT_ADDRESS_KEY
} from '@/constants'

export const defaultStatusMap = {
    [OPTION_SELECT_KEY]: singleSelectDefaultStatus,
    [SINGLE_SELECT_KEY]: singleSelectDefaultStatus,
    [SINGLE_PIC_SELECT_KEY]: singlePicSelectDefaultStatus,
    [MULTIPLE_SELECT_KEY]: multipleSelectDefaultStatus,
    [MULTIPLE_PIC_SELECT_KEY]: multiplePicSelectDefaultStatus,
    [RATE_SCORE_KEY]: rateScoreDefaultStatus,
    [DATE_TIME_KEY]: dateTimeDefaultStatus,
    [TEXT_NODE_KEY]: textNodeDefaultStatus,
    [TEXT_INPUT_KEY]: textInputDefaultStatus,
    [PRESET_PERSONAL_INFO_BIRTH_KEY]: dateTimeDefaultStatus,
    [PRESET_PERSONAL_INFO_GENDER_KEY]: singleSelectDefaultStatus,
    [PRESET_PERSONAL_INFO_AGE_KEY]: singleSelectDefaultStatus,
    [PRESET_PERSONAL_INFO_EDUCATION_KEY]: singleSelectDefaultStatus,
    [PRESET_PERSONAL_INFO_CAREER_KEY]: singleSelectDefaultStatus,
    [PRESET_PERSONAL_INFO_NAME_KEY]: textInputDefaultStatus,
    [PRESET_PERSONAL_INFO_ID_KEY]: textInputDefaultStatus,
    [PRESET_PERSONAL_INFO_COLLAGE_KEY]: textInputDefaultStatus,
    [PRESET_PERSONAL_INFO_MAJOR_KEY]: textInputDefaultStatus,
    [PRESET_PERSONAL_INFO_INDUSTRY_KEY]: textInputDefaultStatus,
    [PRESET_PERSONAL_INFO_COMPANY_KEY]: textInputDefaultStatus,
    [PRESET_PERSONAL_INFO_POSITION_KEY]: textInputDefaultStatus,
    [PRESET_CONTACT_PHONE_KEY]: textInputDefaultStatus,
    [PRESET_CONTACT_EMAIL_KEY]: textInputDefaultStatus,
    [PRESET_CONTACT_QQ_KEY]: textInputDefaultStatus,
    [PRESET_CONTACT_WECHAT_KEY]: textInputDefaultStatus,
    [PRESET_CONTACT_ADDRESS_KEY]: textInputDefaultStatus
}
