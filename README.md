## On-Demand Rescaling – Frontend (Next.js)

### Prerequisites
- Node.js 20 (`.nvmrc` provided)
- npm (uses `package-lock.json`)

### Setup
1) Copy `.env.example` to `.env` and set:
   - `NEXT_PUBLIC_API_URL` (e.g., `http://localhost:4001/api/v1`)
   - `CLOUDINARY_*` keys
2) Install deps: `npm ci`

### Development
- `npm run dev` (defaults to http://localhost:3000)

### Lint
- `npm run lint`

### Build / Production
- `npm run build` then `npm start`
- Docker: `docker build -t rescaling-frontend .` then `docker run -p 3000:3000 rescaling-frontend`

### Notes
- Uses Next.js 16 (Pages router), React 19, MUI 7.
- API calls point to the backend `NEXT_PUBLIC_API_URL`.
