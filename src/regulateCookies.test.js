import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { regulateCookies, restoreCookies } from './regulateCookies'

const allowedKeys = ['a']

beforeEach(async () => {
	restoreCookies()
	for (const cookie of document.cookie.split(';')) {
		document.cookie = cookie
			.replace(/^ +/, '')
			.replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/')
	}
	regulateCookies({ allowedKeys })
})

describe('document.cookie', () => {
	it('should permit allowed keys to be saved', () => {
		expect(() => (document.cookie = 'a=safe data')).not.toThrowError()
		expect(document.cookie).toBe('a=safe data')
	})

	it('should not permit disallowed keys to be saved', () => {
		expect(
			() => (document.cookie = 'disallowedCookie=invasive data'),
		).toThrowError("Blocked saving cookie called 'disallowedCookie'")
	})
})
