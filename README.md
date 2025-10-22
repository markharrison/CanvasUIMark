# CanvasUIMark

A JavaScript library for creating UI controls within HTML Canvas elements, specifically designed for simple web games.

![CanvasUIMark Showcase](https://github.com/user-attachments/assets/38a3d404-ee28-46ed-b133-b7e2d00620fe)

## Features

- **Interactive UI Controls** - Buttons, menus, toggles, text inputs, radio buttons, and sliders
- **Modal Dialogs & Notifications** - Pop-up dialogs and toast notifications
- **Full Input Support** - Keyboard, mouse, and gamepad navigation
- **Responsive** - Automatic canvas scaling support
- **Easy to Use** - Simple API with minimal setup
- **External Animation Loop** - Library is driven by your own game loop for maximum control
- **Separated Input Handling** - Clear abstraction between input logic and UI functionality using `CanvasUIMarkInputHandler` class

## Architecture

CanvasUIMark follows a modern, flexible architecture:

- **External Animation Loop**: You control the game loop using `requestAnimationFrame`, calling `update()` and `render()` methods
- **CanvasUIMarkInputHandler Class**: Handles all keyboard, mouse, and gamepad input separately from UI logic
- **CanvasUIMark Class**: Manages UI controls, rendering, and state

This design gives you full control over when and how the UI updates, making it easy to integrate with existing game engines or custom animation systems.

## Quick Start

```javascript
import { CanvasUIMark, Button, Menu } from './canvasuimark.js';

const canvas = document.getElementById('gameCanvas');
const ui = new CanvasUIMark(canvas);

// Add a button
const button = new Button(100, 100, 200, 50, 'Click Me!', () => {
    ui.showToast('Button clicked!', 'success');
});
ui.addControl(button);

// Create your own animation loop
let lastFrameTime = 0;

function gameLoop(timestamp) {
    const deltaTime = timestamp - lastFrameTime;
    lastFrameTime = timestamp;
    
    // Update and render the UI
    ui.update(deltaTime);
    ui.render();
    
    requestAnimationFrame(gameLoop);
}

// Start the loop
requestAnimationFrame(gameLoop);
```

## Documentation

For detailed documentation, API reference, and examples, see **[canvasuimark.md](canvasuimark.md)**.

## Showcase

Open **[showcase.html](showcase.html)** in your browser to see all controls in action with interactive demonstrations.

## License

MIT License - See [LICENSE](LICENSE) file for details.
