// @ts-check

const restorePoint = {
	localStorage: Object.getOwnPropertyDescriptor(window, 'localStorage'),
	sessionStorage: Object.getOwnPropertyDescriptor(window, 'sessionStorage'),
}

/**
 * Returns a proxy to a Storage object that only allows certain keys to be saved.
 *
 * @param {('sessionStorage' | 'localStorage')} storageType - Storage type to regulate
 * @param {string[]} allowedKeys - Keys that are allowed to be saved
 * @param {boolean} debug - Whether to log debug messages
 * @returns {Proxy<Storage>}
 */
const regulatedStorage = ({ storageType, allowedKeys, debug }) =>
	new Proxy(window[storageType], {
		set: function (target, prop, value) {
			if (allowedKeys.includes(prop)) {
				if (debug) {
					console.log(`Saving '${prop}' to ${storageType}`)
				}
				target.setItem(prop, value)
				return true
			} else {
				throw new Error(`Blocked saving '${prop}' to ${storageType}`)
			}
		},

		get: function (target, prop, value) {
			if (typeof target[prop] === 'function') {
				if (prop === 'setItem') {
					return (key, value) => this.set(target, key, value)
				}
				return target[prop].bind(target)
			}

			return target[prop]
		},
	})

export const regulateStorage = ({ allowedKeys = [], debug = false } = {}) => {
	for (const storageType of ['localStorage', 'sessionStorage']) {
		const now = performance.now()

		Object.defineProperty(window, storageType, {
			value: regulatedStorage({
				storageType,
				allowedKeys,
				debug,
			}),
		})

		if (debug) {
			console.log(
				`Proxied ${storageType} in ${performance.now() - now}ms`,
			)
		}
	}
}

export const restoreStorage = ({ debug = false } = {}) => {
	for (const storageType of ['localStorage', 'sessionStorage']) {
		const now = performance.now()

		Object.defineProperty(window, storageType, restorePoint[storageType])

		if (debug) {
			console.log(
				`Restored ${storageType} in ${performance.now() - now}ms`,
			)
		}
	}
}
