# CanvasUIMark Documentation

CanvasUIMark is a JavaScript library for creating UI controls within an HTML Canvas element, specifically designed for simple web games.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Architecture](#architecture)
3. [Core Concepts](#core-concepts)
4. [Input Handling](#input-handling)
5. [Input Controls](#input-controls)
6. [Display Features](#display-features)
7. [Modal Dialogs](#modal-dialogs)
8. [Toast Notifications](#toast-notifications)
9. [Styling and Customization](#styling-and-customization)
10. [API Reference](#api-reference)

## Getting Started

### Installation

Include the library in your HTML file:

```html
<script type="module">
    import { CanvasUIMark, CanvasUIMarkInputHandler } from './canvasuimark.js';
</script>
```

### Basic Setup

```html
<canvas id="gameCanvas" width="1280" height="720"></canvas>

<script type="module">
    import { CanvasUIMark, Button } from './canvasuimark.js';
    
    const canvas = document.getElementById('gameCanvas');
    const ui = new CanvasUIMark(canvas, {
        backgroundColor: '#1a1a1a'
    });
    
    // Add a button
    const button = new Button(100, 100, 200, 50, 'Click Me!', () => {
        ui.showToast('Button clicked!', 'success');
    });
    ui.addControl(button);
    
    // Create your animation loop
    let lastFrameTime = 0;
    
    function gameLoop(timestamp) {
        const deltaTime = timestamp - lastFrameTime;
        lastFrameTime = timestamp;
        
        // Update and render
        ui.update(deltaTime);
        ui.render();
        
        requestAnimationFrame(gameLoop);
    }
    
    requestAnimationFrame(gameLoop);
</script>
```

### Making Canvas Responsive

To make your canvas scale with screen width:

```css
.canvas-container {
    width: 100%;
    max-width: 1280px;
    aspect-ratio: 16 / 9;
}

#gameCanvas {
    width: 100%;
    height: 100%;
}
```

The library automatically handles mouse position calculations for scaled canvases.

## Architecture

CanvasUIMark uses a modern, flexible architecture that gives you full control over the rendering loop:

### External Animation Loop

Unlike many UI libraries, CanvasUIMark **does not manage its own animation loop**. Instead, you create your own loop using `requestAnimationFrame` and call the library's `update()` and `render()` methods each frame.

**Benefits:**
- Full control over frame timing and updates
- Easy integration with existing game engines
- Ability to pause/resume rendering independently
- Better performance management
- Consistent with modern game development patterns

### CanvasUIMarkInputHandler Class

The `CanvasUIMarkInputHandler` class provides a clean separation between input logic and UI functionality:

- Handles keyboard, mouse, and gamepad events
- Provides callbacks for all input events
- Can be used independently of CanvasUIMark
- Includes proper cleanup via `destroy()` method

```javascript
import { CanvasUIMarkInputHandler } from './canvasuimark.js';

const inputHandler = new CanvasUIMarkInputHandler(canvas);

inputHandler.onKeyDown = (e) => {
    console.log('Key pressed:', e.key);
};

inputHandler.onClick = (e, pos) => {
    console.log('Clicked at:', pos.x, pos.y);
};

// In your game loop
inputHandler.updateGamepad();

// Cleanup when done
inputHandler.destroy();
```

### CanvasUIMark Class

The main class manages UI controls, state, and rendering:

- **update(deltaTime)**: Updates control animations and input state
- **render()**: Renders all UI elements to the canvas
- **destroy()**: Cleans up resources and event listeners

## Core Concepts

### CanvasUIMark Instance

The main `CanvasUIMark` class manages all UI elements, input handling, and rendering.

```javascript
const ui = new CanvasUIMark(canvas, options);
```

**Options:**
- `backgroundColor` (string): Default background color (e.g., '#1a1a1a')
- `backgroundGradient` (array): Gradient definition (see [Display Features](#display-features))

### Adding Controls

Controls are added to the UI instance:

```javascript
import { Button } from './canvasUImark.js';
const button = new Button(x, y, width, height, label, callback);
ui.addControl(button);
```

### Focus Management

The library automatically manages focus and keyboard navigation:
- **Tab**: Move to next control
- **Shift+Tab**: Move to previous control
- Focus is visually indicated by a highlighted border

## Input Controls

### Button

A clickable button that executes a callback when activated.

```javascript
const button = new CanvasUIControls.Button(
    100, 100,           // x, y position
    200, 50,            // width, height
    'Click Me!',        // label
    () => {             // callback
        console.log('Button clicked!');
    },
    {                   // optional styling
        backgroundColor: '#333333',
        textColor: '#ffffff',
        focusColor: '#4CAF50'
    }
);
ui.addControl(button);
```

**Activation:**
- Mouse click
- Enter or Space key when focused
- Gamepad A button when focused

### Menu

A vertical list of selectable items (buttons).

```javascript
const menu = new CanvasUIControls.Menu(
    100, 100,           // x, y position
    200, 50,            // width, item height
    [                   // menu items
        { label: 'New Game', callback: () => console.log('New Game') },
        { label: 'Load Game', callback: () => console.log('Load Game') },
        { label: 'Options', callback: () => console.log('Options') },
        { label: 'Exit', callback: () => console.log('Exit') }
    ],
    {                   // optional styling
        backgroundColor: '#333333',
        focusColor: '#4CAF50'
    }
);
ui.addControl(menu);
```

**Navigation:**
- Mouse click on item
- Arrow Up/Down keys when focused
- Enter or Space to select when focused
- Gamepad D-pad up/down and A button

### Toggle

A switch that can be turned on or off.

```javascript
const toggle = new CanvasUIControls.Toggle(
    100, 100,           // x, y position
    250, 50,            // width, height
    'Sound Effects',    // label
    true,               // initial value
    (value) => {        // callback with current value
        console.log('Toggle is now:', value);
    },
    {                   // optional styling
        focusColor: '#4CAF50'
    }
);
ui.addControl(toggle);
```

**Activation:**
- Mouse click
- Enter or Space key when focused
- Gamepad A button when focused

### TextInput

A text input field for user text entry.

```javascript
const textInput = new CanvasUIControls.TextInput(
    100, 100,                  // x, y position
    300, 50,                   // width, height
    'Enter your name...',      // placeholder text
    {                          // optional styling
        backgroundColor: '#333333',
        textColor: '#ffffff'
    }
);
ui.addControl(textInput);

// Get the value
console.log(textInput.value);
```

**Interaction:**
- Click to focus and position cursor
- Type to enter text
- Backspace/Delete to remove text
- Arrow keys to move cursor
- Home/End keys

### Radio

A group of mutually exclusive options.

```javascript
const radio = new CanvasUIControls.Radio(
    100, 100,                  // x, y position
    250, 45,                   // width, item height
    ['Easy', 'Medium', 'Hard', 'Expert'],  // options
    1,                         // initial selected index
    (index, value) => {        // callback
        console.log(`Selected: ${value} (index ${index})`);
    },
    {                          // optional styling
        focusColor: '#4CAF50'
    }
);
ui.addControl(radio);
```

**Navigation:**
- Mouse click on option
- Arrow Up/Down keys when focused
- Gamepad D-pad up/down

### Slider

A slider for selecting numerical values within a range.

```javascript
const slider = new CanvasUIControls.Slider(
    100, 100,          // x, y position
    300, 80,           // width, height
    0, 100,            // min, max values
    50,                // initial value
    5,                 // step increment
    'Volume',          // label
    (value) => {       // callback
        console.log('Value:', value);
    },
    {                  // optional styling
        focusColor: '#4CAF50'
    }
);
ui.addControl(slider);
```

**Interaction:**
- Mouse click on track to set value
- Arrow Left/Right keys when focused
- Gamepad D-pad left/right when focused
- Displays current value

## Display Features

### Text Display

Add static text to the canvas:

```javascript
ui.addText('Hello World', 640, 100, {
    font: 'bold 24px Arial',
    color: '#ffffff',
    align: 'center',      // 'left', 'center', 'right'
    baseline: 'top'       // 'top', 'middle', 'bottom'
});
```

### Image Display

Add images to the canvas:

```javascript
const image = new Image();
image.src = 'path/to/image.png';
image.onload = () => {
    ui.addImage(image, 100, 100, 200, 150);  // x, y, width, height
};
```

### Background Color

Set a solid background color:

```javascript
ui.setBackground('#1a1a1a');
```

### Background Gradient

Set a gradient background:

```javascript
ui.setBackgroundGradient([
    { offset: 0, color: '#1a1a1a' },
    { offset: 0.5, color: '#2c3e50' },
    { offset: 1, color: '#34495e' }
]);
```

## Modal Dialogs

Display modal dialog boxes with a semi-transparent overlay:

```javascript
ui.showModal(
    'Confirm Action',                    // title
    'Are you sure you want to proceed?', // message
    [                                    // buttons
        { 
            label: 'Yes', 
            callback: () => console.log('Confirmed') 
        },
        { 
            label: 'No', 
            callback: () => console.log('Cancelled') 
        }
    ]
);
```

**Features:**
- Semi-transparent background overlay
- Word-wrapped message text
- Multiple button support
- Click outside or button to close
- Automatic centering

**Default Modal:**
If no buttons are provided, a single "OK" button is shown.

## Toast Notifications

Display temporary notification messages in the corner:

```javascript
ui.showToast(
    'Operation successful!',  // message
    'success',                // type: 'info', 'success', 'warning', 'error'
    3000                      // duration in milliseconds
);
```

**Toast Types:**
- `info` - Blue with info icon (ℹ)
- `success` - Green with checkmark (✓)
- `warning` - Orange with warning icon (⚠)
- `error` - Red with X icon (✕)

**Features:**
- Stacks multiple toasts vertically
- Auto-dismisses after duration
- Icon with type-specific color
- Word-wrapped text

## Input Handling

CanvasUIMark includes a `CanvasUIMarkInputHandler` class that manages all keyboard, mouse, and gamepad input. This class is used internally by CanvasUIMark but can also be used independently for custom input handling.

### Keyboard Support

The library handles keyboard input through the CanvasUIMarkInputHandler:

- **Tab** / **Shift+Tab**: Navigate between controls
- **Arrow Keys**: Navigate within menus/radios, adjust sliders, move cursor in text inputs
- **Enter** / **Space**: Activate buttons, toggles
- **Escape**: Trigger custom escape handler
- **Text Keys**: Type in text inputs
- **Backspace** / **Delete**: Edit text inputs
- **Home** / **End**: Move cursor in text inputs

### Mouse Support

Mouse interaction is fully supported through CanvasUIMarkInputHandler:

- **Click**: Activate controls
- **Move**: Track mouse position
- Automatically accounts for canvas scaling
- All mouse coordinates are converted to canvas space

### Gamepad Support

Basic gamepad controller support:

- **D-pad Up/Down**: Navigate between controls
- **D-pad Left/Right**: Adjust sliders, navigate horizontal menus
- **A Button (button 0)**: Activate control
- **B Button (button 1)**: Acts like Escape key
- Auto-detects connected gamepads
- **Note**: Call `inputHandler.updateGamepad()` or `ui.update()` in your game loop to poll gamepad state

### Escape Key Handler

Set a custom handler for the Escape key:

```javascript
ui.onEscape = () => {
    console.log('User pressed ESC');
    // Navigate to menu, pause game, etc.
};
```

### Custom Input Handling

You can access the CanvasUIMarkInputHandler directly for custom behavior:

```javascript
// Access the input handler
const inputHandler = ui.inputHandler;

// Check if a key is pressed
if (inputHandler.isKeyPressed('w')) {
    movePlayerUp();
}

// Get current mouse position
const mousePos = inputHandler.getMousePosition();

// Add custom key handler
const originalKeyDown = inputHandler.onKeyDown;
inputHandler.onKeyDown = (e) => {
    // Your custom logic
    if (e.key === 'p') {
        pauseGame();
    }
    // Call original handler
    if (originalKeyDown) originalKeyDown(e);
};
```

## Styling and Customization

### Control Options

All controls accept an `options` object for styling:

```javascript
const options = {
    backgroundColor: '#333333',  // Background color
    borderColor: '#666666',      // Normal border color
    textColor: '#ffffff',        // Text color
    focusColor: '#4CAF50',       // Focused border/highlight color
    hoverColor: '#555555',       // Hover state color
    font: '16px Arial',          // Font style
    borderWidth: 2,              // Border thickness
    padding: 10                  // Internal padding
};
```

### Fonts

Customize fonts using CSS font strings:

```javascript
{
    font: 'bold 20px Arial'
    font: '18px "Courier New"'
    font: 'italic 16px Georgia'
}
```

### Colors

Colors can be specified using:
- Hex: `'#4CAF50'`
- RGB: `'rgb(76, 175, 80)'`
- RGBA: `'rgba(76, 175, 80, 0.8)'`
- Named: `'green'`, `'red'`, etc.

## API Reference

### CanvasUIMarkInputHandler Class

Handles keyboard, mouse, and gamepad input.

#### Constructor

```javascript
new CanvasUIMarkInputHandler(canvas, options)
```

#### Methods

- `updateGamepad()` - Updates gamepad state (call this in your game loop)
- `isKeyPressed(key)` - Returns true if the specified key is currently pressed
- `getMousePosition()` - Returns current mouse position {x, y}
- `getGamepad()` - Returns the current gamepad object
- `destroy()` - Removes all event listeners and cleans up

#### Callbacks

Set these properties to handle events:

- `onKeyDown(event)` - Called when a key is pressed
- `onKeyUp(event)` - Called when a key is released
- `onMouseMove(event, position)` - Called when mouse moves
- `onMouseDown(event)` - Called when mouse button is pressed
- `onMouseUp(event)` - Called when mouse button is released
- `onClick(event, position)` - Called when mouse is clicked
- `onGamepadButton(buttonIndex)` - Called when gamepad button is pressed

### CanvasUIMark Class

Main UI management class.

#### Constructor

```javascript
new CanvasUIMark(canvas, options)
```

**Options:**
- `backgroundColor` (string): Background color (default: '#1a1a1a')
- `backgroundGradient` (array): Gradient definition (see [Display Features](#display-features))

#### Methods

**Core Methods:**
- `update(deltaTime)` - Update UI state and animations (call each frame)
- `render()` - Render UI to canvas (call each frame)
- `destroy()` - Clean up resources and event listeners

**Control Management:**
- `addControl(control)` - Add a control to the UI
- `removeControl(control)` - Remove a control from the UI

**Display Methods:**
- `addText(text, x, y, options)` - Add static text display
- `addImage(image, x, y, width, height)` - Add image display
- `setBackground(color)` - Set solid background color
- `setBackgroundGradient(gradient)` - Set gradient background

**Dialog Methods:**
- `showModal(title, message, buttons, options)` - Display modal dialog
- `closeModal(modal)` - Close specific modal
- `showToast(message, type, duration)` - Display toast notification

#### Properties

- `canvas` - Reference to canvas element
- `ctx` - Canvas 2D context
- `controls` - Array of all controls
- `inputHandler` - Reference to CanvasUIMarkInputHandler instance
- `onEscape` - Escape key callback function

### Control Classes

All available control classes exported from the library:

- `Button(x, y, width, height, label, callback, options)`
- `Menu(x, y, width, itemHeight, items, options)`
- `Toggle(x, y, width, height, label, initialValue, callback, options)`
- `TextInput(x, y, width, height, placeholder, options)`
- `Radio(x, y, width, itemHeight, options, selectedIndex, callback, options)`
- `Slider(x, y, width, height, min, max, value, step, label, callback, options)`
- `Panel(x, y, width, height, options)`

See [Input Controls](#input-controls) section for detailed information on each control.

## Examples

### Complete Example

```javascript
import { CanvasUIMark, Button, Menu, Toggle } from './canvasuimark.js';

// Initialize
const canvas = document.getElementById('gameCanvas');
const ui = new CanvasUIMark(canvas);

// Add title
ui.addText('My Game', 640, 50, {
    font: 'bold 48px Arial',
    align: 'center'
});

// Add menu
const mainMenu = new Menu(
    540, 200, 200, 60,
    [
        { label: 'Start', callback: startGame },
        { label: 'Options', callback: showOptions },
        { label: 'Exit', callback: exitGame }
    ]
);
ui.addControl(mainMenu);

// Add settings toggle
const musicToggle = new Toggle(
    440, 450, 400, 50,
    'Background Music',
    true,
    (enabled) => {
        if (enabled) startMusic();
        else stopMusic();
    }
);
ui.addControl(musicToggle);

// Set escape handler
ui.onEscape = () => {
    ui.showModal('Pause', 'Game Paused', [
        { label: 'Resume', callback: () => {} },
        { label: 'Quit', callback: exitGame }
    ]);
};

// Show welcome message
ui.showToast('Welcome!', 'success', 3000);

// Create animation loop
let lastFrameTime = 0;

function gameLoop(timestamp) {
    const deltaTime = timestamp - lastFrameTime;
    lastFrameTime = timestamp;
    
    // Update and render UI
    ui.update(deltaTime);
    ui.render();
    
    requestAnimationFrame(gameLoop);
}

// Start the loop
requestAnimationFrame(gameLoop);
```

### Using CanvasUIMarkInputHandler Independently

```javascript
import { CanvasUIMarkInputHandler } from './canvasuimark.js';

const canvas = document.getElementById('canvas');
const inputHandler = new CanvasUIMarkInputHandler(canvas);

// Set up callbacks
inputHandler.onKeyDown = (e) => {
    if (e.key === 'w') movePlayerUp();
    if (e.key === 's') movePlayerDown();
};

inputHandler.onClick = (e, pos) => {
    shootAt(pos.x, pos.y);
};

// In your game loop
function gameLoop() {
    // Update gamepad state
    inputHandler.updateGamepad();
    
    // Check gamepad input
    const gamepad = inputHandler.getGamepad();
    if (gamepad) {
        // Use gamepad axes for movement
        const leftStick = gamepad.axes[0];
        // ... handle movement
    }
    
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
```

## Best Practices

1. **Animation Loop**: Always create your own animation loop using `requestAnimationFrame` and call `ui.update(deltaTime)` and `ui.render()` each frame
2. **Delta Time**: Pass accurate deltaTime to `update()` for smooth animations independent of frame rate
3. **Canvas Size**: Use the recommended 1280x720 for optimal display, but the library works with any size
4. **Responsive Design**: Always make your canvas scale with CSS to support different screen sizes
5. **Control Placement**: Leave adequate spacing between controls for better usability
6. **Focus Order**: Add controls in the order you want users to tab through them
7. **Callbacks**: Keep callback functions lightweight; perform heavy operations asynchronously
8. **Toast Duration**: Use 2-3 seconds for info messages, 4-5 seconds for important warnings
9. **Modal Usage**: Use modals sparingly; they block all other interaction
10. **Cleanup**: Call `ui.destroy()` when done to properly clean up event listeners
11. **Testing**: Test with keyboard, mouse, and gamepad if possible
12. **Gamepad Polling**: Remember to call `ui.update()` in your loop to poll gamepad state

## Troubleshooting

### Animation not updating

Make sure you're calling both `update()` and `render()` in your animation loop:

```javascript
function gameLoop(timestamp) {
    const deltaTime = timestamp - lastFrameTime;
    lastFrameTime = timestamp;
    
    ui.update(deltaTime);  // Update state
    ui.render();           // Render to canvas
    
    requestAnimationFrame(gameLoop);
}
```

### Mouse clicks not registering correctly when canvas is scaled

The library automatically handles canvas scaling. Ensure your canvas uses CSS for scaling:

```css
#gameCanvas {
    width: 100%;
    height: 100%;
}
```

### Controls not receiving keyboard input

Ensure focus management is working:
- Call `ui.addControl()` to add controls properly
- Check browser console for errors
- Verify the canvas or page has focus

### Gamepad not working

- Ensure a gamepad is connected before the page loads
- Call `ui.update()` or `inputHandler.updateGamepad()` in your game loop
- Check browser console for "Gamepad connected" message
- Not all browsers support gamepad API

### Performance issues

- Limit the number of controls (recommended: < 50)
- Optimize callback functions
- Consider using separate canvases for complex scenes
- Adjust frame rate if needed in your animation loop

## License

MIT License - See LICENSE file for details.
