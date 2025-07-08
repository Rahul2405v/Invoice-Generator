# 📟 Invoice Generator

A complete end-to-end **Invoice Generator** web application built with **Spring Boot**, **ReactJS**, **MongoDB**, and **Clerk** for authentication. This app enables users to create, manage, and download invoices with a seamless and interactive UI.

---

## 🔧 Tech Stack

* **Backend:** Spring Boot (Java 17)
* **Frontend:** ReactJS (with Hooks)
* **Database:** MongoDB (Atlas/local)
* **Authentication:** Clerk
* **PDF Generation:** iText / Flying Saucer (optional)
* **API Testing:** Swagger (optional)

---

## ✨ Features

* ✅ User Authentication with Clerk
* ✅ Create, Edit, Delete Invoices
* ✅ Add Client Details
* ✅ Live Invoice Preview
* ✅ PDF Invoice Download
* ✅ RESTful API (Spring Boot)
* ✅ Persistent Data with MongoDB
* ✅ Cross-Origin Support
* ✅ Responsive UI (ReactJS + Bootstrap)
* ✅ Email of Invoice

---

## 📁 Folder Structure

```


---

## 🛠 Setup Instructions

### 1. Backend (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
```

Make sure to configure your MongoDB connection in `application.properties`.

### 2. Frontend (React)

```bash
cd frontend
npm install
npm start
```

Add the following to your `.env`:

```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### 3. Clerk Setup

* Go to [https://clerk.dev](https://clerk.dev) and create a project.
* Copy your **Frontend API Key** and **Instance ID**.
* Integrate `@clerk/clerk-react` and wrap your app with `ClerkProvider`.


---

## 🔐 Clerk Integration (React)

```jsx
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

<ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
  <SignedIn>
    <YourApp />
  </SignedIn>
  <SignedOut>
    <RedirectToSignIn />
  </SignedOut>
</ClerkProvider>
```

## 🤝 Author

Made with ❤️ by **Rahul Vudathu**
