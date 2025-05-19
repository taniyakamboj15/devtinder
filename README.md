# 💘 devTinder – Frontend

A sleek social chat platform for developers where you can discover, connect, and communicate with fellow devs. Users can send/accept/remove friend requests and chat with their added friends through secure end-to-end encrypted (E2EE) messaging.

> 🔴 **Live:** [https://devtinder.taniyakamboj.info](https://devtinder.taniyakamboj.info)
> ⚠️ On first load, please wait 10–15 seconds as the backend is hosted on a free tier and may be in sleep mode.

---

## 🔗 Backend

[GitHub – devTinder Backend](https://github.com/taniyakamboj15/devTinder-backend)

---

## 🚀 Features

* 👤 User Authentication (Sign Up & Login)
* 🧭 Browse Developer Feed
* 📨 Send / Accept / Reject Friend Requests
* 🔐 Chat with End-to-End Encryption
* 🔄 Real-time updates via Socket.IO
* 🖼️ Profile Editing
* ⚡ Clean and Responsive UI (TailwindCSS + DaisyUI)

---

## 🛠 Tech Stack

* **React 19** – UI Framework
* **Vite** – Fast Dev Environment
* **Redux Toolkit** – State Management
* **Tailwind CSS** – Styling
* **DaisyUI** – Prebuilt Components
* **React Router DOM** – Routing
* **Socket.IO Client** – Real-time Communication
* **CryptoJS** – AES-based E2EE

---

## 📁 Project Structure

```
📦 devTinder
├─ .gitignore
├─ .postcssrc
├─ index.html
├─ package.json
├─ package-lock.json
├─ public/
│  └─ icon.ico
└─ src/
   ├─ Components/
   │  ├─ Chat.jsx
   │  ├─ Connection.jsx
   │  ├─ EditProfile.jsx
   │  ├─ Error.jsx
   │  ├─ Feed.jsx
   │  ├─ Footer.jsx
   │  ├─ Header.jsx
   │  ├─ Login.jsx
   │  ├─ Profile.jsx
   │  ├─ Request.jsx
   │  ├─ Shimmer.jsx
   │  ├─ ShimmerCard.jsx
   │  ├─ SignUp.jsx
   │  └─ UserCard.jsx
   ├─ Layout/
   │  ├─ App.jsx
   │  └─ Body.jsx
   ├─ Slices/
   │  ├─ feedSlice.js
   │  ├─ requestSlice.js
   │  └─ userSlice.js
   ├─ assets/
   │  ├─ bgImage.jpg
   │  └─ logo.png
   ├─ constants/
   │  ├─ constants.js
   │  └─ socket.js
   ├─ hooks/
   │  └─ usefindRequest.js
   ├─ redux/
   │  └─ appStore.js
   ├─ style.css
   ├─ utils/
   │  └─ encryption.js
   └─ index.jsx
```

---

## ⚙️ Scripts

```bash
npm run dev       # Start local dev server
npm run build     # Production build
npm run preview   # Preview production build
```

---

## 👩‍💻 Author

Crafted with ❤️ by [Taniya Kamboj](https://github.com/taniyakamboj15)

---

## 📜 License

Licensed under the [ISC License](https://opensource.org/licenses/ISC).
