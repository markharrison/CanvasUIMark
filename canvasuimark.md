# CanvasUIMark Documentation

CanvasUIMark is a JavaScript library for creating UI controls within an HTML Canvas element, specifically designed for simple web games.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Core Concepts](#core-concepts)
3. [Input Controls](#input-controls)
4. [Display Features](#display-features)
5. [Modal Dialogs](#modal-dialogs)
6. [Toast Notifications](#toast-notifications)
7. [Input Handling](#input-handling)
8. [Styling and Customization](#styling-and-customization)
9. [API Reference](#api-reference)

## Getting Started

### Installation

Include the library in your HTML file:

```html
<script type="module">
    import { CanvasUIMark } from './canvasuimark.js';
</script>
```

### Basic Setup

```html
<canvas id="gameCanvas" width="1280" height="720"></canvas>

<script type="module">
    import { CanvasUIMark } from './canvasuimark.js';
    
    const canvas = document.getElementById('gameCanvas');
    const ui = new CanvasUIMark(canvas, {
        backgroundColor: '#1a1a1a'
    });
    
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

## Core Concepts

### CanvasUIMark Instance

The main `CanvasUIMark` class manages all UI elements and input handling. The library is designed to be driven by an external animation loop for maximum flexibility.

```javascript
const ui = new CanvasUIMark(canvas, options);
```

**Options:**
- `backgroundColor` (string): Default background color (e.g., '#1a1a1a')
- `backgroundGradient` (array): Gradient definition (see [Display Features](#display-features))

**Animation Loop:**
The library does not include an internal animation loop. You must provide your own game loop that calls `update(deltaTime)` and `render()` each frame:

```javascript
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

### Adding Controls

Controls are added to the UI instance:

```javascript
import { Button } from './canvasuimark.js';
const button = new Button(x, y, label, callback, options);
ui.addControl(button);
```

### Removing Controls

Remove a specific control:

```javascript
ui.removeControl(button);
```

Remove all controls at once (useful for switching between game states or screens):

```javascript
ui.removeAllControls();
```

**Note:** `removeAllControls()` clears everything from the canvas except the background settings (color or gradient). This includes all interactive controls, text displays, images, modals, and toasts.

Remove all controls but keep toasts visible:

```javascript
ui.removeAllControlsExceptToasts();
```

**Note:** `removeAllControlsExceptToasts()` clears everything from the canvas except the background settings and toast notifications. This is useful when you want to switch screens but keep important notifications visible. Toasts will auto-dismiss after their timeout period.

### Focus Management

The library automatically manages focus and keyboard navigation:
- **Tab**: Move to next control
- **Shift+Tab**: Move to previous control
- Focus is visually indicated by a highlighted border

## Input Controls

### Button

A clickable button that executes a callback when activated.

```javascript
const button = new Button(
    100, 100,           // x, y position
    'Click Me!',        // label
    () => {             // callback
        console.log('Button clicked!');
    },
    {                   // options
        width: 200,             // width (default: 200)
        height: 50,             // height (default: 50)
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

A vertical or horizontal list of selectable items (buttons).

```javascript
const menu = new Menu(
    100, 100,           // x, y position
    [                   // menu items
        { label: 'New Game', callback: () => console.log('New Game') },
        { label: 'Load Game', callback: () => console.log('Load Game') },
        { label: 'Options', callback: () => console.log('Options') },
        { label: 'Exit', callback: () => console.log('Exit') }
    ],
    {                   // options
        width: 200,             // width of each item (default: 200)
        height: 50,             // height of each item (default: 50)
        backgroundColor: '#333333',
        focusColor: '#4CAF50',
        orientation: 'vertical', // 'vertical' or 'horizontal' (default: 'vertical')
        gap: 0                  // gap between items (default: 0)
    }
);
ui.addControl(menu);
```

**Navigation:**
- Mouse click on item
- Arrow Up/Down keys when focused (or Left/Right for horizontal menus)
- Enter or Space to select when focused
- Gamepad D-pad up/down and A button

### Toggle

A switch that can be turned on or off.

```javascript
const toggle = new Toggle(
    100, 100,           // x, y position
    'Sound Effects',    // label
    true,               // initial value
    (value) => {        // callback with current value
        console.log('Toggle is now:', value);
    },
    {                   // options
        width: 250,             // width (default: 250)
        height: 50,             // height (default: 50)
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
const textInput = new TextInput(
    100, 100,                  // x, y position
    'Enter your name...',      // placeholder text
    {                          // options
        width: 300,            // width (default: 300)
        height: 50,            // height (default: 50)
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

A group of mutually exclusive options displayed vertically or horizontally.

```javascript
// Vertical Radio (default)
const radio = new Radio(
    100, 100,                  // x, y position
    ['Easy', 'Medium', 'Hard', 'Expert'],  // items
    1,                         // initial selected index
    (index, value) => {        // callback
        console.log(`Selected: ${value} (index ${index})`);
    },
    {                          // options
        width: 250,            // width of each item (default: 250)
        height: 45,            // height of each item (default: 45)
        focusColor: '#4CAF50',
        orientation: 'vertical', // 'vertical' or 'horizontal' (default: 'vertical')
        gap: 0                 // gap between items (default: 0)
    }
);
ui.addControl(radio);

// Horizontal Radio
const horizontalRadio = new Radio(
    100, 100,
    ['Low', 'Medium', 'High'],
    1,
    (index, value) => {
        console.log(`Selected: ${value} (index ${index})`);
    },
    {
        width: 100,            // width of each item
        height: 45,            // height of each item
        orientation: 'horizontal',
        gap: 10                // gap between items
    }
);
ui.addControl(horizontalRadio);
```

**Navigation:**
- Mouse click on option
- Arrow Up/Down keys when focused (for vertical orientation)
- Arrow Left/Right keys when focused (for horizontal orientation)
- Gamepad D-pad left/right (navigates within control regardless of orientation)

### Carousel

A control for selecting one value at a time from a list, with arrow buttons to cycle through options.

```javascript
// Horizontal Carousel (default)
const carousel = new Carousel(
    100, 100,                      // x, y position
    ['Option A', 'Option B', 'Option C', 'Option D'],  // items
    0,                             // initial selected index
    (index, value) => {            // callback
        console.log(`Selected: ${value} (index ${index})`);
    },
    {                              // options
        width: 300,                // width (default: 250)
        height: 60,                // height (default: 60)
        focusColor: '#4CAF50',
        orientation: 'horizontal', // 'horizontal' or 'vertical' (default: 'horizontal')
        arrowSize: 12              // size of triangle arrows (default: 12)
    }
);
ui.addControl(carousel);

// Vertical Carousel
const verticalCarousel = new Carousel(
    100, 200,
    ['Red', 'Green', 'Blue'],
    1,
    (index, value) => {
        console.log(`Color selected: ${value}`);
    },
    {
        width: 200,
        height: 120,
        orientation: 'vertical'
    }
);
ui.addControl(verticalCarousel);
```

**Navigation:**
- Mouse click on arrow buttons to navigate
- Arrow Left/Right keys when focused (for horizontal orientation)
- Arrow Up/Down keys when focused (for vertical orientation)
- Gamepad D-pad left/right (navigates within control regardless of orientation)
- Displays triangle arrows pointing in the appropriate direction
- Shows only the currently selected value

### Slider

A slider for selecting numerical values within a range.

```javascript
const slider = new Slider(
    100, 100,          // x, y position
    0, 100,            // min, max values
    50,                // initial value
    5,                 // step increment
    'Volume',          // label
    (value) => {       // callback
        console.log('Value:', value);
    },
    {                  // options
        width: 300,            // width (default: 300)
        height: 80,            // height (default: 80)
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

### Panel

A non-interactive panel control used for visual grouping and background decoration.

```javascript
const panel = new Panel(
    100, 100,          // x, y position
    {                  // options
        width: 500,            // width (default: 500)
        height: 500,           // height (default: 500)
        backgroundColor: '#333333',
        borderColor: '#666666',
        borderWidth: 2,
        borderRadius: 10
    }
);
ui.addControl(panel);
```

**Features:**
- Non-interactive (does not receive focus or input)
- Useful for creating visual grouping of related controls
- Supports rounded corners with borderRadius option
- Can be used as a background layer behind other controls

**Common Use Cases:**
```javascript
// Panel behind a group of radio buttons
const radioPanel = new Panel(
    90, 90,
    {
        width: 270,
        height: 200,
        backgroundColor: '#444444',
        borderColor: '#4CAF50',
        borderWidth: 2,
        borderRadius: 10
    }
);
ui.addControl(radioPanel);

// Add radio buttons on top
const radio = new Radio(100, 100, ['Option 1', 'Option 2'], 0, callback);
ui.addControl(radio);
```

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

Set a gradient background with customizable direction:

```javascript
// Diagonal gradient (default) - from top-left to bottom-right
ui.setBackgroundGradient([
    { offset: 0, color: '#1a1a1a' },
    { offset: 0.5, color: '#2c3e50' },
    { offset: 1, color: '#34495e' }
], 'diagonal');

// Horizontal gradient - from left to right
ui.setBackgroundGradient([
    { offset: 0, color: '#1a1a1a' },
    { offset: 1, color: '#34495e' }
], 'horizontal');

// Vertical gradient - from top to bottom
ui.setBackgroundGradient([
    { offset: 0, color: '#1a1a1a' },
    { offset: 1, color: '#34495e' }
], 'vertical');
```

**Direction Options:**
- `'horizontal'` - Left to right gradient
- `'vertical'` - Top to bottom gradient
- `'diagonal'` - Top-left to bottom-right gradient (default)

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

### Keyboard Support

The library handles keyboard input automatically:

- **Tab** / **Shift+Tab**: Navigate between controls
- **Arrow Keys**: Navigate within menus/radios, adjust sliders, move cursor in text inputs
- **Enter** / **Space**: Activate buttons, toggles
- **Escape**: Trigger custom escape handler
- **Text Keys**: Type in text inputs
- **Backspace** / **Delete**: Edit text inputs
- **Home** / **End**: Move cursor in text inputs

### Mouse Support

Mouse interaction is fully supported:

- **Click**: Activate controls
- **Hover**: Visual feedback (on compatible controls)
- Automatically accounts for canvas scaling

### Gamepad Support

Basic gamepad controller support:

- **D-pad Up/Down**: Navigate between controls
- **D-pad Left/Right**: Adjust sliders
- **A Button (button 0)**: Activate control
- Auto-detects connected gamepads

### Escape Key Handler

Set a custom handler for the Escape key:

```javascript
ui.onEscape = () => {
    console.log('User pressed ESC');
    // Navigate to menu, pause game, etc.
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

### CanvasUIMark Class

#### Constructor

```javascript
new CanvasUIMark(canvas, options)
```

#### Methods

- `addControl(control)` - Add a control to the UI
- `removeControl(control)` - Remove a control from the UI
- `removeAllControls()` - Remove all controls, texts, images, modals, and toasts from the canvas (only background settings are preserved)
- `removeAllControlsExceptToasts()` - Remove all controls, texts, images, and modals from the canvas, but preserve toast notifications (only background settings and toasts are preserved)
- `addText(text, x, y, options)` - Add text display
- `addImage(image, x, y, width, height)` - Add image display
- `setBackground(color)` - Set solid background color
- `setBackgroundGradient(gradient, direction)` - Set gradient background with direction ('horizontal', 'vertical', or 'diagonal')
- `showModal(title, message, buttons)` - Display modal dialog
- `closeModal(modal)` - Close specific modal
- `showToast(message, type, duration)` - Display toast notification
- `update(deltaTime)` - Update all controls and animations (call each frame)
- `render()` - Render all UI elements to canvas (call each frame)

#### Properties

- `canvas` - Reference to canvas element
- `ctx` - Canvas 2D context
- `controls` - Array of all controls
- `onEscape` - Escape key callback function

### Control Classes

All available in `CanvasUIControls`:

- `Button(x, y, label, callback, options)`
- `Menu(x, y, items, options)`
- `Toggle(x, y, label, initialValue, callback, options)`
- `TextInput(x, y, placeholder, options)`
- `Radio(x, y, items, selectedIndex, callback, options)`
- `Slider(x, y, min, max, value, step, label, callback, options)`
- `Panel(x, y, options)`

## Examples

### Complete Example

```javascript
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
    540, 200,
    [
        { label: 'Start', callback: startGame },
        { label: 'Options', callback: showOptions },
        { label: 'Exit', callback: exitGame }
    ],
    { width: 200, height: 60 }
);
ui.addControl(mainMenu);

// Add settings toggle
const musicToggle = new Toggle(
    440, 450,
    'Background Music',
    true,
    (enabled) => {
        if (enabled) startMusic();
        else stopMusic();
    },
    { width: 400, height: 50 }
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
```

## Best Practices

1. **Canvas Size**: Use the recommended 1280x720 for optimal display, but the library works with any size
2. **Responsive Design**: Always make your canvas scale with CSS to support different screen sizes
3. **Control Placement**: Leave adequate spacing between controls for better usability
4. **Focus Order**: Add controls in the order you want users to tab through them
5. **Callbacks**: Keep callback functions lightweight; perform heavy operations asynchronously
6. **Toast Duration**: Use 2-3 seconds for info messages, 4-5 seconds for important warnings
7. **Modal Usage**: Use modals sparingly; they block all other interaction
8. **Testing**: Test with keyboard, mouse, and gamepad if possible

## Troubleshooting

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
- Check browser console for "Gamepad connected" message
- Not all browsers support gamepad API

### Performance issues

- Limit the number of controls (recommended: < 50)
- Optimize callback functions
- Consider using separate canvases for complex scenes
- Control your game loop frame rate if needed (e.g., skip rendering if not visible)

## License

MIT License - See LICENSE file for details.
