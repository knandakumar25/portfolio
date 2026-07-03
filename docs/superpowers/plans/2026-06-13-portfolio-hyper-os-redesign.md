# Portfolio Hyper-OS Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete visual and UX overhaul of the portfolio into a "Hyper-OS" immersive environment, turning the site into a technical artifact with an integrated "Intelligence Kernel" for AI and Translation.

**Architecture:** 
The app will be restructured around a global "System Shell" that wraps all modules. We will replace the Bootstrap-centric styling with a custom CSS variable system for the "Cyber Lime" aesthetic. The AI and Translation logic will be decoupled from their specific UI components to allow for a persistent "Kernel" side-panel and a global "Language Protocol" switch. Navigation will be managed by a centralized "Module Load" animation wrapper.

**Tech Stack:** React, Framer Motion, CSS Modules/Custom CSS, React Router.

---

## File Mapping

### New Files
- `src/assets/hyper-os.css`: Global OS theme variables, grid overlay, and base system styles.
- `src/components/SystemShell/SystemBar.jsx`: Top bar with OS metadata and language toggle.
- `src/components/SystemShell/CommandDock.jsx`: Bottom floating navigation dock.
- `src/components/SystemShell/MainViewport.jsx`: The central frame wrapper for page content.
- `src/components/Kernel/KernelConsole.jsx`: The right-docked AI terminal.
- `src/components/Kernel/ContextMenu.jsx`: The "Interception" menu for highlighted text.
- `src/components/Kernel/LanguageProtocol.jsx`: Logic for the system-wide language switch.
- `src/components/Modules/BootDashboard.jsx`: New Home page implementation.
- `src/components/Modules/DataSheet.jsx`: Generic wrapper for Experience/Certifications.
- `src/components/Modules/ProjectMatrix.jsx`: New Projects page implementation.
- `src/components/Modules/ContactUplink.jsx`: New Contact page implementation.
- `src/components/Modules/ModuleWrapper.jsx`: Handles the "Module Load" animations.

### Modified Files
- `src/App.jsx`: Integration of the System Shell and Kernel.
- `src/App.css`: Cleanup and replacement with `hyper-os.css`.
- `src/components/Chat.jsx`: Refactored into `KernelConsole.jsx`.
- `src/components/TranslationProvider.jsx`: Updated to support the "Language Protocol" glitch reboot.
- `src/pages/Home.jsx`, `src/pages/Experiences.jsx`, `src/pages/Projects.jsx`, `src/pages/Certifications.jsx`, `src/components/Contact.jsx`: These will be replaced by the new `Modules` components.

---

## Implementation Tasks

### Task 1: Foundation - Visual Identity & Global CSS
**Files:**
- Create: `src/assets/hyper-os.css`
- Modify: `src/index.css`

- [ ] **Step 1: Define Hyper-OS Theme Variables**
Create `src/assets/hyper-os.css` with:
```css
:root {
  --os-bg: #0a0a0a;
  --os-accent: #ccff00; /* Cyber Lime */
  --os-text: #ffffff;
  --os-text-muted: #888888;
  --os-grid: rgba(204, 255, 0, 0.05);
  --os-glass: rgba(20, 20, 20, 0.7);
  --os-font-mono: 'JetBrains Mono', 'Roboto Mono', monospace;
  --os-font-header: 'Inter', sans-serif; /* Use a bold condensed sans */
}

body {
  background-color: var(--os-bg);
  color: var(--os-text);
  font-family: var(--os-font-mono);
  margin: 0;
  overflow-x: hidden;
}

/* The blueprint grid overlay */
.os-grid-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: 
    linear-gradient(var(--os-grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--os-grid) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 1000;
}
```

- [ ] **Step 2: Integrate into Global Styles**
Modify `src/index.css` to import `hyper-os.css` and remove conflicting Bootstrap base styles.

- [ ] **Step 3: Commit**
```bash
git add src/assets/hyper-os.css src/index.css
git commit -m "style: establish Hyper-OS visual identity and grid overlay"
```

### Task 2: The System Shell (Global Framework)
**Files:**
- Create: `src/components/SystemShell/SystemBar.jsx`
- Create: `src/components/SystemShell/CommandDock.jsx`
- Create: `src/components/SystemShell/MainViewport.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Build SystemBar**
Implement `SystemBar.jsx` with a fixed top layout, a ticking UTC clock, and a "System Status: Online" indicator.
- [ ] **Step 2: Build CommandDock**
Implement `CommandDock.jsx` as a floating bottom nav with `Home`, `Experiences`, `Projects`, `Certifications` icons using Framer Motion for hover pulses.
- [ ] **Step 3: Build MainViewport**
Implement `MainViewport.jsx` as a wrapper that adds the "inner shadow" screen effect.
- [ ] **Step 4: Wire into App.jsx**
Replace the existing `<Header />` with `<SystemBar />` and add `<CommandDock />` and `<MainViewport />`.

- [ ] **Step 5: Commit**
```bash
git add src/components/SystemShell/
git commit -m "feat: implement global System Shell framework"
```

### Task 3: The Intelligence Kernel (AI & Translation)
**Files:**
- Create: `src/components/Kernel/KernelConsole.jsx`
- Create: `src/components/Kernel/ContextMenu.jsx`
- Modify: `src/components/TranslationProvider.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Refactor Chat into KernelConsole**
Move `Chat.jsx` logic to `KernelConsole.jsx`. Change UI from a floating bubble to a right-docked terminal panel. Replace message bubbles with `[USER]` and `[KERNEL]` log entries.
- [ ] **Step 2: Implement the Language Protocol Switch**
Add a toggle in `SystemBar.jsx` that triggers the `TranslationProvider`. Add a "glitch" animation to the `MainViewport` when the language changes.
- [ ] **Step 3: Build the Contextual Interception Menu**
Implement `ContextMenu.jsx` that listens for `onMouseUp` globally. If text is selected, show a small menu with `TRANSLATE`, `QUERY`, and `ANALYZE` options.
- [ ] **Step 4: Wire Interception to AI/Translation**
Connect `QUERY` to `setChatState` and `TRANSLATE` to the translation logic.

- [ ] **Step 5: Commit**
```bash
git add src/components/Kernel/
git commit -m "feat: transform AI/Translation into the Intelligence Kernel"
```

### Task 4: Module Load Animations
**Files:**
- Create: `src/components/Modules/ModuleWrapper.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Implement ModuleWrapper**
Create a wrapper that uses `AnimatePresence` and `motion.div` to perform the "Collapse $\rightarrow$ Load Text $\rightarrow$ Expand" sequence described in the spec.
- [ ] **Step 2: Update AnimatedRoutes**
Wrap the routes in `App.jsx` with `ModuleWrapper`.

- [ ] **Step 3: Commit**
```bash
git add src/components/Modules/ModuleWrapper.jsx
git commit -m "feat: add OS-style module load animations"
```

### Task 5: Home $\rightarrow$ Boot Dashboard
**Files:**
- Create: `src/components/Modules/BootDashboard.jsx`
- Modify: `src/pages/Home.jsx`

- [ ] **Step 1: Build Profile Terminal**
Create the central dashboard with the glitch-filtered headshot and monospace profile data.
- [ ] **Step 2: Implement Quick-Stat Widgets**
Add counters for Projects, Exp, and Certs that animate upwards on mount.
- [ ] **Step 3: Build the Boot Sequence**
Implement the `[ INITIALIZE_PORTFOLIO ]` button that triggers a full-screen white-out/glitch transition before enabling the rest of the OS.

- [ ] **Step 4: Commit**
```bash
git add src/components/Modules/BootDashboard.jsx
git commit -m "feat: transform home page into Boot Dashboard"
```

### Task 6: Experience & Certifications $\rightarrow$ Data Sheets
**Files:**
- Create: `src/components/Modules/DataSheet.jsx`
- Modify: `src/pages/Experiences.jsx`, `src/pages/Certifications.jsx`

- [ ] **Step 1: Build DataSheet Component**
Create a grid-based component that renders data as "Records" (e.g., `EXP_001`).
- [ ] **Step 2: Implement Expand-in-Place Interaction**
Use Framer Motion to animate the row expansion that reveals detailed "logs" of achievements.
- [ ] **Step 3: Implement Glowing Skill Tags**
Add the high-contrast "Cyber Lime" pill tags for technologies.

- [ ] **Step 4: Commit**
```bash
git add src/components/Modules/DataSheet.jsx
git commit -m "feat: transform experience and certs into Data Sheets"
```

### Task 7: Projects $\rightarrow$ Project Matrix
**Files:**
- Create: `src/components/Modules/ProjectMatrix.jsx`
- Modify: `src/pages/Projects.jsx`, `src/pages/GameDetails.jsx`

- [ ] **Step 1: Build the Project Matrix Grid**
Create a grid of "File Icon" thumbnails that expand on hover.
- [ ] **Step 2: Implement the Full-Screen Deep Dive Overlay**
Create the 3-column layout: Technical Specs (Left), Media Gallery (Center), Dev Log (Right).
- [ ] **Step 3: Implement the Dev Log Timeline**
Format project descriptions as a sequence of timestamped "commits."

- [ ] **Step 4: Commit**
```bash
git add src/components/Modules/ProjectMatrix.jsx
git commit -m "feat: transform projects into the Project Matrix"
```

### Task 8: Contact $\rightarrow$ Signal Terminal
**Files:**
- Create: `src/components/Modules/ContactUplink.jsx`
- Modify: `src/components/Contact.jsx`

- [ ] **Step 1: Build Terminal Input UI**
Replace the standard form with prompt-based inputs (e.g., `NAME > `).
- [ ] **Step 2: Implement Transmission Sequence**
Add the "Transmitting Signal..." progress bar and the `[ SIGNAL_DELIVERED ]` confirmation state.

- [ ] **Step 3: Commit**
```bash
git add src/components/Modules/ContactUplink.jsx
git commit -m "feat: transform contact form into Signal Terminal"
```

### Task 9: Final Polish & Cleanup
**Files:**
- Modify: `src/App.jsx`
- Modify: `src/App.css` (Remove old styles)

- [ ] **Step 1: Remove all remaining Bootstrap styles**
Clean up `App.css` and `index.css` to ensure no legacy styles conflict with the Hyper-OS theme.
- [ ] **Step 2: Final Audit of Core Functionality**
Verify: AI Chat works, Translation works, Contact form submits, and Navigation is seamless.

- [ ] **Step 3: Final Commit**
```bash
git add .
git commit -m "feat: final polish and cleanup of Hyper-OS redesign"
```
