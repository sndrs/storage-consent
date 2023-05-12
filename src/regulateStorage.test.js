import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { regulateStorage } from './regulateStorage'

beforeAll(async () => {
	regulateStorage({ allow: ['a', 'b'] })
})

beforeEach(async () => {
	window.localStorage.clear()
	window.sessionStorage.clear()
})

describe.each(['localStorage', 'sessionStorage'])(
	'describe %s',
	(storageType) => {
		it('should permit allowed keys to be set using setItem()', () => {
			expect(() =>
				window[storageType].setItem('a', 'a'),
			).not.toThrowError()
		})

		it('should permit allowed keys to be set using assignment', () => {
			expect(window[storageType].getItem('a')).toBeNull()
			expect(() => (window[storageType].a = 'a')).not.toThrowError()
			expect(window[storageType].getItem('a')).toBe('a')
		})

		it('should not permit disallowed keys to be set using setItem()', () => {
			expect(() =>
				window[storageType].setItem('not-allowed', 'invasive data'),
			).toThrowError('Blocked saving `not-allowed` to ' + storageType)
		})

		it('should not permit disallowed keys to be set using assignment', () => {
			expect(
				() => (window[storageType]['not-allowed'] = 'invasive data'),
			).toThrowError('Blocked saving `not-allowed` to ' + storageType)
		})

		it('should permit keys to be retrieved using getItem()', () => {
			expect(window[storageType].getItem('a')).toBeNull()
			window[storageType].setItem('a', 'a')
			expect(window[storageType].getItem('a')).toBe('a')
		})

		it('should permit keys to be retrieved using prop access', () => {
			expect(window[storageType].a).toBeUndefined()
			window[storageType].setItem('a', 'a')
			expect(window[storageType].a).toBe('a')
		})

		it('should permit keys to be deleted using removeItem()', () => {
			window[storageType].setItem('a', 'a')
			expect(window[storageType].getItem('a')).toBe('a')
			window[storageType].removeItem('a')
			expect(window[storageType].getItem('a')).toBeNull()
		})

		it('should permit keys to be deleted using delete', () => {
			window[storageType].setItem('a', 'a')
			expect(window[storageType].getItem('a')).toBe('a')
			delete window[storageType].a
			expect(window[storageType].getItem('a')).toBeNull()
		})

		it('should permit keys to be cleared using clear()', () => {
			expect(window[storageType].getItem('a')).toBeNull()
			window[storageType].setItem('a', 'a')
			expect(window[storageType].getItem('a')).toBe('a')
			window[storageType].clear()
			expect(window[storageType].getItem('a')).toBeNull()
		})

		it('should retrieve a key name using key()', () => {
			expect(window[storageType].key(0)).toBeNull()
			window[storageType].setItem('a', 'a')
			expect(window[storageType].key(0)).toBe('a')
		})

		it('should return the number of storage items using length', () => {
			expect(window[storageType].length).toBe(0)
			window[storageType].setItem('a', 'a')
			expect(window[storageType].length).toBe(1)
			window[storageType].setItem('b', 'b')
			expect(window[storageType].length).toBe(2)
			window[storageType].clear()
			expect(window[storageType].length).toBe(0)
		})
	},
)
