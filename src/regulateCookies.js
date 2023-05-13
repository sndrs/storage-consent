const _cookie = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie')

export const regulateCookies = function ({ allowedKeys = [] } = {}) {
	Object.defineProperty(document, 'cookie', {
		set(cookie) {
			const [key] = cookie.split('=')

			if (!allowedKeys.includes(key.trim())) {
				throw new Error(`Blocked saving cookie called '${key}'`)
			}

			_cookie.set.call(document, cookie)
		},

		get: _cookie.get,
	})
}

export const restoreCookies = function () {
	Object.defineProperty(document, 'cookie', _cookie)
}
