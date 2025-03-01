import { reqLogin, reqRegister, reqVerifyToken } from './api.js'
import { errorMessageMap } from './config.js'
import { loginBtn, getLoginForm, registerBtn, verifyTokenBtn, getRegisterForm } from './init.js'
import { encryptData } from './utils.js'

loginBtn.addEventListener('click', async e => {
    e.preventDefault()

    const { account, password } = getLoginForm()

    const data = {
        account: encryptData(account),
        password: encryptData(password)
    }

    const resp = await reqLogin(data)
    const code = resp.data.errorCode
    if (code === 0) {
        const token = resp.data.data.token
        localStorage.setItem('token', token)
        alert(resp.data.msg)
    } else {
        alert(errorMessageMap[code])
    }
})

registerBtn.addEventListener('click', async e => {
    e.preventDefault()

    const { account, password } = getRegisterForm()

    const data = {
        account: encryptData(account),
        password: encryptData(password)
    }

    const resp = await reqRegister(data)

    const code = resp.data.errorCode
    if (code === 0) {
        alert(resp.data.msg)
    } else {
        alert(errorMessageMap[code])
    }
})

verifyTokenBtn.addEventListener('click', async e => {
    e.preventDefault()

    const resp = await reqVerifyToken()
    alert(resp.data.msg)
})
