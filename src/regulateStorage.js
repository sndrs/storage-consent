export function regulateStorage({ allow = [], debug = false } = {}) {
	try {
		if (debug) {
			console.group('Allowed storage keys:')
			allow.forEach((key) => console.log(`\`${key}\``))
			console.groupEnd()
		}

		const storageProxy = (storageType) =>
			new Proxy(window[storageType], {
				set: function (target, prop, value) {
					if (allow.includes(prop)) {
						if (debug) {
							console.log(`Saving \`${prop}\` to ${storageType}`)
						}
						return Reflect.set(...arguments)
					} else {
						throw new Error(
							`Blocked saving \`${prop}\` to ${storageType}`,
						)
					}
				},
				get: function (target, prop) {
					if (prop === 'setItem') {
						return (key, value) => this.set(target, key, value)
					}
					if (typeof target[prop] === 'function') {
						return target[prop].bind(target)
					}
					return target[prop]
				},
			})

		for (const storageType of ['localStorage', 'sessionStorage']) {
			Object.defineProperty(window, storageType, {
				configurable: true,
				enumerable: true,
				value: storageProxy(storageType),
			})
		}
	} catch (e) {
		// we need to use a proxy for this, so if it's not supported, we can't do anything
		if (debug) {
			console.error(e)
		}
	}
}
