// This file assumes firebase is loaded via <script> tag in index.html
declare const firebase: any;

const firebaseConfig = {
  apiKey: "API_KEY_HERE",
  authDomain: "desktµDAZDZA",
  projectId: "desktop-portfolio",
  storageBucket: "dzadzadza",
  messagingSenderId: "13244",
  appId: "dzadzadzadsqdsq",
  measurementId: "dzadzadzsqsd"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
export const projectsCollection = db.collection('projects');
export const settingsCollection = db.collection('settings');