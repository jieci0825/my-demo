import { userApi } from '@api'

function getEle(selector) {
	return document.querySelector(selector)
}

const btnWrapper = getEle('.btns')
const content = getEle('.content>pre')

const userBtns = [
	{ id: 1, text: '获取超级管理员', request: getUserInfo },
	{ id: 0, text: '获取普通用户信息', request: getUserInfo },
	{ id: 10086, text: '获取不存在的用户信息', request: getUserInfo },
	{ id: 100, text: '获取用户列表', request: getUserList }
]

function renderBtns() {
	const fragment = document.createDocumentFragment()
	userBtns.forEach(item => {
		const btn = document.createElement('button')
		btn.addEventListener('click', item.request)
		btn.textContent = item.text
		btn.dataset.id = item.id
		fragment.appendChild(btn)
	})
	btnWrapper.appendChild(fragment)
}
renderBtns()

async function getUserInfo(e) {
	const id = e.target.dataset.id
	const resp = await userApi.reqGetUserInfo(id)
	showContent(resp)
}

async function getUserList() {
	const resp = await userApi.reqGetUserList()
	showContent(resp)
}

function showContent(value) {
	content.textContent = JSON.stringify(value, null, 2)
}
