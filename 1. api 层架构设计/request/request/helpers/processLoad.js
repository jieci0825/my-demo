/**
 * @typedef {Object} LoadOptions
 * @property {string} loadText 加载文本
 * @property {string} color 颜色
 * @property {HTMLElement|string} target 传入的元素或选择器
 */
/** @type {LoadOptions} */
export const LoadOptions = {}

/**
 * @typedef {Object} LoadInstance
 * @property {boolean} isLoading 是否正在加载
 * @property {string} loadText 加载文本
 * @property {HTMLElement} loadEl 加载元素
 * @property {HTMLElement} container 加载容器
 * @property {Function} open 打开加载
 * @property {Function} close 关闭加载
 */
/** @type {LoadInstance} */
export const LoadInstance = {}

let isStyle = false

/**
 * 处理load配置选项
 * @param {LoadOptions} loadOptions load配置选项
 * @returns {LoadInstance} load实例
 */
export function processLoad(loadOptions) {
	if (!isNeedLoad(loadOptions)) return null

	// 加载 loading 所需要的样式
	if (!isStyle) {
		loadStyle()
		isStyle = true
	}

	loadOptions = normalizeLoad(loadOptions)

	const container = getContainer(loadOptions.target)

	// 不存在则创建一个新的loading实例
	const loadInstance = createLoadInstance(loadOptions, container)

	return loadInstance
}

/**
 * 是否需要loading
 * @description 如果loadOptions为空或者false，则不需要loading
 */
export function isNeedLoad(loadOptions) {
	return !!loadOptions
}

/**
 * 创建loading实例
 * @param {LoadOptions} loadOptions loading配置
 * @param {HTMLElement} container 加载容器
 * @returns {LoadInstance} load实例
 */
export function createLoadInstance(loadOptions, container) {
	const loadInstance = {
		isLoading: false,
		loadText: loadOptions.loadText,
		container,
		loadEl: createLoadEl(loadOptions),
		changeIsLoading(isLoading) {
			this.isLoading = isLoading
		}
	}

	// 开启loading
	function open() {
		this.changeIsLoading(true)
		// 将 loadEl 加入到 container 中
		this.container && this.container.appendChild(this.loadEl)
	}

	// 关闭loading
	function close() {
		this.changeIsLoading(false)
		// 当前 loadEl 是否存在于容器中，如果存在则移除
		if (this.loadEl && this.container.contains(this.loadEl)) {
			// 将 loadEl 从 container 中移除
			this.container.removeChild(this.loadEl)
		}
	}

	loadInstance.open = open.bind(loadInstance)
	loadInstance.close = close.bind(loadInstance)

	return loadInstance
}

/**
 * 创建load元素
 */
function createLoadEl(loadOptions) {
	const loadElContainer = document.createElement('div')
	loadElContainer.style.position = 'fixed'
	loadElContainer.style.inset = '0'
	loadElContainer.style.zIndex = '9000'
	loadElContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.6)'

	const loadWrap = document.createElement('div')
	loadWrap.style.width = '100%'
	loadWrap.style.height = '100%'
	loadWrap.style.display = 'flex'
	loadWrap.style.flexDirection = 'column'
	loadWrap.style.alignItems = 'center'
	loadWrap.style.justifyContent = 'center'
	loadElContainer.appendChild(loadWrap)

	const spinner = document.createElement('div')
	spinner.style.border = `8px solid rgba(0, 0, 0, 0.1)`
	spinner.style.borderLeftColor = loadOptions.color
	spinner.style.borderRadius = '50%'
	spinner.style.width = '50px'
	spinner.style.height = '50px'
	spinner.style.animation = 'load-spin 1s linear infinite'
	loadWrap.appendChild(spinner)

	const text = document.createElement('div')
	text.style.marginTop = '10px'
	text.style.color = loadOptions.color
	text.style.fontSize = '16px'
	text.textContent = loadOptions.loadText
	loadWrap.appendChild(text)

	return loadElContainer
}

/**
 * 加载样式
 * @param {LoadOptions} loadOptions
 */
function loadStyle(loadOptions) {
	// 创建并设置 CSS 样式
	const style = document.createElement('style')
	style.id = 'load-style'
	style.textContent = `
		@keyframes load-spin {
			to {
				transform: rotate(360deg);
			}
		}
  `
	document.head.appendChild(style)
}

/**
 * 获取容器
 * @param {HTMLElement|string} target 目标元素或选择器
 * @returns {HTMLElement} 容器DOM
 */
export function getContainer(target) {
	if (typeof target === 'string') {
		return document.querySelector(target)
	}
	return target
}

/**
 * load 参数归一化
 * @param {LoadOptions|boolean} loadOptions
 * @returns {LoadOptions} load配置
 */
export function normalizeLoad(loadOptions) {
	const defaultOptions = {
		loadText: 'loading...',
		color: '#1e90ff',
		target: document.body
	}

	if (typeof LoadOptions === 'boolean') {
		// 布尔值则启用默认loading配置
		return defaultOptions
	}

	return Object.assign({}, defaultOptions, loadOptions)
}
