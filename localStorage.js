try {
	const allowList = [
		'allow localStorage assignment',
		'allow sessionStorage assignment',
		'allow localStorage.setItem',
		'allow sessionStorage.setItem',
	]

	console.group('Allowed storage keys:')
	allowList.forEach((key) => console.log(`\`${key}\``))
	console.groupEnd()

	const storageProxy = (storageType) =>
		new Proxy(window[storageType], {
			set: function (target, key, value) {
				if (allowList.includes(key)) {
					console.log(`Saving \`${key}\` to ${storageType}`)
					return Reflect.set(...arguments)
				} else {
					throw new Error(
						`Blocked saving \`${key}\` to ${storageType}`,
					)
				}
			},
			get: function (target, key) {
				if (key === 'setItem') {
					return (storageKey, storageValue) =>
						this.set(target, storageKey, storageValue)
				}
				return Reflect.get(...arguments)
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
	console.error(e)
}
