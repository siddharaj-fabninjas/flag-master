# FlagMaster Improvements

- [x] **Modularize assets**: Move CSS and JavaScript into dedicated files (and ideally ES modules) so markup stays readable, the browser can cache/minify assets, and future maintenance is easier.

- [x] **Externalize datasets**: Shift large static tables (`FLAG_HINTS`, `SIMILAR_FLAGS_INFO`) into JSON/data modules that can be reused or updated without editing UI logic; consider lazy-loading to keep initial payload small.

- [x] **Cache REST Countries payload**: Persist the fetched `flagsDB` (with a freshness timestamp) in localStorage/IndexedDB so the app loads instantly, works offline for a while, and avoids API-rate issues.

- [x] **Optimize lookups**: Build a `Map` keyed by `cca3` after fetching so utilities like `getSimilarFlags` can perform O(1) retrievals instead of repeated `Array.find` scans.

- [ ] **Improve accessibility**: Add `aria-label`s to icon buttons, ensure status text has `aria-live`, manage focus only when controls are visible, and introduce landmark roles to make the trainer screen-reader and keyboard friendly.
