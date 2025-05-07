# pong_draft

Isolated test implementation of a basic pong game.

## How to run

### Prerequisites

- Git
- Node.js and npm (Node Package Manager)

### Setup and Running Instructions

1. **Clone the repository**

   ```bash
   git clone <https://github.com/pgomez-r/pong_draft.git>
   cd pong_draft
   ```

2. **Install dependencies**

   ```bash
   cd game
   npm install
   ```

3. **Build and run game**

   - For a one-time build:
	 ```bash
	 npm run build
	 ```
   - For continuous compilation (watches for changes):
	 ```bash
	 npm run watch
	 ```
   - To just start the server and display page without watching for changes:
	 ```bash
	 npm run serve
	 ```
   - For continuous development and display:
	 ```bash
	 npm run dev
	 ```

### Troubleshooting
- If the browser doesn't open automatically, navigate to http://localhost:5050/public/index.html or just http://localhost:5050
- If you make changes to TypeScript files while watch or dev scripts are running, they will be automatically compiled. Even so, you may need to refresh your browser to see the updates.

