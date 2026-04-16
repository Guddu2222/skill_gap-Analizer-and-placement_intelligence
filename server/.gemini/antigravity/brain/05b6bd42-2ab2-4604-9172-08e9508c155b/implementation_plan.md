# Connectivity Fix Plan

## Goal
Fix `net::ERR_CONNECTION_REFUSED` errors by ensuring the backend server is running and accessible to the frontend client.

## Proposed Changes

### Client
- [ ] Update `vite.config.js` to include a proxy for `/api` pointing to `http://localhost:5000`.
- [ ] Update `client/src/api.js` to remove the hardcoded `http://localhost:5000` base URL and rely on the proxy.

### Server
- [ ] Create `server/.env` using values from `server/.env.example`.
- [ ] Run `npm install` in the `server` directory to install dependencies.
- [ ] Start the backend server using `npm run dev`.

## Verification
- [ ] Ensure `server` dependencies are installed and `.env` exists.
- [ ] Run `npm run dev` in `server`.
- [ ] Run `npm run dev` in `client`.
- [ ] Verify connection logic by checking `api/auth/login` endpoint access.
