import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// import dotenv from 'dotenv';
// dotenv.config();

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_APP_NOT_SECRET_CODE,
//   authDomain: import.meta.env.VITE_APP_AUTHDOMAIN,
//   projectId: import.meta.env.VITE_APP_PROJECT_ID,
//   // apiKey: "AIzaSyAJWioeX_h5q9PKdc78g98kjoIyLAmTKpA",
//   // authDomain: "sns-app-vue.firebaseapp.com",
//   // projectId: "sns-app-vue",
//   storageBucket: "sns-app-vue.appspot.com",
//   messagingSenderId: "463668609725",
//   appId: "1:463668609725:web:c2d636c9eff06c43056dd4"
// };

// const firebaseConfig = {
//   apiKey: "AIzaSyAoe-tmv_nlg11W6os3YGFv_KSSIH9WjXY",
//   authDomain: "sns-app-vue-naito.firebaseapp.com",
//   projectId: "sns-app-vue-naito",
//   storageBucket: "sns-app-vue-naito.appspot.com",
//   messagingSenderId: "753829740516",
//   appId: "1:753829740516:web:86348cbb8be3393f5c11f1"
// };

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_NOT_SECRET_CODE,
  authDomain: import.meta.env.VITE_APP_AUTHDOMAIN,
  projectId: import.meta.env.VITE_APP_PROJECT_ID,
  storageBucket: "sns-app-vue-test2.appspot.com",
  messagingSenderId: "400770589695",
  appId: "1:400770589695:web:51e8a19fa5efca48cdbdca"
};


// const firebaseConfig = {
//   apiKey: "AIzaSyAEGLZ5IaWaHo1azlg6gUMVNynk3HZqasE",
//   authDomain: "sns-app-vue-test1.firebaseapp.com",
//   projectId: "sns-app-vue-test1",
//   storageBucket: "sns-app-vue-test1.appspot.com",
//   messagingSenderId: "437958117941",
//   appId: "1:437958117941:web:57cf0986cb3c073ff87f7c"
// };

// const firebaseConfig = {
//   apiKey: "AIzaSyCOgpNa6bfQBP6BTEc7np-dqEU-DQGhbVc",
//   authDomain: "sns-app-vue-test2.firebaseapp.com",
//   projectId: "sns-app-vue-test2",
//   storageBucket: "sns-app-vue-test2.appspot.com",
//   messagingSenderId: "400770589695",
//   appId: "1:400770589695:web:51e8a19fa5efca48cdbdca"
// };

// const firebaseConfig = {
//   apiKey: "AIzaSyApaxJM6sAzcs50G4FT8MP3LzSQlDYhrj8",
//   authDomain: "vue-test-cc3db.firebaseapp.com",
//   projectId: "vue-test-cc3db",
//   storageBucket: "vue-test-cc3db.appspot.com",
//   messagingSenderId: "1062748564728",
//   appId: "1:1062748564728:web:9b39c3d40a980a1bdddf0d"
// };

// const firebaseConfig = {
//   apiKey: "AIzaSyASZXY5ojOe7XIvxQ-3Eh9lqG43iwMcWws",
//   authDomain: "vue-test2-a552a.firebaseapp.com",
//   projectId: "vue-test2-a552a",
//   storageBucket: "vue-test2-a552a.appspot.com",
//   messagingSenderId: "682540260802",
//   appId: "1:682540260802:web:90263ff8dd17862ce74a5b"
// };

//const firebaseConfig = {
//  apiKey: "AIzaSyA67S8H_Nvi0v6FE7T2dYixBGGfdt35u78",
//  authDomain: "vue-test3-51c69.firebaseapp.com",
//  projectId: "vue-test3-51c69",
//  storageBucket: "vue-test3-51c69.appspot.com",
//  messagingSenderId: "849596416054",
//  appId: "1:849596416054:web:a58fb5efe3834984481897"
//};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);
//Firebaseの認証機能を使う場合に必要な記述
const auth = getAuth(app);

// 上記2つの変数をどこででも使えるようにexportする
export { db, storage, auth };
