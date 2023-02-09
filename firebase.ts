// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_NOT_SECRET_CODE,
  authDomain: import.meta.env.VITE_APP_AUTHDOMAIN,
  projectId: import.meta.env.VITE_APP_PROJECT_ID,
  storageBucket: "sns-app-vue.appspot.com",
  messagingSenderId: "463668609725",
  appId: "1:463668609725:web:c2d636c9eff06c43056dd4"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);
//Firebaseの認証機能を使う場合に必要な記述
const auth = getAuth(app);

// 上記2つの変数をどこででも使えるようにexportする
export { db, storage, auth };
