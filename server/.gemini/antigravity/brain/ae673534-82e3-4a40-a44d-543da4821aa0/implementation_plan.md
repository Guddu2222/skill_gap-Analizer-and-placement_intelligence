# Implementation Plan - Phase 2: Social Features

## Goal
Implement social features allowing users to follow each other and view a feed of their workouts.

## Proposed Changes

### Backend

#### [MODIFY] [User.js](file:///d:/project/Fittness%20tracking%20website/server/src/models/User.js)
- Ensure `friends` field is being used effectively (or rename to `following` if strictly one-way).
- Add `followers` field if bidirectional query performance is needed (optional for V1, but good for "who follows me").

#### [MODIFY] [friendController.js](file:///d:/project/Fittness%20tracking%20website/server/src/controllers/friendController.js)
- Verify `follow` and `unfollow` logic.
- **[NEW]** Implement `getFeed` function:
    - Query `Workout` model.
    - Filter by `user` where `user` is in the current user's `friends` (following) list.
    - Sort by date (descending).
    - Limit results (pagination).

#### [MODIFY] [friends.js](file:///d:/project/Fittness%20tracking%20website/server/src/routes/friends.js)
- Add `GET /feed` endpoint pointing to `friendController.getFeed`.

### Client

#### [NEW] [Feed.jsx](file:///d:/project/Fittness%20tracking%20website/client/src/pages/Feed.jsx)
- Fetch feed data from `/api/friends/feed`.
- Render a list of "Workout Cards" showing:
    - User name/avatar.
    - Workout type, duration, calories.
    - Date.

#### [MODIFY] [App.jsx](file:///d:/project/Fittness%20tracking%20website/client/src/App.jsx)
- Add route for `/feed`.

#### [MODIFY] [Layout.jsx](file:///d:/project/Fittness%20tracking%20website/client/src/components/Layout.jsx)
- Add "Feed" link to Sidebar and MobileNav.

## Verification Plan

### Manual Verification
1.  **Follow/Unfollow**: Use Postman or UI to follow another user.
2.  **Feed Generation**:
    - Log in as User A.
    - Follow User B.
    - Have User B create a workout.
    - Refresh User A's feed and verify the workout appears.
3.  **UI Check**: Ensure feed items look good in the new dark theme.
