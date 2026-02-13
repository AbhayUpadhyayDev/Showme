# showme.js 🚀

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](https://abhayupadhyaydev.github.io/Showme/demo.html)  
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)  
[![GitHub stars](https://img.shields.io/github/stars/AbhayUpadhyayDev/Showme?style=social)](https://github.com/AbhayUpadhyayDev/Showme/stargazers)  
[![GitHub issues](https://img.shields.io/github/issues/AbhayUpadhyayDev/Showme)](https://github.com/AbhayUpadhyayDev/Showme/issues)  
[![GitHub contributors](https://img.shields.io/github/contributors/AbhayUpadhyayDev/Showme)](https://github.com/AbhayUpadhyayDev/Showme/graphs/contributors)  
[![jsDelivr hits](https://img.shields.io/jsdelivr/gh/hm/AbhayUpadhyayDev/Showme)](https://www.jsdelivr.com/package/gh/AbhayUpadhyayDev/Showme)  
[![jsDelivr CDN](https://img.shields.io/jsdelivr/gh/l/AbhayUpadhyayDev/Showme)](https://www.jsdelivr.com/package/gh/AbhayUpadhyayDev/Showme)

> A lightweight, fully customizable, dependency-free JavaScript library for notifications, OTP input, confirm dialogs, and loading spinners.

---

## Features ✨

- ✅ Pure JavaScript (no dependencies)  
- ✅ Toast notification types: `success`, `info`, `warning`, `error`  
- ✅ Fully customizable: duration, position, colors, border radius, animations  
- ✅ Optional custom HTML content inside toast  
- ✅ Action buttons with callbacks  
- ✅ Persistent notifications  
- ✅ Swipe-to-dismiss on touch devices  
- ✅ OTP dialogs: numeric, text, alphanumeric  
- ✅ Confirm dialogs with callbacks  
- ✅ Loading / spinner overlays  
- ✅ Responsive and modern design  

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

## Toast Notifications Examples

**Basic Toast**

```js
showme({
  message: "Hello World!",
  type: "info",
  duration: 4000,
  position: "top-right",
  bgColor: "#333",
  textColor: "#fff",
  radius: 8,
  animation: true,
  persistent: false
});
```

**Success Notification with Action**

```js
showme({
  message: "Data saved successfully!",
  type: "success",
  duration: 5000,
  actions: [
    { text: "Undo", callback: () => alert("Action undone!") }
  ],
  onShow: t => console.log("Toast shown", t),
  onClose: t => console.log("Toast closed", t),
  onClick: () => alert("Toast clicked!")
});
```

**Custom HTML Notification**

```js
const htmlContent = document.createElement("div");
htmlContent.innerHTML = "<strong>Custom HTML</strong> inside toast!";
showme({ customHTML: htmlContent, duration: 6000, bgColor: "#6a1b9a", textColor: "#ffeb3b" });
```

**Positions Demo**

```js
showme({ message: "Top-left", position: "top-left" });
showme({ message: "Bottom-left", position: "bottom-left" });
showme({ message: "Bottom-right", position: "bottom-right" });
```

---

## OTP Input Dialog

```js
showme.otp({
  length: 6,
  message: "Enter your OTP",
  blockSize: 50,
  gap: 10,
  bgColor: "#222",
  textColor: "#fff",
  otpTextColor: "#fff",
  blockBorderRadius: 6,
  cardBorderRadius: 12,
  overlayBg: "rgba(0,0,0,0.5)",
  inputType: "number", // "number", "text", "alphanumeric"
  autoCloseDelay: 500,
  onComplete: otp => showme({ message: `OTP Entered: ${otp}`, type: "success" })
});
```

---

## Confirm Dialog

```js
showme.confirm({
  message: "Are you sure you want to delete this?",
  type: "warning",
  bgColor: "#fff",
  textColor: "#333",
  cardRadius: 12,
  overlayBg: "rgba(0,0,0,0.5)",
  icon: "⚠️",
  confirmText: "Yes, Delete",
  cancelText: "Cancel",
  onConfirm: () => showme({ message: "Deleted successfully!", type: "success" }),
  onCancel: () => showme({ message: "Cancelled!", type: "info" })
});
```

---

## Loading / Spinner Overlay

```js
const loader = showme.loading({
  message: "Please wait...",
  bgColor: "#fff",
  textColor: "#333",
  cardRadius: 12,
  overlayBg: "rgba(0,0,0,0.5)"
});

// Close programmatically after async operation
setTimeout(() => loader.close(), 3000);
```

---

## Global Configuration

```js
showme.config({
  maxToasts: 6,
  duration: 5000,
  animation: true
});
```

---

## Options Summary

### Toast Options

| Option       | Type        | Default       | Description                                            |
| ------------ | ----------- | ------------- | ------------------------------------------------------ |
| `message`    | string      | `''`          | Toast text content                                     |
| `type`       | string      | `'info'`      | `success`, `info`, `warning`, `error`                  |
| `duration`   | number      | `4000`        | Auto-close in ms                                       |
| `persistent` | boolean     | `false`       | Prevent auto-dismiss                                   |
| `position`   | string      | `'top-right'` | `top-right`, `top-left`, `bottom-right`, `bottom-left` |
| `bgColor`    | string      | `null`        | Background color                                       |
| `textColor`  | string      | `null`        | Text color                                             |
| `radius`     | number      | `6`           | Border radius in px                                    |
| `animation`  | boolean     | `true`        | Animate toast entrance                                 |
| `customHTML` | HTMLElement | `null`        | Custom HTML inside toast                               |
| `actions`    | array       | `[]`          | Action buttons `{text, callback}`                      |
| `onShow`     | function    | `null`        | Called on toast show                                   |
| `onClose`    | function    | `null`        | Called on toast remove                                 |
| `onClick`    | function    | `null`        | Called on toast click                                  |

### OTP Options

| Option              | Type     | Default           | Description                            |
| ------------------- | -------- | ----------------- | -------------------------------------- |
| `length`            | number   | 6                 | Number of OTP digits/characters        |
| `inputType`         | string   | `'number'`        | `"number"`, `"text"`, `"alphanumeric"` |
| `blockSize`         | number   | 50                | Input block size in px                 |
| `blockBorderRadius` | number   | 8                 | OTP input border radius                |
| `cardBorderRadius`  | number   | 12                | Overlay card border radius             |
| `bgColor`           | string   | `#fff`            | Card background                        |
| `textColor`         | string   | `#333`            | Card text color                        |
| `otpTextColor`      | string   | `#fff`            | OTP input text color                   |
| `gap`               | number   | 10                | Gap between OTP blocks                 |
| `overlayBg`         | string   | `rgba(0,0,0,0.5)` | Overlay background                     |
| `autoCloseDelay`    | number   | 500               | Delay before overlay auto-close        |
| `onComplete`        | function | `null`            | Called when OTP complete               |



### Loading Options

* `message`, `bgColor`, `textColor`, `cardRadius`, `overlayBg`

---

## License 📝

MIT License — free to use, modify, and distribute.
