import { regulateStorage, restoreStorage } from '../src/regulateStorage.js'

localStorage.clear()

console.groupCollapsed('Storage')

const allowedKeys = ['allowed']

console.group('Allowed storage keys:')
allowedKeys.forEach((key) => console.log(`'${key}'`))
console.groupEnd('Allowed storage keys:')

console.info('Regulating storage')
regulateStorage({ allowedKeys, debug: true })
console.debug("Trying to set 'allowed' key")
localStorage.setItem('allowed', 'good data')

console.debug("Trying to set 'not-allowed' key")
try {
	// this will error, so try/catching it
	localStorage.setItem('not-allowed', 'evil data')
} catch (e) {
	console.error(e)
}

console.info(`localStorage`, Object.entries(localStorage))

console.info('Restoring native storage')
restoreStorage({ debug: true })

console.debug("Trying to set 'allowed' key")
localStorage.setItem('allowed', 'good data')

console.debug("Trying to set 'not-allowed' key")
// doesn't error now, the native, unregulated localStorage
// is has been restored
localStorage.setItem('not-allowed', 'evil data')

console.info(`localStorage`, Object.entries(localStorage))
console.groupEnd('Storage')
