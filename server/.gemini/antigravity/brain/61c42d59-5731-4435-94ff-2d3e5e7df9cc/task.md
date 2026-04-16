# Profile Update Feature

## Backend
- [ ] Add `PUT /student-features/update-profile` API endpoint in `student-features.js`
- [ ] Add `updateStudentProfile` function to `api.js` (client service)

## Frontend – Profile Edit Page/Modal
- [ ] Create `ProfileEditModal.jsx` component (`client/src/components/student/ProfileEditModal.jsx`)
  - [ ] Section 1: Basic Info (firstName, lastName, phone, dateOfBirth, gender)
  - [ ] Section 2: Academic Info (department, degree, specialization, cgpa, graduationYear, currentSemester, admissionYear)
  - [ ] Section 3: Skills (add/remove skills with proficiency level)
  - [ ] Section 4: Links (linkedinUrl, githubUrl, portfolioUrl)
  - [ ] Section 5: Career (targetRole, preferredLocations, expectedSalary, willingToRelocate)
  - [ ] Section 6: Address (city, state, pincode, country)
- [ ] Add "Edit Profile" button in `StudentDashboard.jsx` header
- [ ] Wire modal open/close state and `onProfileUpdate` callback

## Verification
- [ ] Test that data saves correctly and UI refreshes
- [ ] Test profile completion percentage updates after save
