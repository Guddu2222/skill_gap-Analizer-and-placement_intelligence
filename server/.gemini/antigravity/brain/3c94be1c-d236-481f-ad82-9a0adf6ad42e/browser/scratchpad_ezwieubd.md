# Task: Debug Student Dashboard Loader

## Checklist
- [x] Log in at http://localhost:5173/login (Encountered "Something went wrong" but navigated to /student)
- [x] Observe the "Failed to load profile" error
- [x] Retrieve the status code and response body for `GET /student/profile` (Found as /api/student-features/me)
- [x] Report findings to the user

## Findings
- URL: http://localhost:5173/login
- Email: bridgeskill830@gmail.com
- Password: 11111111
- Dashboard: http://localhost:5173/student
- **Failed Request**: `GET http://localhost:5000/api/student-features/me`
- **Error**: `net::ERR_CONNECTION_REFUSED`
- **Status Code**: N/A (Connection Refused)
- **Response Body**: N/A (No response received)
- **Code Trace**: `fetchStudentProfile` in `src/services/api.js` (line 201) calls this endpoint.
- **Backend Condition**: The server at `localhost:5000` is either not running or not accessible from the browser.
