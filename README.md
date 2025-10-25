# CanvasUIMark

A JavaScript library for creating UI controls within HTML Canvas elements, specifically designed for simple web games.

![CanvasUIMark Showcase](https://github.com/user-attachments/assets/38a3d404-ee28-46ed-b133-b7e2d00620fe)

## Features

- **Interactive UI Controls** - Buttons, menus, toggles, text inputs, radio buttons, carousels, and sliders
- **Modal Dialogs & Notifications** - Pop-up dialogs and toast notifications
- **Theme System** - Set default colors and fonts for consistent styling across all controls
- **Full Input Support** - Keyboard, mouse, and gamepad navigation
- **Responsive** - Automatic canvas scaling support
- **Easy to Use** - Simple API with minimal setup

## Quick Start

```javascript
import { CanvasUIMark, Button, Menu } from './canvasuimark.js';

const canvas = document.getElementById('gameCanvas');
const ui = new CanvasUIMark(canvas);

// Optional: Set theme colors for all controls
ui.setTheme({
    controlColor: '#4CAF50',
    backgroundColor: '#333333',
    textColor: '#ffffff',
    borderRadius: 10
});

// Optional: Set default font
ui.setDefaultFont({
    family: 'Arial',
    size: 16
});

// Add a button
const button = new Button(100, 100, 'Click Me!', () => {
    ui.showToast('Button clicked!', 'success');
}, { width: 200, height: 50 });
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
// Set theme colors
ui.setTheme({
    borderColor: '#666666',
    focusBorderColor: '#4CAF50',
    controlColor: '#4CAF50',
    backgroundColor: '#333333',
    textColor: '#ffffff',
    borderRadius: 10
});

// Set default font
ui.setDefaultFont({
    family: 'Georgia, serif',
    size: 16
});

// Controls can use fontSize, fontWeight, fontStyle individually
const button = new Button(100, 100, 'Bold Button', callback, {
    fontSize: 20,
    fontWeight: 'bold'
});
```

## Documentation

For detailed documentation, API reference, and examples, see **[canvasuimark.md](canvasuimark.md)**.

## Showcase

Open **[showcase.html](showcase.html)** in your browser to see all controls in action with interactive demonstrations.

## License

MIT License - See [LICENSE](LICENSE) file for details.
