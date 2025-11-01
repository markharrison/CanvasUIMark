/**
 * MarkJSInput - Input management system for canvas applications
 * Handles keyboard, mouse, and gamepad input with publisher-subscriber pattern
 * @author Mark Harrison
 */

'use strict';

export class MarkJSInput {
    constructor(canvas) {
        this.canvas = canvas;

        // Input state (queryable by anyone)
        this.keys = {};
        this.gamepad = null;
        this.lastGamepadButtons = [];
        this.lastGamepadAxes = []; // Track previous axis values for change detection

        // Subscribers list
        this.subscribers = [];

        // Bind event handlers to preserve 'this' context
        this.boundHandleKeyDown = (e) => this._handleKeyDown(e);
        this.boundHandleKeyUp = (e) => this._handleKeyUp(e);
        this.boundHandleMouseMove = (e) => this._handleMouseMove(e);
        this.boundHandleMouseDown = (e) => this._handleMouseDown(e);
        this.boundHandleMouseUp = (e) => this._handleMouseUp(e);
        this.boundHandleMouseEnter = (e) => this._handleMouseEnter(e);
        this.boundHandleMouseClick = (e) => this._handleMouseClick(e);
        this.boundHandleContextMenu = (e) => this._handleContextMenu(e);
        this.boundHandleTouchStart = (e) => this._handleTouchStart(e);
        this.boundHandleTouchMove = (e) => this._handleTouchMove(e);
        this.boundHandleTouchEnd = (e) => this._handleTouchEnd(e);
        this.boundHandleGamepadConnected = (e) => this._handleGamepadConnected(e);

        // Setup DOM event listeners
        this._setupEventListeners();
    }

    subscribe(subscriber) {
        if (!this.subscribers.includes(subscriber)) {
            this.subscribers.push(subscriber);
        }

        // console.log(
        //     `MarkJSInput: Subscriber added. Total subscribers: ${this.subscribers.length} | Current Subscribers: ${this.subscribers
        //         .map((sub) => sub.name || sub.constructor.name)
        //         .sort()
        //         .join(', ')}`
        // );

        return {
            unsubscribe: () => this.unsubscribe(subscriber),
        };
    }

    unsubscribe(subscriber) {
        const index = this.subscribers.indexOf(subscriber);
        if (index > -1) {
            this.subscribers.splice(index, 1);
        }

        // console.log(
        //     `MarkJSInput: Subscriber removed. Total subscribers: ${this.subscribers.length} | Current Subscribers: ${this.subscribers
        //         .map((sub) => sub.name || sub.constructor.name)
        //         .sort()
        //         .join(', ')}`
        // );
    }

    /**
     * Convert screen/viewport coordinates to canvas coordinate system
     * Accounts for canvas scaling when the visual size differs from internal dimensions
     * Works with both mouse events and touch objects
     */
    getCanvasCoordinates(clientX, clientY) {
        const rect = this.canvas.getBoundingClientRect();

        // Get the visual (rendered) size of the canvas
        const visualWidth = rect.width;
        const visualHeight = rect.height;

        // Get the internal (logical) size of the canvas
        const internalWidth = this.canvas.width;
        const internalHeight = this.canvas.height;

        // Calculate scale factors
        const scaleX = internalWidth / visualWidth;
        const scaleY = internalHeight / visualHeight;

        // Convert viewport coordinates to canvas coordinates
        let canvasX = (clientX - rect.left) * scaleX;
        let canvasY = (clientY - rect.top) * scaleY;

        // Clamp coordinates to canvas bounds (prevents negative coordinates)
        canvasX = Math.max(0, Math.min(Math.round(canvasX), internalWidth));
        canvasY = Math.max(0, Math.min(Math.round(canvasY), internalHeight));

        return { x: canvasX, y: canvasY };
    }

    // Update gamepad state (call each frame)
    update() {
        this.updateGamepad();
    }

    // Clean up event listeners
    destroy() {
        window.removeEventListener('keydown', this.boundHandleKeyDown);
        window.removeEventListener('keyup', this.boundHandleKeyUp);
        this.canvas.removeEventListener('mousemove', this.boundHandleMouseMove);
        this.canvas.removeEventListener('mousedown', this.boundHandleMouseDown);
        this.canvas.removeEventListener('mouseup', this.boundHandleMouseUp);
        this.canvas.removeEventListener('mouseenter', this.boundHandleMouseEnter);
        this.canvas.removeEventListener('click', this.boundHandleMouseClick);
        this.canvas.removeEventListener('contextmenu', this.boundHandleContextMenu);
        this.canvas.removeEventListener('touchstart', this.boundHandleTouchStart);
        this.canvas.removeEventListener('touchmove', this.boundHandleTouchMove);
        this.canvas.removeEventListener('touchend', this.boundHandleTouchEnd);
        window.removeEventListener('gamepadconnected', this.boundHandleGamepadConnected);

        this.subscribers = [];
        this.keys = {};
        this.mouse = { x: 0, y: 0, buttons: 0 };
        this.gamepad = null;
        this.lastGamepadButtons = [];
        this.lastGamepadAxes = [];
    }

    // Private: Setup DOM event listeners
    _setupEventListeners() {
        window.addEventListener('keydown', this.boundHandleKeyDown);
        window.addEventListener('keyup', this.boundHandleKeyUp);
        this.canvas.addEventListener('mousemove', this.boundHandleMouseMove, false);
        this.canvas.addEventListener('mousedown', this.boundHandleMouseDown, false);
        this.canvas.addEventListener('mouseup', this.boundHandleMouseUp, false);
        this.canvas.addEventListener('mouseenter', this.boundHandleMouseEnter, false);
        this.canvas.addEventListener('click', this.boundHandleMouseClick, false);
        this.canvas.addEventListener('contextmenu', this.boundHandleContextMenu, false);
        this.canvas.addEventListener('touchstart', this.boundHandleTouchStart, { passive: false });
        this.canvas.addEventListener('touchmove', this.boundHandleTouchMove, { passive: false });
        this.canvas.addEventListener('touchend', this.boundHandleTouchEnd, { passive: false });
        window.addEventListener('gamepadconnected', this.boundHandleGamepadConnected);
    }

    // Private: Handle keyboard down
    _handleKeyDown(e) {
        this.keys[e.key] = true;

        // Notify all subscribers
        for (const subscriber of this.subscribers) {
            if (subscriber.onKeyDown) {
                subscriber.onKeyDown(e);
            }
        }
    }

    // Private: Handle keyboard up
    _handleKeyUp(e) {
        this.keys[e.key] = false;

        // Notify all subscribers
        for (const subscriber of this.subscribers) {
            if (subscriber.onKeyUp) {
                subscriber.onKeyUp(e);
            }
        }
    }

    // Private: Handle mouse move
    _handleMouseMove(e) {
        const pos = this.getCanvasCoordinates(e.clientX, e.clientY);

        // Notify all subscribers
        for (const subscriber of this.subscribers) {
            if (subscriber.onMouseMove) {
                subscriber.onMouseMove(pos.x, pos.y);
            }
        }
    }

    // Private: Handle mouse down
    _handleMouseDown(e) {
        const pos = this.getCanvasCoordinates(e.clientX, e.clientY);

        // Notify all subscribers
        for (const subscriber of this.subscribers) {
            if (subscriber.onMouseDown) {
                subscriber.onMouseDown(pos.x, pos.y, e.button);
            }
        }
    }

    // Private: Handle mouse up
    _handleMouseUp(e) {
        const pos = this.getCanvasCoordinates(e.clientX, e.clientY);

        // Notify all subscribers
        for (const subscriber of this.subscribers) {
            if (subscriber.onMouseUp) {
                subscriber.onMouseUp(pos.x, pos.y, e.button);
            }
        }
    }

    // Private: Handle mouse click
    _handleMouseClick(e) {
        const pos = this.getCanvasCoordinates(e.clientX, e.clientY);

        // Notify all subscribers
        for (const subscriber of this.subscribers) {
            if (subscriber.onMouseClick) {
                subscriber.onMouseClick(pos.x, pos.y, e.button);
            }
        }
    }

    // Private: Handle context menu (right-click menu)
    _handleContextMenu(e) {
        e.preventDefault(); // Prevent the browser's context menu from appearing
        return false;
    }

    // Private: Handle mouse enter
    _handleMouseEnter(e) {
        const pos = this.getCanvasCoordinates(e.clientX, e.clientY);

        // Notify all subscribers
        for (const subscriber of this.subscribers) {
            if (subscriber.onMouseEnter) {
                subscriber.onMouseEnter(pos.x, pos.y);
            }
        }
    }

    // Private: Handle touch start
    _handleTouchStart(e) {
        e.preventDefault(); // Prevent default touch behavior

        // Only process the first touch
        const t = e.touches[0];
        if (t) {
            const pos = this.getCanvasCoordinates(t.clientX, t.clientY);
            const coord = {
                x: pos.x,
                y: pos.y,
            };
            for (const subscriber of this.subscribers) {
                if (subscriber.onTouchStart) {
                    subscriber.onTouchStart(coord.x, coord.y);
                }
            }
        }
    }

    // Private: Handle touch move
    _handleTouchMove(e) {
        e.preventDefault(); // Prevent default touch behavior

        // Only process the first touch
        const t = e.touches[0];
        if (t) {
            const pos = this.getCanvasCoordinates(t.clientX, t.clientY);

            for (const subscriber of this.subscribers) {
                if (subscriber.onTouchMove) {
                    subscriber.onTouchMove(pos.x, pos.y);
                }
            }
        }
    }

    // Private: Handle touch end
    _handleTouchEnd(e) {
        e.preventDefault(); // Prevent default touch behavior

        // Only process the first changed touch
        const t = e.changedTouches[0];
        if (t) {
            const pos = this.getCanvasCoordinates(t.clientX, t.clientY);

            for (const subscriber of this.subscribers) {
                if (subscriber.onTouchEnd) {
                    subscriber.onTouchEnd(pos.x, pos.y);
                }
            }
        }
    }

    // Private: Handle gamepad connected
    _handleGamepadConnected(e) {
        // Notify all subscribers
        for (const subscriber of this.subscribers) {
            if (subscriber.onGamepadConnected) {
                subscriber.onGamepadConnected(e);
            }
        }
    }

    // Update gamepad state
    updateGamepad() {
        const gamepads = navigator.getGamepads();
        if (!gamepads) return;

        for (let gp of gamepads) {
            if (gp) {
                this.gamepad = gp;

                // Handle thumbstick axes (with deadzone)
                const deadZone = 0.3;

                // Left thumbstick (axes 0 and 1)
                const leftStickX = gp.axes[0] || 0;
                const leftStickY = gp.axes[1] || 0;
                const lastLeftStickX = this.lastGamepadAxes[0] || 0;
                const lastLeftStickY = this.lastGamepadAxes[1] || 0;

                // Right thumbstick (axes 2 and 3)
                const rightStickX = gp.axes[2] || 0;
                const rightStickY = gp.axes[3] || 0;
                const lastRightStickX = this.lastGamepadAxes[2] || 0;
                const lastRightStickY = this.lastGamepadAxes[3] || 0;

                // Check for significant axis changes and notify subscribers
                if (
                    Math.abs(leftStickX - lastLeftStickX) > 0.1 ||
                    Math.abs(leftStickY - lastLeftStickY) > 0.1 ||
                    Math.abs(rightStickX - lastRightStickX) > 0.1 ||
                    Math.abs(rightStickY - lastRightStickY) > 0.1
                ) {
                    this._handleGamepadAxis({
                        leftStick: { x: leftStickX, y: leftStickY },
                        rightStick: { x: rightStickX, y: rightStickY },
                        deadZone: deadZone,
                    });
                }

                // Update axis state
                this.lastGamepadAxes = [...gp.axes];

                // Check for button presses (compare with last frame)
                for (let i = 0; i < gp.buttons.length; i++) {
                    const pressed = gp.buttons[i].pressed;
                    const wasPressed = this.lastGamepadButtons[i] || false;

                    if (pressed && !wasPressed) {
                        this._handleGamepadButton(i);
                    }
                }

                // Update button state
                this.lastGamepadButtons = gp.buttons.map((b) => b.pressed);

                break;
            }
        }
    }

    // Private: Handle gamepad button press
    _handleGamepadButton(buttonIndex) {
        // Notify all subscribers
        for (const subscriber of this.subscribers) {
            if (subscriber.onGamepadButton) {
                subscriber.onGamepadButton(buttonIndex);
            }
        }
    }

    // Private: Handle gamepad axis changes (thumbsticks)
    _handleGamepadAxis(axisData) {
        // Notify all subscribers
        for (const subscriber of this.subscribers) {
            if (subscriber.onGamepadAxis) {
                subscriber.onGamepadAxis(axisData);
            }
        }
    }
}
