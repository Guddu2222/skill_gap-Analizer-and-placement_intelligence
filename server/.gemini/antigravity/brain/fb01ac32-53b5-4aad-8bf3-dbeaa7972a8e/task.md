# Task Checklist

- [x] Fix variable name in `Customize2.jsx` to use `assistantName` instead of `Assistantname`.
- [x] Fix mongoose schema variables in `user.model.js` to correctly define `assistantName` and `assistantImage`.
- [ ] Add `loading` state to `UserContext.jsx` to delay rendering `App`'s protected routes when fetching user data.
- [ ] Update `App.jsx` to show a generic loading screen or return nothing while `loading` is true.
- [ ] Add `navigate("/")` to `Customize2.jsx` so it properly redirects to Home upon successful assistant creation.
