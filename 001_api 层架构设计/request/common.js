import service from './server'

export function requestGet(url, params = {}, options = {}) {
	return service.request({ method: 'get', url, params, ...options })
}

export function requestGetPath(url, pathParasm, options = {}) {
	return service.request({ method: 'get', url: `${url}/${pathParasm}`, ...options })
}

export function requestPost(url, data = {}, options = {}) {
	return service.request({ method: 'post', url, data, ...options })
}
