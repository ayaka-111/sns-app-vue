<script setup lang="ts">
import EmailField from "@/components/atoms/EmailField.vue";
import NameField from "@/components/atoms/NameField.vue";
import ProfileField from "@/components/atoms/ProfileField.vue";
import UserNameField from "@/components/atoms/UserNameField.vue";
import PasswordField from "@/components/atoms/PasswordField.vue";
import CPasswordField from "../components/atoms/CPasswordField.vue";
import { onMounted, reactive, ref as vueref } from "vue";
import SubmitButtonState from "@/components/atoms/SubmitBtnState";
import formValidation from "@/components/molecules/formValidation";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
} from "@firebase/auth";
import { useRouter } from "vue-router";
import { storage, auth, db } from "../../firebase";
import { getDownloadURL, uploadBytesResumable, ref } from "firebase/storage";
import { collection, doc, getDoc, setDoc } from "@firebase/firestore";

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
const iconImg: any = vueref("/noicon.png");
const iconFileName: any = vueref("");
const currentAuth = getAuth();
const router = useRouter();
const file: any = vueref();
const haveIcon: any = vueref(false);
const profileValue: any = vueref("");

// ログイン状態の場合の処理
onAuthStateChanged(currentAuth, (currentUser) => {
  if (currentUser) {
    router.push("/home");
  }
});

// アイコン画像プレビュー処理
const previewImage = (event: any) => {
  haveIcon.value = true;
  let reader = new FileReader();
  reader.onload = function (e: any) {
    iconImg.value = e.target.result;
  };
  reader.readAsDataURL(event.target.files[0]);
  file.value = event.target.files[0];
  iconFileName.value = event.target.files[0].name;
  console.log(haveIcon.value);
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
            const loginUserCollectionRef = collection(db, "users");
            const docRef: any = doc(loginUserCollectionRef, currentUserId);
            console.log(currentUserId);
            const userDoc: any = getDoc(docRef).then(() => {
              //exists()でドキュメントの存在の有無を確認
              if (!userDoc.exists) {
                // アイコンが未登録の場合
                if (iconImg.value !== "/noicon.png") {
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
                } else {
                  setDoc(docRef, {
                    userId: currentUserId,
                    userName: user.userName,
                    name: user.name,
                    icon: "",
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
console.log(haveIcon.value);
</script>

<template>
  <section class="signup-view">
    <div class="register_wrapper">
      <img src="/mobileLogo.png" alt="firstgram" class="icon" />
      <form @submit.prevent class="form">
        <!-- <div class="no_user_icon" v-if="!haveIcon.value">
          <img src="/noIcon.png" alt="noユーザーアイコン" />
        </div> -->
        <div class="user_icon">
          <img
            :src="iconImg"
            alt="ユーザーアイコン"
            v-if="iconImg !== undefined"
          />
        </div>
        <div class="icon_form">
          <label htmlFor="iconPreview" class="label">
            <p class="add_icon">+</p>
          </label>
          <input
            type="file"
            name="iconPreview"
            @change="previewImage"
            accept=".png, .jpeg, .jpg"
            id="iconPreview"
            class="icon_input"
          />
        </div>
        <EmailField v-model="user.email" class="margin_bottom" />
        <NameField v-model="user.name" class="margin_bottom" />
        <ProfileField v-model="user.profile" class="margin_bottom" />
        <UserNameField v-model="user.userName" class="margin_bottom" />
        <PasswordField v-model="user.password" class="margin_bottom" />
        <CPasswordField v-model="user.cPassword" />
        <p v-if="user.password !== user.cPassword" class="error_text">
          パスワードが一致していません
        </p>
        <div
          v-if="user.password !== user.cPassword || isSignupButtonDisabled"
          class="register_gray_button"
        >
          登録する
        </div>
        <button
          :disabled="isSignupButtonDisabled"
          @click="loginButtonPressed"
          class="register_button"
          v-else
        >
          登録する
        </button>
      </form>
      <div class="have_account">
        <p>アカウントをお持ちですか？</p>
        <a href="/login" class="login">ログインする</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.icon {
  margin: 0 auto;
}
.register_wrapper {
  width: 400px;
  border: none;
  background: #fff;
  margin: 30px auto;
  padding-bottom: 20px;
  padding-top: 10px;
}
.form {
  margin: 20px 50px 30px 50px;
  position: relative;
}
.icon_input {
  display: none;
}
.icon_form {
  color: #fff; /* ラベルテキストの色を指定する */
  background-color: #1596f7; /* ラベルの背景色を指定する */
  padding: 5px 5px 5px 6px; /* ラベルとテキスト間の余白を指定する */
  border: none; /* ラベルのボーダーを指定する */
  border-radius: 50%;
  width: 30px;

  aspect-ratio: 1/1;
  position: absolute;
  top: 70px;
  right: 90px;
}
.add_icon {
  font-size: 27px;
  font-weight: bold;
  line-height: 14px;
}
.register_button {
  background-color: #1596f7;
  color: white;
  font-weight: bold;
  border-radius: 10px;
  width: 100%;
  margin: 30px 0;
  padding: 3px;
  height: 32px;
}

.register_gray_button {
  background-color: #67b6fa;
  color: white;
  font-weight: bold;
  border-radius: 10px;
  width: 100%;
  margin: 30px 0;
  padding: 3px;
  height: 32px;
  font-size: 14px;
  text-align: center;
}
.register_gray_button:hover {
  cursor: default;
}
.have_account {
  display: flex;
  font-size: 14px;
  justify-content: center;
}
.login {
  font-weight: bold;
  color: #1596f7;
  margin-left: 10px;
}
.login:hover {
  opacity: 0.6;
}
.margin_bottom {
  margin-bottom: 5px;
}
.no_user_icon {
  border-radius: 50%;
  width: 30%;
  aspect-ratio: 1/1;
  border: solid 1px lightgray;
  background-color: lightgray;
  margin: 0 auto 40px auto;
}
.user_icon > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
.user_icon {
  border-radius: 50%;
  width: 30%;
  aspect-ratio: 1/1;
  border: solid 1px lightgray;
  background-color: #fff;
  margin: 0 auto 40px auto;
}
.user_icon > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
.error_text {
  color: red;
  font-weight: bold;
}
</style>
