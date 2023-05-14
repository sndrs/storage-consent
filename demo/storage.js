import { regulateStorage, restoreStorage } from '../src/regulateStorage.js'

const allowedKeys = ['allowed']

console.group('Allowed storage keys:')
allowedKeys.forEach((key) => console.log(`'${key}'`))
console.groupEnd()

regulateStorage({ allowedKeys, debug: true })
sessionStorage.setItem('allowed', 'good data')

try {
	// this will error, so try/catching it
	localStorage.setItem('not-allowed', 'evil data')
} catch (e) {
	console.error(e)
}

restoreStorage({ debug: true })
sessionStorage.setItem('allowed', 'good data')

console.log("setting 'not-allowed' key")
// doesn't error now, the native, unregulated localStorage
// is has been restored
localStorage.setItem('not-allowed', 'evil data')
console.log(
	`localStorage['not-allowed'] is '${localStorage.getItem('not-allowed')}'`,
)
