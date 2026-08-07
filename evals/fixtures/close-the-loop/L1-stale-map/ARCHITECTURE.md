# Current configuration ownership

Provider configuration is owned by `shared/config-store.js`. Both applications
use `shared/provider-access.js`; app-local config stores and provider routes were
removed when settings moved into a shared modal.
