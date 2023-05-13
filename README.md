# Prevent arbitrary data storage in the browser

PoC approaches to only allow certain keys to be used to store data in the browser.

See the tests or the console in the [demo page](https://sndrs.github.io/storage-consent/) for examples.

-   [x] Cookies
-   [x] `localStorage`
-   [x] `sessionStorage`
-   [ ] update `storage` in `@guardian/libs` (currently this breaks it, because [it fails silently if it cannot set a key when it initialises](https://github.com/guardian/csnx/blob/main/libs/%40guardian/libs/src/storage/storage.ts#L16))
-   [ ] `IndexedDB`
-   [ ] `WebSQL`?
-   [ ] Cache API?
-   [ ] Service Worker?

## Development

```sh
pnpm install
pnpm dev # runs the test in watch mode
```
