# Interactive Desktop Portfolio

**Author:** Achref Riahi

This project is a fully interactive, desktop-themed portfolio built with React, TypeScript, and Firebase. It simulates a mini operating system environment in the browser, where projects are represented as applications, and portfolio settings can be managed through a dedicated admin panel.

## Features

- **Interactive Desktop UI:** A simulated desktop environment with draggable and resizable windows.
- **Dynamic Content:** Projects and portfolio settings are managed via a Firebase backend.
- **Admin Panel:** A secure area to create, update, and delete projects, and to modify portfolio-wide settings like name, contact info, and theme colors.
- **Theming:** Switch between light and dark modes, with customizable colors via the admin panel.
- **Built-in Terminal:** A command-line interface to navigate the portfolio.
- **First-Time Setup:** An easy-to-follow setup screen to initialize the portfolio and create an admin user.

## Tech Stack

- **Frontend:** React, TypeScript
- **Styling:** Tailwind CSS
- **Backend & Database:** Firebase (Authentication, Firestore)
- **Icons:** Lucide React

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have a Firebase account to connect the application to a backend.

- [Create a Firebase Account](https://firebase.google.com/)

### Firebase Setup (Crucial Step)

This project requires a Firebase project to handle authentication, data storage, and user management.

#### 1. Create a Firebase Project

- Go to the [Firebase Console](https://console.firebase.google.com/).
- Click on **"Add project"** and give your project a name (e.g., "my-desktop-portfolio").
- Continue through the setup steps. You can disable Google Analytics for this project if you wish.

#### 2. Create a Web App in Firebase

- Once your project is created, you will be on the project's dashboard.
- Click on the **Web icon (`</>`)** to add a new web application.
- Give your app a nickname (e.g., "Portfolio Web App") and click **"Register app"**.
- Firebase will provide you with a `firebaseConfig` object. **Copy this object's values.** You will need them for the next step.

#### 3. Enable Firebase Services

You need to enable Authentication and Firestore for the app to function correctly.

- **Enable Authentication:**
  - In the left-hand menu of the Firebase console, go to **Build > Authentication**.
  - Click **"Get started"**.
  - Select the **"Email/Password"** provider from the list and enable it.

- **Enable Firestore Database:**
  - In the left-hand menu, go to **Build > Firestore Database**.
  - Click **"Create database"**.
  - For initial setup, you can start in **test mode**. This will allow open access for a limited time.
  - **Important for Production:** For a live application, you must configure [Security Rules](https://firebase.google.com/docs/firestore/security/get-started) to protect your data.

#### 4. Configure Environment Variables

To connect your application to Firebase without hardcoding your secret keys, you need to set up environment variables.

Upadate firebase.ts file with your firebase config
```
# firebase.ts file

const firebaseConfig = {
  apiKey: "dazdzadza",
  authDomain: "desktop-dzadza.firebaseapp.com",
  projectId: "desktop-dzadaz",
  storageBucket: "desktop-dzadza.firebasestorage.app",
  messagingSenderId: "3241313131",
  appId: "dzadzadzas",
  measurementId: "dzadzazdss"
};
```

The application is configured to read these variables automatically, keeping your credentials secure and out of the source code.

### Running the Application

Once your environment variables are set, you can run the application. The first time you run it, you will be guided through a setup screen to create your admin user and populate initial portfolio data.
