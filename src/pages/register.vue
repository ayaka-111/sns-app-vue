<script setup>
import EmailField from "@/components/atoms/EmailField.vue";
import NameField from "@/components/atoms/NameField.vue";
import ProfileField from "@/components/atoms/ProfileField.vue";
import UserNameField from "@/components/atoms/UserNameField.vue";
import PasswordField from "@/components/atoms/PasswordField.vue";
import CPasswordField from "@/components/atoms/CPasswordField.vue";
import { reactive, ref as vueref } from "vue";
import SubmitButtonState from "@/components/atoms/SubmitBtnState";
import formValidation from "@/components/molecules/formValidation";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
} from "@firebase/auth";
import { useRouter } from "vue-router";
import { storage, auth, db } from "../../firebase";
import {
  getDownloadURL,
  uploadBytesResumable,
  ref,
  getStorage,
} from "firebase/storage";
import { doc, getDoc, setDoc } from "@firebase/firestore";

let user = reactive({
  email: "",
  name: "",
  profile: "",
  userName: "",
  password: "",
  cPassword: "",
});

const { error } = formValidation();
const { isSignupButtonDisabled } = SubmitButtonState(user, error);
const iconImg = vueref("");
const iconFileName = vueref("");
const currentAuth = getAuth();
const router = useRouter();
const file = vueref(null);

// ログイン状態の場合の処理
onAuthStateChanged(currentAuth, (currentUser) => {
  if (currentUser) {
    router.push("/");
  }
});

// アイコン画像プレビュー処理
const previewImage = (event) => {
  let reader = new FileReader();
  reader.onload = function (e) {
    iconImg.value = e.target.result;
  };
  reader.readAsDataURL(event.target.files[0]);
  file.value = event.target.files[0];
  iconFileName.value = event.target.files[0].name;
};

// 登録ボタンの処理
const loginButtonPressed = async () => {
  try {
    // Authenticationに登録
    createUserWithEmailAndPassword(auth, user.email, user.password)
      .then(() => {
        // Storageにアイコン登録
        const auth = getAuth();
        const currentUserId = auth.currentUser?.uid;
        console.log(currentUserId);
        const storageRef = ref(
          storage,
          `${currentUserId}/icon/${iconFileName.value}`
        );
        uploadBytesResumable(storageRef, file.value)
          // StorageからアイコンURLを取得
          .then(() => {
            getDownloadURL(storageRef).then((url) => {
              iconImg.value = url;
              console.log(url);
              console.log(iconImg.value);
            });
          })
          .then(() => {
            // Firestoreにユーザー情報登録
            //ログイン済みユーザーのドキュメントへの参照を取得
            const docRef = doc(db, "users", currentUserId);
            console.log(currentUserId);
            const userDoc = getDoc(docRef).then(() => {
              //exists()でドキュメントの存在の有無を確認
              if (!userDoc.exists) {
                //FireStoreにユーザー用のドキュメントが作られていなければ新規作成
                setDoc(docRef, {
                  userId: currentUserId,
                  userName: user.userName,
                  name: user.name,
                  icon: iconImg.value,
                  email: user.email,
                  password: user.password,
                  Cpassword: user.cPassword,
                  follow: [],
                  follower: [],
                  favoritePosts: [],
                  profile: user.profile,
                  posts: [],
                  keepPosts: [],
                });
              }
            });
          });
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  } catch (e) {
    console.log(e);
  }
};
</script>

<template>
  <section class="signup-view">
    <div>
      <img :src="iconImg" alt="ユーザーアイコン" />
    </div>
    <form @submit.prevent class="ui form">
      <input
        type="file"
        name="iconImg"
        @change="previewImage"
        accept="image/png, image/jpeg, image/jpg"
      />
      <EmailField v-model="user.email" />
      <NameField v-model="user.name" />
      <ProfileField v-model="user.profile" />
      <UserNameField v-model="user.userName" />
      <PasswordField v-model="user.password" />
      <CPasswordField v-model="user.cPassword" />
      <p v-if="user.password !== user.cPassword">
        パスワードが一致していません
      </p>
      <div v-if="user.password !== user.cPassword || isSignupButtonDisabled">
        登録する
      </div>
      <button
        :disabled="isSignupButtonDisabled"
        @click="loginButtonPressed"
        class="ui button red fluid big"
        v-else
      >
        登録する
      </button>
    </form>
    <div>
      <p>アカウントをお持ちですか？</p>
      <a href="/login">ログインする</a>
    </div>
  </section>
</template>
