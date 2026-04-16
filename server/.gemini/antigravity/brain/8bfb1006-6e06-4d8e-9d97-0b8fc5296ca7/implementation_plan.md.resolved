# Smart Expense Manager - Implementation Plan

## Goal Description
Build a modern, secure, and visually stunning "Smart Expense Manager" for small businesses. The application will solve the problem of manual expense tracking by providing a robust dashboard, JWT-based role authentication, automated PDF invoice generation, and detailed monthly reports. This serves as a premium portfolio project demonstrating full-stack (MERN) competency, complex data modeling, and modern UI/UX principles.

## Proposed Architecture & Tech Stack
- **Frontend**: React.js (via Vite) + Tailwind CSS + Context API for state management.
- **UI/UX Strategy**: Provide a clean, monochromatic dashboard layout with vibrant chart accents. Include Dark Mode and mobile-responsive layouts. Use `Chart.js` for data visualization.
- **Backend**: Node.js + Express.js.
- **Database**: MongoDB (Mongoose ORM) relying heavily on Aggregation pipelines for analytics.
- **Authentication**: JWT & `bcryptjs` with `Owner` and `Accountant` role-based access control (RBAC).
- **Tooling**: `pdfkit` (or `puppeteer`) for server-side PDF invoice generation.

---

## Proposed Changes (Project Structure)

### Frontend (Client)
#### [NEW] `client/src/App.jsx`
Routing layer using `react-router-dom` to handle public (Login/Register) and protected routes.

#### [NEW] `client/src/context/AuthContext.jsx`
Global state for managing JWT tokens, user data, and roles across the React application.

#### [NEW] `client/src/pages/Dashboard.jsx`
Main landing view post-login. Displays high-level stats (Total Income vs Expense) and Chart.js graphs.

#### [NEW] `client/src/pages/Expenses.jsx`
CRUD interface for expenses and income. Includes filtering, sorting, and pagination.

#### [NEW] `client/src/pages/Invoices.jsx`
Interface to manage clients, generate new invoices, and download them as PDFs.

#### [NEW] `client/src/api/axios.js`
Axios instance configured to automatically append the `Authorization: Bearer <token>` header to all outgoing requests.

---

### Backend (Server)
#### [NEW] `server/models/User.js`
Mongoose schema: `name`, `email`, `password` (hashed), `role` (Enum: 'owner', 'accountant'), `createdAt`.

#### [NEW] `server/models/Expense.js`
Mongoose schema: `userId` (Ref: User), `title`, `amount`, `category`, `type` (Enum: 'income', 'expense'), `date`, `notes`.

#### [NEW] `server/models/Invoice.js`
Mongoose schema: `userId` (Ref: User), `clientName`, `clientEmail`, `items` (Array of Description, QTY, Price), `totalAmount`, `status` (Enum: 'paid', 'pending', 'overdue'), `dueDate`.

#### [NEW] `server/controllers/authController.js`
Handles `/api/auth/register` and `/api/auth/login`. Returns JWT tokens.

#### [NEW] `server/controllers/expenseController.js`
Handles CRUD operations for expenses. Includes aggregation logic for monthly reports and metrics.

#### [NEW] `server/controllers/invoiceController.js`
Handles invoice logic. Calls `pdfGenerator` utility to create the binary PDF stream and send it to the frontend.

#### [NEW] `server/middleware/authMiddleware.js`
Intercepts requests to verify JWT tokens and attach the decoded `user` object to `req`. Implements role-checking logic.

#### [NEW] `server/utils/pdfGenerator.js`
Utility function using `pdfkit` to visually construct the invoice PDF layout cleanly.

---

## User Review Required
> [!IMPORTANT]
> **Tooling Decision:** For PDF generation, `pdfkit` is fast, lightweight, and native to Node, but requires manual visual formatting through coordinate plotting. `puppeteer` allows us to render HTML/CSS and convert it to PDF, which is easier for complex designs but heavier on the server. I propose **pdfkit** for standard business invoices to keep backend deployments fast, unless you prefer HTML-to-PDF via Puppeteer. Let me know if you agree.

## Verification Plan

### Automated / Postman Testing
- Start the server using `npm run dev` and test JWT Auth flows via predefined local scripts (or ThunderClient/Postman).
- Verify MongoDB Aggregations directly by sending requests for Monthly breakdown data and ensuring calculation accuracy.
- Ensure protected routes return `401 Unauthorized` without tokens, and `403 Forbidden` for Accountant roles attempting Owner actions.

### Manual Verification
- **Run the full stack**: `npm run dev` on both client and server folders.
- **Signup/Login**: Register a new "Owner" user to simulate the first-run experience.
- **Generate Test Data**: Manually enter 5-10 expenses and income items to visualize them on `Dashboard.jsx`.
- **Download Invoice**: Click "Generate PDF" on an invoice and inspect the downloaded `.pdf` file in a browser to ensure formatting is pristine.
- **UI Responsiveness**: Shrink the browser window and toggle Dark Mode to ensure the Tailwind UI remains robust and highly aesthetic.
