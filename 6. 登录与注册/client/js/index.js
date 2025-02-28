import { reqLogin, reqRegister, reqVerifyToken } from './api.js'
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

    const token = resp.data.data.token

    // 存储 token
    localStorage.setItem('token', token)

    alert(resp.data.msg)
})

registerBtn.addEventListener('click', async e => {
    e.preventDefault()

    const { account, password } = getRegisterForm()

    const data = {
        account: encryptData(account),
        password: encryptData(password)
    }

    const resp = await reqRegister(data)
    alert(resp.data.msg)
})

verifyTokenBtn.addEventListener('click', async e => {
    e.preventDefault()

    const resp = await reqVerifyToken()
    console.log(resp.data)
    alert(resp.data.msg)
})
