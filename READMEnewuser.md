🚦 CookieBlocker Extension: Beginner’s Setup & Demo Guide
Welcome! This guide will help you download, install, and test the CookieBlocker extension — even if you’re new to Git, npm, or Chrome extensions.

1️⃣ Prerequisites
Git: Lets you download ("clone") code projects.
Download: https://git-scm.com/downloads

Node.js & npm: Needed to install and run tests.
Download: https://nodejs.org/

Google Chrome or Microsoft Edge: For running the extension/demo.

2️⃣ Step-by-Step Setup
Step A: Download the extension code
Open Git Bash or Command Prompt (Windows).

Run this command to download the project:

bash
git clone https://github.com/Punith18-18/cookie-blocker-extension.git
Move into the new project folder:

bash
cd cookie-blocker-extension
Step B: Install required packages
Make sure you are inside the cookie-blocker-extension folder.

Run this command:

bash
npm install
This will download all the tools the extension needs.

If you see errors about package-lock.json, don’t worry — npm install will fix it.

3️⃣ How to Run the Demo Test
Automated Demo Test
In the same folder, run:

bash
npm run test-demo
This will automatically check if the extension properly dismisses popups in a demo.

Troubleshooting:

If you see Error: Cannot find module 'puppeteer', go back and run npm install again!

If the test demo fails on Windows:
Try running as administrator OR disable antivirus for a minute while installing dependencies.

Manual Demo Test
Inside the project folder, find and open:

demo/test-banner.html

Double-click to open in Chrome or Edge.

This shows a simulated cookie popup so you can test the extension’s function visually.

4️⃣ How to Install the Extension Locally (for Devs)
Open Chrome/Edge.

Go to the Extensions page:

Chrome: chrome://extensions

Edge: edge://extensions

Turn on Developer Mode (top right).

Click Load unpacked.

Select your cookie-blocker-extension folder.

Your extension is now installed!

5️⃣ Common Problems & How to Fix
npm ENOENT or MODULE_NOT_FOUND

Solution: Run npm install inside your project folder.

Puppeteer install fails

Solution: Try installing as Administrator; temporarily disable antivirus.

6️⃣ Uninstalling/Deleting
Just delete the folder, or remove from Extensions in Chrome/Edge.

7️⃣ Need Help?
Open an issue on GitHub with your question.

Check the existing README or this guide for answers.

Google the error message for common solutions.

— Happy Blocking! —

