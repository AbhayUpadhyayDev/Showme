# showme.js

A lightweight, customizable, dependency-free JavaScript notification library for showing toast-style messages.

---

## Features

- Pure JavaScript (no dependencies)
- Multiple types: `success`, `info`, `warning`, `error`
- Fully customizable:
  - Duration, position, colors, border radius
  - Optional custom HTML
  - Actions (buttons) with callbacks
- Optional persistent notifications
- Swipe-to-dismiss support on touch devices
- Limit of 5 active notifications (configurable in code)

---

## Installation

Include `showme.js` in your project:

```html
<script src="showme.js"></script>
````

---

## Usage

### Basic Notification

```js
showme({ message: 'Hello World!' });
```

### Success Notification with Custom Duration

```js
showme({
  message: 'Data saved successfully!',
  type: 'success',
  duration: 5000
});
```

### Notification with Action Button

```js
showme({
  message: 'Do you want to undo?',
  type: 'warning',
  actions: [
    { text: 'Undo', callback: () => console.log('Undo clicked') }
  ]
});
```

### Notification with Custom HTML

```js
const customContent = document.createElement('div');
customContent.innerHTML = '<strong>Custom HTML</strong> <em>inside notification</em>';

showme({
  customHTML: customContent,
  duration: 6000
});
```

### Callbacks

```js
showme({
  message: 'Clickable notification',
  onClick: () => console.log('Notification clicked'),
  onShow: (t) => console.log('Notification shown', t),
  onClose: (t) => console.log('Notification removed', t)
});
```

### Persistent Notification

```js
showme({
  message: 'This notification stays until manually closed',
  persistent: true
});
```

---

## Options

| Option       | Type        | Default       | Description                                            |
| ------------ | ----------- | ------------- | ------------------------------------------------------ |
| `message`    | string      | `''`          | Notification text                                      |
| `type`       | string      | `'info'`      | `success`, `info`, `warning`, `error`                  |
| `duration`   | number      | `4000`        | Auto-close duration (ms)                               |
| `persistent` | boolean     | `false`       | Prevent auto-dismiss                                   |
| `position`   | string      | `'top-right'` | `top-right`, `top-left`, `bottom-right`, `bottom-left` |
| `bgColor`    | string      | `null`        | Custom background color                                |
| `textColor`  | string      | `null`        | Custom text color                                      |
| `radius`     | number      | `4`           | Border radius in px                                    |
| `animation`  | boolean     | `false`       | Animate notification entrance                          |
| `customHTML` | HTMLElement | `null`        | Custom HTML content                                    |
| `actions`    | array       | `[]`          | Array of buttons `{text, callback}`                    |
| `onShow`     | function    | `null`        | Callback when notification is shown                    |
| `onClose`    | function    | `null`        | Callback when notification is removed                  |
| `onClick`    | function    | `null`        | Callback when notification is clicked                  |

---

## License

MIT License — free to use, modify, and distribute.

```
