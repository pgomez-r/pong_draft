# pong_draft

Isolated test implementation of a basic pong game.

## How to run

### Prerequisites

- Git
- Node.js and npm (Node Package Manager)
- Visual Studio Code
- Live Server extension for VSCode

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

3. **Compile TypeScript to JavaScript**

   - For a one-time build:
     ```bash
     npm run build
     ```
   - For continuous compilation (watches for changes):
     ```bash
     npm run watch
     ```

4. **Run the game**
   - Open the project in Visual Studio Code
   - Navigate to `game/public/index.html`
   - Right-click on the file and select "Open with Live Server" (or use the shortcut Alt+L Alt+O)
   - Alternatively, from the Command Palette (Ctrl+Shift+P), search for "Live Server: Open with Live Server"
> Depending on your Live Server configuration, you may first see the project folder tree on browser, then you will have to navigate to game/public/index.html to view the actual game

### Troubleshooting
- Make sure you have the Live Server extension installed in VS Code
- If you make changes to TypeScript files, ensure the compiler is running (npm run watch) to see updates and reload page on browser as well

