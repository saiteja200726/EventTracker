# EventTracker frontend connection

## Local development

1. Start the backend in its own terminal from the backend folder:
   `npm run dev`
   It should listen at `http://localhost:5000`.
2. In this frontend folder, install dependencies:
   `npm install`
3. Start Vite:
   `npm run dev`
4. Open the exact local URL printed by Vite (usually `http://localhost:5173`).

Vite forwards `/api/*` and `/uploads/*` requests to `http://localhost:5000`.
The backend must expose the routes used by the frontend:
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET/POST/PUT/DELETE /api/events` (as implemented by the backend)
- `POST /api/register`

A successful frontend build does not guarantee DynamoDB is configured. If signup returns a server error, check the backend terminal and ensure the DynamoDB table/index names and IAM permissions match the backend configuration.

## Production

Set `VITE_API_BASE_URL` to the deployed backend API base URL ending in `/api`, then rebuild the frontend. The deployed backend must also serve or permit requests from the deployed frontend origin.
