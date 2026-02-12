Absolutely! We can make your `README.md` **more visually appealing and developer-friendly**, with badges, usage examples, and a metrics section. Here’s a polished version for your `showme.js` library:

---

````markdown
# showme.js 🚀

[![NPM Version](https://img.shields.io/badge/npm-v1.0.0-blue)](https://www.npmjs.com/package/showme)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/AbhayUpadhyayDev/Showme?style=social)](https://github.com/AbhayUpadhyayDev/Showme/stargazers)
[![Issues](https://img.shields.io/github/issues/AbhayUpadhyayDev/Showme)](https://github.com/AbhayUpadhyayDev/Showme/issues)

> A lightweight, customizable, dependency-free JavaScript notification library for toast-style messages.

---

## Features ✨

- ✅ Pure JavaScript (no dependencies)
- ✅ Types: `success`, `info`, `warning`, `error`
- ✅ Fully customizable:
  - Duration, position, colors, border radius
  - Optional custom HTML content
  - Action buttons with callbacks
- ✅ Persistent notifications
- ✅ Swipe-to-dismiss support on touch devices
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

### Examples

**Basic Notification**

```js
showme({ message: 'Hello World!' });
```

**Success Notification**

```js
showme({ message: 'Data saved!', type: 'success', duration: 5000 });
```

**Action Button Notification**

```js
showme({
  message: 'Undo action?',
  type: 'warning',
  actions: [
    { text: 'Undo', callback: () => alert('Action undone!') }
  ]
});
```

**Custom HTML**

```js
const content = document.createElement('div');
content.innerHTML = '<strong>Custom HTML</strong> <em>inside notification</em>';

showme({ customHTML: content, duration: 6000 });
```

**Callbacks & Persistent**

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

## Metrics 📊

[![jsDelivr Hits](https://data.jsdelivr.com/v1/package/gh/AbhayUpadhyayDev/Showme/badge)](https://www.jsdelivr.com/package/gh/AbhayUpadhyayDev/Showme)
[![GitHub repo size](https://img.shields.io/github/repo-size/AbhayUpadhyayDev/Showme)](https://github.com/AbhayUpadhyayDev/Showme)
[![GitHub contributors](https://img.shields.io/github/contributors/AbhayUpadhyayDev/Showme)](https://github.com/AbhayUpadhyayDev/Showme/graphs/contributors)

* GitHub stars, forks, issues
* jsDelivr CDN hits for usage tracking
* Repo size & contributors info

---

## License 📝

MIT License — free to use, modify, and distribute.
