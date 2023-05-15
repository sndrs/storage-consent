const _cookie = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie')

export const regulateCookies = function ({
	allowedKeys = [],
	debug = false,
} = {}) {
	try {
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
					console.log(`Saved cookie called '${key}'`)
				}
			},

			get: _cookie.get,
		})

		if (debug) {
			console.log(`Regulated cookies in ${performance.now() - now}ms`)
		}
	} catch (e) {
		console.warn('Unable to regulate cookies - it is open season!')
		console.error(e)
	}
}

export const restoreCookies = function ({ debug = false } = {}) {
	const now = performance.now()

	Object.defineProperty(document, 'cookie', _cookie)

	if (debug) {
		console.log(`Restored cookies in ${performance.now() - now}ms`)
	}
}
