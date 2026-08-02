# Newzify

Newzify is a full-stack news publishing platform. It includes a public news website, admin dashboard, reporter dashboard, user dashboard, news/blog/editorial/podcast publishing, comments, likes, newsletter subscriptions, search, Cloudinary file uploads, and real-time messaging.

## Tech Stack

| Area | Technology |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, TanStack Router, TanStack Query, Tailwind CSS |
| Backend | Node.js, Express 5, TypeScript, MongoDB, Mongoose |
| Auth | JWT, bcrypt, role-based frontend routing |
| Uploads | express-fileupload, Cloudinary |
| Realtime | Socket.IO |
| Email | Nodemailer |
| Validation | Zod |

## Project Structure

```text
Newzify/
|-- Backend/        # Express API, MongoDB models, auth, Socket.IO
|-- Frontend/       # React/Vite client application
|-- README.md
`-- LICENSE
```

## Prerequisites

- Node.js 20 or newer
- pnpm, or npm if you prefer
- MongoDB database connection string
- Cloudinary account for image/file uploads
- Gmail app password or SMTP credentials for email sending

## Backend Setup

1. Install dependencies.

```bash
cd Backend
pnpm install
```

If you use npm:

```bash
cd Backend
npm install
```

2. Create `Backend/.env`.

```env
PORT=3005
NODE_ENV=development
WEBSITE_NAME=Newzify

DB_STRING=mongodb+srv://USER:PASSWORD@HOST/DATABASE_NAME

BCRYPT_SALT_ROUNDS=10
JWT_ACCESS_SECRET=replace_with_a_long_random_access_secret
JWT_ACCESS_EXPIRES_IN=7d
JWT_REFRESH_SECRET=replace_with_a_long_random_refresh_secret
JWT_REFRESH_EXPIRES_IN=30d

CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

GOOGLE_MAP_API_KEY=
```

Do not commit real `.env` values. Keep secrets only on your local machine or deployment provider.

3. Start the backend.

```bash
pnpm dev
```

Backend URLs:

- API root: `http://localhost:3005`
- API version prefix: `http://localhost:3005/api/v1`
- Health check: `http://localhost:3005/health`

Useful backend scripts:

```bash
pnpm dev      # Start development server with nodemon
pnpm build    # Compile TypeScript
pnpm start    # Start production server
```

## Frontend Setup

1. Install dependencies.

```bash
cd Frontend
pnpm install
```

If you use npm:

```bash
cd Frontend
npm install
```

2. Set the backend URL.

The current frontend stores the API base URL in `Frontend/src/helpers/api.ts`.

For deployed backend:

```ts
export const BACKEND_URL = "https://newzify-backend-kappa.vercel.app";
```

For local backend:

```ts
export const BACKEND_URL = "http://localhost:3005";
```

The frontend currently does not require its own `.env` file.

3. Start the frontend.

```bash
pnpm dev
```

Frontend URL:

- `http://localhost:5173`

Useful frontend scripts:

```bash
pnpm dev       # Start Vite development server
pnpm build     # Type-check and build production files
pnpm lint      # Run ESLint
pnpm preview   # Preview production build
```

## Backend Modules

The backend has 18 module folders in `Backend/src/app/modules`. 17 are active API modules mounted in `Backend/src/app/routes/index.ts`; the `setting` module exists but is currently not mounted.

| # | Module | Base API Path | What It Does |
| --- | --- | --- | --- |
| 1 | `auth` | `/api/v1/auth` | Register, login, forgot-password OTP verification, password update, JWT token creation |
| 2 | `user` | `/api/v1/user` | User profile, liked posts, user comments/replies, admin user list, reporter creation, chat users |
| 3 | `otp` | `/api/v1/otp` | Sends and stores OTP codes for signup and password reset workflows |
| 4 | `file` | `/api/v1/files` | Uploads and deletes files/images through Cloudinary |
| 5 | `news` | `/api/v1/news` | News CRUD, public news lists, news detail, likes, hero/3-box/marketplace news feeds |
| 6 | `news-category` | `/api/v1/news-category` | News category CRUD and public category lookup by slug |
| 7 | `subscriber` | `/api/v1/subscribers` | Newsletter subscribe/unsubscribe, admin subscriber list, publish notification emails |
| 8 | `blog` | `/api/v1/blogs` | Blog CRUD, public blog listing/detail, newsletter notification on create |
| 9 | `blog-category` | `/api/v1/blog-categories` | Blog category CRUD and listing |
| 10 | `blog-tag` | `/api/v1/blog-tags` | Blog tag CRUD and listing |
| 11 | `comment` | `/api/v1/comments` | News comments, nested replies, comment likes, soft delete |
| 12 | `page-setting` | `/api/v1/page-setting` | Controls homepage selected news sections such as hero, three-box, and mark-place news |
| 13 | `conversation` | `/api/v1/conversation` | Creates or finds one-to-one conversations and lists user conversations |
| 14 | `message` | `/api/v1/message` | Sends messages, lists messages, marks messages read, counts unread messages |
| 15 | `editorial` | `/api/v1/editorials` | Editorial CRUD, public editorial listing/detail, editor pick support |
| 16 | `podcast` | `/api/v1/podcasts` | Podcast CRUD, public podcast listing/detail, featured podcast support |
| 17 | `search` | `/api/v1/search` | Searches published news, podcasts, editorials, and blogs |
| 18 | `setting` | Not mounted | Site setting model/routes exist, but the main router currently comments this module out |

Most backend modules follow this file pattern:

```text
module-name/
|-- module.route.ts        # API endpoints
|-- module.controller.ts   # HTTP request/response handling
|-- module.service.ts      # Business logic and database operations
|-- module.model.ts        # Mongoose schema/model
|-- module.validation.ts   # Zod validation, where needed
`-- module.interface.ts    # TypeScript types
```

## Frontend Modules

The frontend is organized into 6 main feature areas:

| # | Area | Main Files/Folders | What It Does |
| --- | --- | --- | --- |
| 1 | Public website | `src/routes`, `src/pages`, `src/components/Home`, `src/components/Cards` | Home page, news lists, category pages, top/fresh/trending/popular news, editorial/blog/podcast pages |
| 2 | Auth | `src/routes/login.tsx`, `src/routes/signup.tsx`, `src/routes/forgot-password.tsx`, `src/pages/login.tsx`, `src/pages/Registration.tsx` | Login, signup, forgot password, token storage |
| 3 | User dashboard | `src/routes/dashboard*`, `src/components/user` | User profile, liked posts, comments, replies, settings |
| 4 | Admin dashboard | `src/routes/admin`, `src/pages/admin`, `src/components/layout/Admin*` | Manage users, reporters, subscribers, news, categories, blog, editorials, podcasts, page settings, messages |
| 5 | Reporter dashboard | `src/routes/reporter-dashboard`, `src/pages/reporter`, `src/components/layout/Reporter*` | Reporter content management for news, blogs, editorials, podcasts, messages, profile |
| 6 | Shared UI and helpers | `src/components/ui`, `src/components/common`, `src/helpers`, `src/context`, `src/provider` | API wrapper, user context, socket context, forms, tables, modal, editor, reusable UI |

## Application Workflow

### Request Flow

1. A React page or component calls an API function from `Frontend/src/helpers/backend.ts`.
2. `Frontend/src/helpers/api.ts` builds the URL, attaches the JWT token from `localStorage`, and sends the request.
3. Express receives the request in `Backend/src/app.ts` under `/api/v1`.
4. The module route sends the request through validation and auth middleware when required.
5. The controller reads request data and calls the service.
6. The service talks to MongoDB through a Mongoose model.
7. The response returns through `sendResponse`, and React Query refreshes the UI.

### Auth and Roles

Newzify uses three roles:

- `admin`
- `reporter`
- `user`

Users register with OTP verification and log in with email/phone plus password. The backend returns JWT access and refresh tokens. The frontend stores the access token in `localStorage`, decodes the role, and protects dashboard routes:

- `/admin` requires `admin`
- `/reporter-dashboard` requires `reporter`
- `/dashboard` requires `user`

### Publishing Workflow

1. Admins or reporters create content from their dashboard.
2. Images/files are uploaded to Cloudinary through the `file` module.
3. News, editorials, podcasts, and blogs are saved in MongoDB.
4. Content can be saved as `draft` or `published` where supported.
5. Public pages only show content that is not deleted and, for news/editorials/podcasts, has `status: "published"`.
6. When news is published or a blog is created, the subscriber module can send email notifications.

### Homepage Workflow

The `page-setting` module controls selected homepage content:

- `heroNews`
- `threeBoxNews`
- `markPlaceNews`

The frontend home page reads those sections through public news endpoints and renders the selected articles.

### Comment and Like Workflow

Logged-in users can like news and comments. Users can also comment on news, reply to existing comments, and view their own liked posts, comments, and replies in the user dashboard.

### Messaging Workflow

1. A logged-in user connects to Socket.IO using the JWT token.
2. The backend validates the token and marks the user online.
3. Users open or create a one-to-one conversation.
4. Messages are saved through the message API.
5. Socket.IO broadcasts new messages, online status, typing status, and notifications in real time.

### Search Workflow

The search module searches across published news, podcasts, editorials, and blogs. Results are grouped by content type so the frontend can show mixed search results.

## Important API Examples

| Feature | Method and Path |
| --- | --- |
| Register | `POST /api/v1/auth/register` |
| Login | `POST /api/v1/auth/login` |
| Send OTP | `POST /api/v1/otp/send` |
| Current user profile | `GET /api/v1/user/profile` |
| Public news list | `GET /api/v1/news/public/list` |
| Create news | `POST /api/v1/news/create` |
| Upload image/file | `POST /api/v1/files/single-image-upload` |
| News comments | `GET /api/v1/comments/news/:newsId` |
| Subscribe | `POST /api/v1/subscribers/subscribe` |
| Search | `GET /api/v1/search?query=keyword` |
| Conversations | `GET /api/v1/conversation/list` |
| Messages | `GET /api/v1/message/list/:conversationId` |

## Build for Production

Backend:

```bash
cd Backend
pnpm build
pnpm start
```

Frontend:

```bash
cd Frontend
pnpm build
pnpm preview
```

Both `Backend` and `Frontend` include `vercel.json`, so they are prepared for Vercel-style deployment. Add the same backend environment variables in the deployment dashboard before deploying the API.

## Notes for Developers

- The backend `.env` file must live inside `Backend/.env`.
- The frontend backend URL is currently hardcoded in `Frontend/src/helpers/api.ts`.
- The API response shape is usually `{ success, statusCode, message, data }`.
- Most deletes are soft deletes using `is_deleted` or `is_active`.
- Cloudinary secrets are required for upload routes.
- Email credentials are required for reliable OTP/newsletter email delivery.
