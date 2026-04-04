# Task Checklist
- [x] Navigate to http://localhost:5173/student
- [x] Wait for page load/crash
- [x] Capture console logs
- [x] Report error messages

## Findings
- **Console Errors:**
  - `Dashboard data load error: AxiosError: Network Error` at `StudentDashboard.jsx:59:26`
  - `GET http://localhost:5000/api/student-features/me net::ERR_CONNECTION_REFUSED`
- **Observation:**
  - The page renders but displays "Failed to load profile. Please try reloading."
  - This indicates that the backend server on port 5000 is not running or unreachable.
