# showme.js 🚀

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](https://abhayupadhyaydev.github.io/Showme/demo.html)&nbsp;
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)&nbsp;
[![GitHub stars](https://img.shields.io/github/stars/AbhayUpadhyayDev/Showme?style=social)](https://github.com/AbhayUpadhyayDev/Showme/stargazers)&nbsp; 
[![GitHub issues](https://img.shields.io/github/issues/AbhayUpadhyayDev/Showme)](https://github.com/AbhayUpadhyayDev/Showme/issues)&nbsp;
[![GitHub contributors](https://img.shields.io/github/contributors/AbhayUpadhyayDev/Showme)](https://github.com/AbhayUpadhyayDev/Showme/graphs/contributors)&nbsp; 
[![jsDelivr hits](https://img.shields.io/jsdelivr/gh/hm/AbhayUpadhyayDev/Showme)](https://www.jsdelivr.com/package/gh/AbhayUpadhyayDev/Showme)&nbsp; 
[![jsDelivr CDN](https://img.shields.io/jsdelivr/gh/l/AbhayUpadhyayDev/Showme)](https://www.jsdelivr.com/package/gh/AbhayUpadhyayDev/Showme)&nbsp;

> A lightweight, fully customizable, dependency-free JavaScript library for notifications, OTP input, confirm dialogs, modals, and loading spinners.

---

## Features ✨

* ✅ Pure JavaScript (no dependencies)
* ✅ Toast notification types: `success`, `info`, `warning`, `error`
* ✅ Fully customizable: duration, position, colors, border radius, animations
* ✅ Optional custom HTML content inside toast
* ✅ Action buttons with callbacks
* ✅ Persistent notifications
* ✅ Swipe-to-dismiss on touch devices
* ✅ OTP dialogs: numeric, text, alphanumeric
* ✅ Confirm dialogs with callbacks
* ✅ Loading / spinner overlays
* ✅ Lightweight modals: form, choice, checklist, rating, countdown, tabs, carousel, file upload
* ✅ Responsive and modern design

---

## Quick Start ⚡

### Include via CDN

```html
<script src="https://cdn.jsdelivr.net/gh/AbhayUpadhyayDev/Showme@v1.0.1/showme.min.js"></script>
```

Or locally:

```html
<script src="showme.js"></script>
```

---

## Table of Contents

1. [Global Configuration](#1-global-configuration)
2. [Toast Notifications](#2-toast-notifications)
3. [OTP Dialog](#3-otp-dialog)
4. [Confirm Dialog](#4-confirm-dialog)
5. [Loading / Spinner Overlay](#5-loading--spinner-overlay)
6. [Form Modal](#6-form-modal)
7. [Choice / Card Selection](#7-choice--card-selection)
8. [Checklist Modal](#8-checklist-modal)
9. [Rating Modal](#9-rating-modal)
10. [Countdown Modal](#10-countdown-modal)
11. [File Upload / Drag & Drop](#11-file-upload--drag--drop)
12. [Tabs / Multi-section Modal](#12-tabs--multi-section-modal)
13. [Carousel / Media Viewer](#13-carousel--media-viewer)

---

## 1️⃣ Global Configuration

`showme.config(options)`

| Option      | Type    | Default | Description                 |
| ----------- | ------- | ------- | --------------------------- |
| `maxToasts` | number  | 5       | Maximum simultaneous toasts |
| `duration`  | number  | 4000    | Default toast duration (ms) |
| `animation` | boolean | true    | Animate toast entrance/exit |

**Example:**

```js
showme.config({
  maxToasts: 6,
  duration: 5000,
  animation: false
});
```

---

## 2️⃣ Toast Notifications

`showme(options)`

| Option       | Type        | Default       | Description                                                    |
| ------------ | ----------- | ------------- | -------------------------------------------------------------- |
| `message`    | string      | `''`          | Toast text content                                             |
| `type`       | string      | `'info'`      | `success`, `info`, `warning`, `error`                          |
| `duration`   | number      | 4000          | Auto-close duration (ms)                                       |
| `persistent` | boolean     | false         | If true, toast will not auto-close                             |
| `position`   | string      | `'top-right'` | `'top-right'`, `'top-left'`, `'bottom-right'`, `'bottom-left'` |
| `bgColor`    | string      | null          | Background color override                                      |
| `textColor`  | string      | null          | Text color override                                            |
| `radius`     | number      | 6             | Border radius (px)                                             |
| `animation`  | boolean     | true          | Animate toast entrance                                         |
| `customHTML` | HTMLElement | null          | Custom HTML content                                            |
| `actions`    | array       | []            | Buttons `{text, callback}`                                     |
| `onShow`     | function    | null          | Callback on show                                               |
| `onClose`    | function    | null          | Callback on close                                              |
| `onClick`    | function    | null          | Callback on click                                              |

---

## 3️⃣ OTP Dialog

`showme.otp(options)`

| Option              | Type     | Default           | Description                            |
| ------------------- | -------- | ----------------- | -------------------------------------- |
| `length`            | number   | 6                 | Number of OTP characters               |
| `inputType`         | string   | `'number'`        | `"number"`, `"text"`, `"alphanumeric"` |
| `blockSize`         | number   | 50                | Width & height of OTP blocks (px)      |
| `blockBorderRadius` | number   | 8                 | OTP input block border radius          |
| `cardBorderRadius`  | number   | 12                | Dialog card border radius              |
| `bgColor`           | string   | `#fff`            | Dialog background color                |
| `textColor`         | string   | `#333`            | Dialog text color                      |
| `otpTextColor`      | string   | `#000`            | OTP input text color                   |
| `gap`               | number   | 10                | Gap between OTP blocks                 |
| `overlayBg`         | string   | `rgba(0,0,0,0.5)` | Overlay background color               |
| `autoCloseDelay`    | number   | 500               | Delay before overlay auto-close (ms)   |
| `onComplete`        | function | null              | Callback when OTP is complete          |
| `onResend`          | function | null              | Callback for "Resend OTP"              |

---

## 4️⃣ Confirm Dialog

`showme.confirm(options)`

| Option        | Type     | Default           | Description                      |
| ------------- | -------- | ----------------- | -------------------------------- |
| `message`     | string   | `"Are you sure?"` | Message content                  |
| `type`        | string   | `"info"`          | `"info"`, `"warning"`, `"error"` |
| `bgColor`     | string   | `#fff`            | Card background                  |
| `textColor`   | string   | `#333`            | Text color                       |
| `cardRadius`  | number   | 12                | Card border radius               |
| `overlayBg`   | string   | `rgba(0,0,0,0.5)` | Overlay background               |
| `confirmText` | string   | `"Yes"`           | Confirm button text              |
| `cancelText`  | string   | `"No"`            | Cancel button text               |
| `icon`        | string   | null              | Optional icon (emoji/HTML)       |
| `onConfirm`   | function | null              | Confirm callback                 |
| `onCancel`    | function | null              | Cancel callback                  |

---

## 5️⃣ Loading / Spinner Overlay

`showme.loading(options)`

| Option       | Type   | Default           | Description        |
| ------------ | ------ | ----------------- | ------------------ |
| `message`    | string | `"Loading..."`    | Loading text       |
| `bgColor`    | string | `#fff`            | Card background    |
| `textColor`  | string | `#333`            | Text color         |
| `cardRadius` | number | 12                | Card border radius |
| `overlayBg`  | string | `rgba(0,0,0,0.5)` | Overlay background |

**Return:** `{ close: function }` — use `loader.close()` to remove.

---

## 6️⃣ Form Modal

`showme.form(options)`

| Option       | Type     | Default                                                      | Description                         |
| ------------ | -------- | ------------------------------------------------------------ | ----------------------------------- |
| `title`      | string   | `"Enter Information"`                                        | Form title                          |
| `fields`     | array    | `[ {label:"Name", type:"text", placeholder:"Enter value"} ]` | Form fields                         |
| `bgColor`    | string   | `#1b1d2a`                                                    | Card background                     |
| `textColor`  | string   | `#e0e0e0`                                                    | Card text color                     |
| `cardRadius` | number   | 12                                                           | Card border radius                  |
| `overlayBg`  | string   | `rgba(0,0,0,0.7)`                                            | Overlay background                  |
| `onSubmit`   | function | null                                                         | Callback with array of field values |
| `onCancel`   | function | null                                                         | Callback on cancel                  |

---

## 7️⃣ Choice / Card Selection

`showme.choice(options)`

| Option        | Type     | Default           | Description                     |
| ------------- | -------- | ----------------- | ------------------------------- |
| `title`       | string   | `"Choose"`        | Modal title                     |
| `cards`       | array    | `[]`              | Array of `{label, value, icon}` |
| `multiSelect` | boolean  | false             | Allow multiple selection        |
| `bgColor`     | string   | `#fff`            | Card background                 |
| `textColor`   | string   | `#333`            | Text color                      |
| `cardRadius`  | number   | 12                | Card border radius              |
| `overlayBg`   | string   | `rgba(0,0,0,0.5)` | Overlay background              |
| `onSelect`    | function | null              | Callback with selected values   |

---

## 8️⃣ Checklist Modal

`showme.checklist(options)`

| Option       | Type     | Default           | Description                 |
| ------------ | -------- | ----------------- | --------------------------- |
| `title`      | string   | `"Select Items"`  | Modal title                 |
| `items`      | array    | `[]`              | Array of `{label, checked}` |
| `bgColor`    | string   | `#fff`            | Card background             |
| `textColor`  | string   | `#333`            | Text color                  |
| `cardRadius` | number   | 12                | Card border radius          |
| `overlayBg`  | string   | `rgba(0,0,0,0.5)` | Overlay background          |
| `onSubmit`   | function | null              | Callback with checked items |

---

## 9️⃣ Rating Modal

`showme.rating(options)`

| Option          | Type     | Default           | Description                   |
| --------------- | -------- | ----------------- | ----------------------------- |
| `title`         | string   | `"Rate"`          | Modal title                   |
| `maxRating`     | number   | 5                 | Maximum stars                 |
| `initialRating` | number   | 0                 | Initial selected stars        |
| `bgColor`       | string   | `#fff`            | Card background               |
| `textColor`     | string   | `#333`            | Text color                    |
| `cardRadius`    | number   | 12                | Card border radius            |
| `overlayBg`     | string   | `rgba(0,0,0,0.5)` | Overlay background            |
| `onRate`        | function | null              | Callback with selected rating |

---

## 10️⃣ Countdown Modal

`showme.countdown(options)`

| Option       | Type     | Default           | Description              |
| ------------ | -------- | ----------------- | ------------------------ |
| `title`      | string   | `"Countdown"`     | Modal title              |
| `seconds`    | number   | 10                | Countdown duration       |
| `bgColor`    | string   | `#fff`            | Card background          |
| `textColor`  | string   | `#333`            | Text color               |
| `cardRadius` | number   | 12                | Card border radius       |
| `overlayBg`  | string   | `rgba(0,0,0,0.5)` | Overlay background       |
| `onComplete` | function | null              | Callback after countdown |

---

## 11️⃣ File Upload / Drag & Drop

`showme.upload(options)`

| Option       | Type     | Default           | Description                  |
| ------------ | -------- | ----------------- | ---------------------------- |
| `title`      | string   | `"Upload File"`   | Modal title                  |
| `multiple`   | boolean  | false             | Allow multiple files         |
| `bgColor`    | string   | `#fff`            | Card background              |
| `textColor`  | string   | `#333`            | Text color                   |
| `cardRadius` | number   | 12                | Card border radius           |
| `overlayBg`  | string   | `rgba(0,0,0,0.5)` | Overlay background           |
| `onUpload`   | function | null              | Callback with uploaded files |

---

## 12️⃣ Tabs / Multi-section Modal

`showme.tabs(options)`

| Option        | Type     | Default           | Description                     |
| ------------- | -------- | ----------------- | ------------------------------- |
| `title`       | string   | `"Tabs"`          | Modal title                     |
| `tabs`        | array    | `[]`              | Array of `{label, contentHTML}` |
| `bgColor`     | string   | `#fff`            | Card background                 |
| `textColor`   | string   | `#333`            | Text color                      |
| `cardRadius`  | number   | 12                | Card border radius              |
| `overlayBg`   | string   | `rgba(0,0,0,0.5)` | Overlay background              |
| `onTabChange` | function | null              | Callback on tab switch          |

---

## 13️⃣ Carousel / Media Viewer

`showme.carousel(options)`

| Option       | Type     | Default           | Description                                        |
| ------------ | -------- | ----------------- | -------------------------------------------------- |
| `title`      | string   | `"Gallery"`       | Modal title                                        |
| `items`      | array    | `[]`              | Array of media `{type:"image"/"video", src:"url"}` |
| `bgColor`    | string   | `#fff`            | Card background                                    |
| `textColor`  | string   | `#333`            | Text color                                         |
| `cardRadius` | number   | 12                | Card border radius                                 |
| `overlayBg`  | string   | `rgba(0,0,0,0.5)` | Overlay background                                 |
| `onSelect`   | function | null              | Callback when media selected                       |

---

## License 📝

MIT License — free to use, modify, and distribute.
