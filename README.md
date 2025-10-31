# CanvasUIMark

A JavaScript library for creating UI controls within HTML Canvas elements, specifically designed for simple web games.

![CanvasUIMark Showcase](https://github.com/user-attachments/assets/cc1178cc-e777-495c-adae-7dbc364743c3)

![CanvasUIMark Showcase](https://github.com/user-attachments/assets/d5a66134-e7d2-4b5a-b1fa-7e11ae25c6a4)

## Features

- **Interactive UI Controls** - Buttons, menus, toggles, text inputs, radio buttons, carousels, and sliders
- **Modal Dialogs & Notifications** - Pop-up dialogs and toast notifications
- **Theme System** - Set default colors and fonts for consistent styling across all controls
- **Full Input Support** - Keyboard, mouse, and gamepad navigation
- **Publisher-Subscriber Input System** - Decoupled input management via CanvasInputMark
- **Responsive** - Automatic canvas scaling support
- **Easy to Use** - Simple API with minimal setup

## Input System

CanvasUIMark uses an external input manager for all keyboard, mouse, and gamepad events. The default input manager is **CanvasInputMark**.

- You must create an input manager and pass it to CanvasUIMark via the `input` option.
- Multiple UI or game components can subscribe to the same input manager.
- For details and advanced usage, see **[canvasinputmark.md](canvasinputmark.md)**.

### Example:

```javascript
import { CanvasUIMark, Button, Menu } from "./canvasuimark.js";
import { CanvasInputMark } from "./canvasinputmark.js";

const canvas = document.getElementById("gameCanvas");
const inputManager = new CanvasInputMark(canvas);
const ui = new CanvasUIMark(canvas, { input: inputManager });
```

## Quick Start

```javascript
import { CanvasUIMark, Button, Menu } from "./canvasuimark.js";
import { CanvasInputMark } from "./canvasinputmark.js";

const canvas = document.getElementById("gameCanvas");
const inputManager = new CanvasInputMark(canvas);
const ui = new CanvasUIMark(canvas, { input: inputManager });

// Optional: Set theme colors and font for all controls
ui.setTheme({
  controlColor: "#4CAF50",
  backgroundColor: "#333333",
  textColor: "#ffffff",
  borderRadius: 10,
  fontFamily: "Arial",
  fontSize: 16,
});

// Add a button
const button = new Button(
  100,
  100,
  "Click Me!",
  () => {
    ui.showToast("Button clicked!", "success");
  },
  { width: 200, height: 50 }
);
ui.addControl(button);

// External game loop
let lastTime = 0;
function gameLoop(currentTime) {
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;

  ui.update(deltaTime);
  ui.render();

  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
```

## Theme System

Set default colors and fonts once, and all controls will inherit these settings:

```javascript
// Set theme colors and fonts together
ui.setTheme({
  borderColor: "#666666",
  focusBorderColor: "#4CAF50",
  controlColor: "#4CAF50",
  backgroundColor: "#333333",
  textColor: "#ffffff", // Used by controls and addText()
  borderRadius: 10,
  fontFamily: "Georgia, serif", // Set default font in theme
  fontSize: 16,
});

// Controls can use fontSize, fontWeight, fontStyle individually
const button = new Button(100, 100, "Bold Button", callback, {
  fontSize: 20,
  fontWeight: "bold",
});

// addText() uses theme textColor by default
ui.addText("Themed Text", 100, 200); // Uses theme's textColor
```

## Documentation

For detailed documentation, API reference, and examples, see **[canvasuimark.md](canvasuimark.md)** and **[canvasinputmark.md](canvasinputmark.md)**.

## Showcase

Open **[showcase.html](showcase.html)** in your browser to see all controls in action with interactive demonstrations.

## License

MIT License - See [LICENSE](LICENSE) file for details.
