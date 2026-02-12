
# showme.js 🚀

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](https://abhayupadhyaydev.github.io/Showme/demo.html)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/AbhayUpadhyayDev/Showme?style=social)](https://github.com/AbhayUpadhyayDev/Showme/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/AbhayUpadhyayDev/Showme)](https://github.com/AbhayUpadhyayDev/Showme/issues)
[![GitHub contributors](https://img.shields.io/github/contributors/AbhayUpadhyayDev/Showme)](https://github.com/AbhayUpadhyayDev/Showme/graphs/contributors)
[![jsDelivr hits](https://img.shields.io/jsdelivr/gh/hm/AbhayUpadhyayDev/Showme)](https://www.jsdelivr.com/package/gh/AbhayUpadhyayDev/Showme)
[![jsDelivr CDN](https://img.shields.io/jsdelivr/gh/l/AbhayUpadhyayDev/Showme)](https://www.jsdelivr.com/package/gh/AbhayUpadhyayDev/Showme)

> A lightweight, customizable, dependency-free JavaScript notification library for toast-style messages.

---

## Features ✨

- ✅ Pure JavaScript (no dependencies)  
- ✅ Notification types: `success`, `info`, `warning`, `error`  
- ✅ Fully customizable: duration, position, colors, border radius  
- ✅ Optional custom HTML content  
- ✅ Action buttons with callbacks  
- ✅ Persistent notifications  
- ✅ Swipe-to-dismiss on touch devices  
- ✅ Limit of 5 active notifications (configurable)

---

## Quick Start ⚡

### Include via CDN

```html
<script src="https://cdn.jsdelivr.net/gh/AbhayUpadhyayDev/Showme/showme.min.js"></script>
````

Or locally:

```html
<script src="showme.js"></script>
```

---

## Usage Examples

**Basic Notification**

```js
showme({ message: 'Hello World!' });
```

**Success Notification**

```js
showme({ message: 'Data saved successfully!', type: 'success', duration: 5000 });
```

**Notification with Action Button**

```js
showme({
  message: 'Undo action?',
  type: 'warning',
  actions: [
    { text: 'Undo', callback: () => alert('Action undone!') }
  ]
});
```

**Custom HTML Content**

```js
const content = document.createElement('div');
content.innerHTML = '<strong>Custom HTML</strong> <em>inside notification</em>';

showme({ customHTML: content, duration: 6000 });
```

**Callbacks & Persistent Notifications**

```js
showme({
  message: 'Click me!',
  persistent: true,
  onClick: () => console.log('Notification clicked'),
  onShow: t => console.log('Notification shown', t),
  onClose: t => console.log('Notification closed', t)
});
```

---

## Options

| Option       | Type        | Default       | Description                                            |
| ------------ | ----------- | ------------- | ------------------------------------------------------ |
| `message`    | string      | `''`          | Notification text                                      |
| `type`       | string      | `'info'`      | `success`, `info`, `warning`, `error`                  |
| `duration`   | number      | `4000`        | Auto-close duration in milliseconds                    |
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

## License 📝

MIT License — free to use, modify, and distribute.
