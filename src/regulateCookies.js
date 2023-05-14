const _cookie = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie')

export const regulateCookies = function ({
	allowedKeys = [],
	debug = false,
} = {}) {
	const now = performance.now()
	Object.defineProperty(document, 'cookie', {
		configurable: true,
		set(cookie) {
			const [key] = cookie.split('=')

			if (!allowedKeys.includes(key.trim())) {
				throw new Error(`Blocked saving cookie called '${key}'`)
			}

			_cookie.set.call(document, cookie)
			if (debug) {
				console.debug(`Saved cookie called '${key}'`)
			}
		},

		get: _cookie.get,
	})

	if (debug) {
		console.debug(`Regulated cookies in ${performance.now() - now}ms`)
	}
}

export const restoreCookies = function ({ debug = false } = {}) {
	const now = performance.now()

	Object.defineProperty(document, 'cookie', _cookie)

	if (debug) {
		console.debug(`Restored cookies in ${performance.now() - now}ms`)
	}
}