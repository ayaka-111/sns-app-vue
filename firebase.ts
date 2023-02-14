import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// import dotenv from 'dotenv';
// dotenv.config();

// Your web app's Firebase configuration
// const firebaseConfig = {
//   // apiKey: import.meta.env.VITE_APP_NOT_SECRET_CODE,
//   // authDomain: import.meta.env.VITE_APP_AUTHDOMAIN,
//   // projectId: import.meta.env.VITE_APP_PROJECT_ID,
//   apiKey: "AIzaSyAJWioeX_h5q9PKdc78g98kjoIyLAmTKpA",
//   authDomain: "sns-app-vue.firebaseapp.com",
//   projectId: "sns-app-vue",
//   storageBucket: "sns-app-vue.appspot.com",
//   messagingSenderId: "463668609725",
//   appId: "1:463668609725:web:c2d636c9eff06c43056dd4"
// };

const firebaseConfig = {
  apiKey: "AIzaSyCOgpNa6bfQBP6BTEc7np-dqEU-DQGhbVc",
  authDomain: "sns-app-vue-test2.firebaseapp.com",
  projectId: "sns-app-vue-test2",
  storageBucket: "sns-app-vue-test2.appspot.com",
  messagingSenderId: "400770589695",
  appId: "1:400770589695:web:51e8a19fa5efca48cdbdca"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);
//Firebaseの認証機能を使う場合に必要な記述
const auth = getAuth(app);

// 上記2つの変数をどこででも使えるようにexportする
export { db, storage, auth };
