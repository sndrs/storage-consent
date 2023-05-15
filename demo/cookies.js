import { regulateCookies, restoreCookies } from '../src/regulateCookies.js'

// clear existing cookies
for (const cookie of document.cookie.split(';')) {
	document.cookie = cookie
		.replace(/^ +/, '')
		.replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/')
}

console.groupCollapsed('Cookies')

const allowedKeys = ['allowed']

console.group('Allowed cookie keys:')
allowedKeys.forEach((key) => console.log(`'${key}'`))
console.groupEnd('Allowed cookie keys:')

console.info('Regulating cookies')
regulateCookies({ allowedKeys, debug: true })

console.log("Trying to set 'allowed' key")
document.cookie = 'allowed=good data'

console.log("Trying to set 'not-allowed' key")
try {
	// this will error, so try/catching it
	document.cookie = 'not-allowed=evil data'
} catch (e) {
	console.error(e)
}

console.info('document.cookie:', document.cookie)

console.info('Restoring native Cookies')
restoreCookies({ debug: true })

console.log("Trying to set 'allowed' key")
document.cookie = 'allowed=good data'

console.log("Trying to set 'not-allowed' key")
// doesn't error now, the native, unregulated localCookies
// is has been restored
document.cookie = 'not-allowed=evil data'

console.info('document.cookie:', document.cookie)
console.groupEnd('Cookies')
