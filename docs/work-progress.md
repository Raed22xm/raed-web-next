# Work Progress

## 2025-11-12
- Set up dashboard UI skeleton showing recent resizes, detail view, and management controls (UI only; no data wiring yet).
- Simplified image upload flow: added Cloudinary helper, `/api/upload` endpoint, and client-side uploader that posts base64 payloads and handles progress/errors.

## 2025-01-13
- Updated upload.tsx to collect form data in required format: imageLink, imageFormat, manageAspectRatio, size (always "custom"), width/height with "px" suffix, outputFormat, userId from localStorage. Added preset size handling and validation.
- Integrated resize API: updated resize service to send payload, connected handleResize to "Resize Images" button with loading states and error handling. Updated interface to use manageAspectRatio.
- Added Authorization header: resize service now reads accessToken from localStorage (userData) and includes it as Bearer token in API requests.
- Added resized image display section: shows resized image with download button and dashboard navigation after successful resize. Auto-scrolls to section on success.
- Removed quality slider feature from upload UI.
- Created getAllResizes service: fetches all resizes for a user via GET `/resize/all/{userId}` with Authorization header. Refactored auth logic into reusable helper functions.
- Integrated getAllResizes API in dashboard: replaced mock data with real API calls, added loading/error states, mapped API response to ResizeItem interface, displays actual resized images in preview, and "Open Resize" button opens image in new tab.
- Updated Final Size display: changed "Size" block to "Final Size" showing converted dimensions (targetDimensions) instead of N/A values.
- Created deleteResize service: DELETE `/resize/{resizeId}` with Authorization header. Integrated into dashboard with confirmation dialog, loading state, and auto-refresh after deletion.
- Added Dashboard button to navbar: displays only when user is logged in, positioned before user menu with icon and text.
- Updated dashboard buttons: "New Resize" now redirects to upload page, removed "Go to Uploads" button.

