# CanvasUIMark Input Architecture

## Overview

**CanvasInputMark** is a generic input handler for HTML Canvas applications. It captures keyboard, mouse, touch, and gamepad input, and broadcasts events to subscribers using a publisher-subscriber pattern. It is designed for use by CanvasUIMark, but can also be used by any other system or game that needs input management.

**Key Features:**

-   Generic: Not tied to CanvasUIMark; usable by any component needing input
-   Publisher-subscriber: Multiple subscribers can receive input events
-   Supports keyboard, mouse, touch, and gamepad
-   Shares input state objects by reference

It is used by CanvasUIMark, but can be used by any other system needing keyboard, mouse, or gamepad input.

## Architecture

### CanvasInputMark (canvasinputmark.js)

**Role**: Input Publisher - Captures all input events and broadcasts to subscribers

**Features**:

-   Captures keyboard events (keydown, keyup)
-   Captures mouse events (move, down, up, click, enter)
-   Captures touch events (touchstart, touchmove, touchend)
-   Captures gamepad events (connected, button presses, thumbstick axes)
-   Maintains state objects: `keys`, `mouse`, `touches`, `gamepad`
-   Broadcasts events to all registered subscribers
-   Returns unsubscribe function for cleanup

**API**:

```javascript
const inputManager = new CanvasInputMark(canvas);

// Subscribe any object - input manager checks which methods exist
const subscription = inputManager.subscribe({
    onKeyDown: (e) => console.log('Key pressed:', e.key),
    onMouseClick: (e, x, y) => console.log('Clicked at:', x, y),
    onTouchStart: (e, touches) => console.log('Touch started:', touches.length),
});

// Or just subscribe an object with only the methods you want
const myHandler = {
    onGamepadButton: (buttonIndex) => console.log('Button:', buttonIndex),
    onGamepadAxis: (axisData) => console.log('Thumbstick:', axisData.leftStick),
    onMouseEnter: (e, x, y) => console.log('Mouse entered at:', x, y),
};
const subscription2 = inputManager.subscribe(myHandler);

// Access shared state
console.log(inputManager.keys); // { 'KeyW': true, ... }
console.log(inputManager.mouse); // { x: 100, y: 200, buttons: 1 }
console.log(inputManager.touches); // [{ id: 0, x: 100, y: 200 }, ...]
console.log(inputManager.gamepad); // GamepadAPI object

// Unsubscribe when done
subscription.unsubscribe();
```

### CanvasUIMark (canvasuimark.js)

**Role**: Input Subscriber - Receives and handles input events

**Required Setup**:

```javascript
const inputManager = new CanvasInputMark(canvas);
const ui = new CanvasUIMark(canvas, {
    input: inputManager, // REQUIRED
});
```

-   Subscribes to inputManager
-   Shares state objects by reference
-   Automatically unsubscribes on destroy
-   Throws error if no input manager provided

## Benefits

1. **Decoupling**: Input capture is separate from input handling
2. **Reusability**: CanvasInputMark can be used by multiple components
3. **Extensibility**: Easy to add new subscribers
4. **State Sharing**: All subscribers share the same input state
5. **Simplicity**: Single, consistent pattern - no dual modes to maintain
6. **Flexible**: Subscribers only need to provide the event handlers they care about

## Example Usage

### Basic Setup (Required)

```javascript
const inputManager = new CanvasInputMark(canvas);
const ui = new CanvasUIMark(canvas, { input: inputManager });

// Another component can also subscribe
const gameLogic = {
    onKeyDown: (e) => console.log('Game received key:', e.key),
    onMouseClick: (e, x, y) => console.log('Game received click:', x, y),
};
const subscription = inputManager.subscribe(gameLogic);
```

### Multiple Subscribers

```javascript
const inputManager = new CanvasInputMark(canvas);

// UI subscriber
const ui = new CanvasUIMark(canvas, { input: inputManager });

// Debug subscriber - only handles keys and mouse movement
const debugger = {
    onKeyDown: (e) => console.log('Key pressed:', e.key),
    onMouseMove: (x, y) => console.log('Mouse at:', x, y),
};
inputManager.subscribe(debugger);

// Analytics subscriber - only handles clicks and gamepad
const analytics = {
    onMouseClick: (e, x, y) => trackClick(x, y),
    onGamepadButton: (index) => trackGamepadUsage(index),
    onGamepadAxis: (axisData) => trackThumbstickUsage(axisData),
    onTouchStart: (e, touches) => trackTouchUsage(touches),
};
inputManager.subscribe(analytics);

// Minimal subscriber - just one method
const escapeHandler = {
    onKeyDown: (e) => {
        if (e.key === 'Escape') exitGame();
    },
};
inputManager.subscribe(escapeHandler);
```

## Available Event Handlers

Subscribers can implement any of these optional methods:

-   **Keyboard**: `onKeyDown(e)`, `onKeyUp(e)`
-   **Mouse**: `onMouseMove(e, x, y)`, `onMouseDown(e)`, `onMouseUp(e)`, `onMouseClick(e, x, y)`, `onMouseEnter(e, x, y)`
-   **Touch**: `onTouchStart(e, touches)`, `onTouchMove(e, touches)`, `onTouchEnd(e, touches)`
-   **Gamepad**: `onGamepadConnected(e)`, `onGamepadButton(buttonIndex)`, `onGamepadAxis(axisData)`

## Gamepad Thumbstick Handling

The `onGamepadAxis` handler provides detailed thumbstick data with built-in deadzone support:

```javascript
const gamepadHandler = {
    onGamepadAxis: (axisData) => {
        const { leftStick, rightStick, deadZone } = axisData;

        // axisData structure:
        // {
        //   leftStick: { x: -1 to 1, y: -1 to 1 },
        //   rightStick: { x: -1 to 1, y: -1 to 1 },
        //   deadZone: 0.3
        // }

        // Handle left stick movement (common for character movement)
        if (leftStick.x < -deadZone) {
            // Move left
            player.moveLeft();
        } else if (leftStick.x > deadZone) {
            // Move right
            player.moveRight();
        }

        if (leftStick.y < -deadZone) {
            // Move up
            player.moveUp();
        } else if (leftStick.y > deadZone) {
            // Move down
            player.moveDown();
        }

        // Handle right stick (common for camera/aiming)
        if (Math.abs(rightStick.x) > deadZone || Math.abs(rightStick.y) > deadZone) {
            camera.rotate(rightStick.x * sensitivity, rightStick.y * sensitivity);
        }
    },
};
inputManager.subscribe(gamepadHandler);
```

**Key Features:**

-   **Deadzone**: Built-in 0.3 deadzone prevents stick drift from triggering movement
-   **Change Detection**: Only fires when sticks move significantly (> 0.1 change)
-   **Both Sticks**: Provides data for both left and right thumbsticks
-   **Normalized Values**: Stick values are normalized from -1 to 1
-   **Performance**: Efficient - only notifies on actual stick movement

## Implementation Notes

-   Subscribers can be **any object** - input manager checks which methods exist
-   Only implement the event handlers you actually need from the list above
-   Input manager calls `subscriber.methodName()` only if the method exists
-   State objects are shared by reference (no duplication)
    Touch events provide canvas-relative coordinates: `(x, y)`
-   Mouse and touch positions are canvas-relative and account for scaling
-   Touch events use `{passive: false}` and call `preventDefault()` automatically
-   Gamepad axes (thumbsticks) use deadzone (0.3) to prevent drift and only fire on significant changes
-   Gamepad polling must be triggered by calling `inputManager.update()` each frame
-   Subscription cleanup is automatic when CanvasUIMark is destroyed
-   CanvasUIMark will throw an error if instantiated without an input manager

## Required Setup Steps

1. **Import both classes**:

    ```javascript
    import { CanvasUIMark } from './canvasuimark.js';
    import { CanvasInputMark } from './canvasinputmark.js';
    ```

2. **Create input manager first**:

    ```javascript
    const inputManager = new CanvasInputMark(canvas);
    ```

3. **Pass to CanvasUIMark** (required):

    ```javascript
    const ui = new CanvasUIMark(canvas, { input: inputManager });
    ```

4. **Update input in game loop**:

    ```javascript
    function gameLoop(timestamp) {
        const deltaTime = timestamp - lastTimestamp;
        lastTimestamp = timestamp;

        ui.update(deltaTime); // Calls inputManager.update() internally
        ui.draw();

        requestAnimationFrame(gameLoop);
    }
    ```

## Custom Input Handlers

You can create your own input handler instead of using CanvasInputMark. It must implement:

```javascript
class CustomInputHandler {
    constructor(canvas) {
        this.keys = {}; // Object tracking key states
        this.mouse = { x: 0, y: 0, buttons: 0 }; // Mouse state
        this.touches = []; // Array of touch objects: [{id, x, y}, ...]
        this.gamepad = null; // Gamepad reference
    }

    // Subscribe method that returns {unsubscribe} object
    subscribe(subscriber) {
        // Store subscriber and call its methods on input events (if they exist):
        // subscriber.onKeyDown(e)
        // subscriber.onKeyUp(e)
        // subscriber.onMouseMove(e, x, y)
        // subscriber.onMouseDown(e)
        // subscriber.onMouseUp(e)
        // subscriber.onMouseClick(e, x, y)
        // subscriber.onMouseEnter(e, x, y)
        // subscriber.onTouchStart(e, touches)
        // subscriber.onTouchMove(e, touches)
        // subscriber.onTouchEnd(e, touches)
        // subscriber.onGamepadConnected(e)
        // subscriber.onGamepadButton(buttonIndex)
        // subscriber.onGamepadAxis(axisData)

        return {
            unsubscribe: () => {
                /* remove subscriber */
            },
        };
    }

    update() {
        // Called each frame for polling (e.g., gamepad)
    }
}
```
