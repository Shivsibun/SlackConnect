Slack Connect App
A simple app that lets users log in with Slack using OAuth. It has a backend server and a frontend website. The app uses public URLs via ngrok to work during development.

Setup Instructions
1. Clone the project
bash
git clone https://github.com/Shivsibun/SlackConnect.git
cd SlackConnect
2. Install dependencies
Installed packages for backend and frontend separately:

bash
cd backend
npm install
cd ../frontend
npm install

3. Configure environment variables
Create .env files in both backend and frontend folders.

Backend .env:

text
PORT=3000
SLACK_CLIENT_ID=9309003919574.9318713485346
SLACK_CLIENT_SECRET=f4963ad5c10cc189c956385a974506db
SLACK_REDIRECT_URI=https://pig-cool-jay.ngrok-free.app/api/auth/slack/callback

Frontend .env:

text
VITE_SLACK_CLIENT_ID=9309003919574.9318713485346
VITE_SLACK_REDIRECT_URI= https://pig-cool-jay.ngrok-free.app/api/auth/slack/callback
VITE_BACKEND_URL=https://slack-connect-backend-inxd.onrender.com

4. Run the servers
Open two terminal windows/tabs:

Backend server:
bash
cd backend
npm run dev

Frontend server:
bash
cd frontend
npm run dev

5. Expose local servers to the internet:
Use ngrok  Tunnel to get public URLs:

For backend (port 3000):
bash
ngrok http 3000

For frontend (port 5173):
bash
ngrok http 5173


Architectural Overview
1)The frontend is a React app served locally on port 5173. It uses the public URL to call backend APIs.
2)The backend is an Express server running on port 3000. It handles Slack OAuth by sending users to Slack's login page and processing the OAuth callback.
3)OAuth flow:
User clicks login on the frontend.
Backend redirects to Slack for user authorization.
Slack redirects back to backend OAuth callback URL with a code.
Backend exchanges the code for tokens and sends the user back to frontend with info.
Tokens are managed in backend during this exchange and used to interact with Slack APIs.

Challenges & Learnings
1)Configuring the OAuth callback URL consistently was tricky — it must match exactly across backend, frontend, and Slack app settings.
2)Getting public URLs that work reliably through tunnels like ngrok required extra care and testing but on the later phase I will try to remove the local tunneling.
3)Handling 404 errors for the OAuth callback route taught us about backend routing and the importance of correct path mounting.
4)Learned how to manage environment variables properly to keep secrets safe and URLs consistent.
5)Discovered how important it is to restart servers after changes in environment files or tunnel URLs.
6)Faced git challenges pushing code due to remote changes — learned how to pull, rebase, and resolve conflicts calmly.
7)Eliminated unused imports and variables flagged by TypeScript to ensure clean builds.
8)Overall, gained experience working with OAuth flows, local tunneling, and deploying local apps for demos.

Testing Instructions:
When you click "Sign in with Slack", you will be redirected to Slack’s login page.
Please log in with your own Slack workspace credentials and authorize the app to send and schedule messages in your workspace.
