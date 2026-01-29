import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const log = (msg: string, isError = false) => {
    const debug = document.getElementById('debug-overlay');
    if (debug) {
        const entry = document.createElement('div');
        if (isError) entry.style.color = '#f87171';
        entry.innerHTML = `<span style="opacity: 0.5;">[JS]</span> > ${msg}`;
        debug.appendChild(entry);
        if (debug.children.length > 15) debug.removeChild(debug.children[1]);
    }
    console.log("[JS-Boot]", msg);
};

const container = document.getElementById('root');

if (container) {
  try {
    log("Checking DOM Container...");
    const root = createRoot(container);
    log("React Root Initialized");
    
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Signal success to the Boot Guard in index.html
    (window as any).APP_MOUNTED = true;
    log("Render Sequence Active");
  } catch (error: any) {
    log("Render Error: " + error.message, true);
    const errDisplay = document.getElementById('error-display');
    const errMsg = document.getElementById('error-message');
    if (errDisplay && errMsg) {
        errDisplay.style.display = 'block';
        errMsg.innerText = "Failed to start React application: " + error.message;
    }
  }
} else {
  console.error("Critical: Root container not found");
  log("CRITICAL: Root container missing!", true);
}