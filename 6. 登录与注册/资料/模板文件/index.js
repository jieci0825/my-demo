// 获取dom
const loginBtn = document.querySelector('.login-btn')
const loginAccount = document.querySelector('#login-account')
const loginPassword = document.querySelector('#login-password')
const registerBtn = document.querySelector('.register-btn')
const registerAccount = document.querySelector('#register-account')
const registerPassword = document.querySelector('#register-password')

// 事件绑定
loginBtn.addEventListener('click', e => {
    e.preventDefault()
})
registerBtn.addEventListener('click', e => {
    e.preventDefault()
})
