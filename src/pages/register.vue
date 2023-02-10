<script>
import EmailField from "@/components/atoms/EmailField.vue";
import NameField from "@/components/atoms/NameField.vue";
import ProfileField from "@/components/atoms/ProfileField.vue";
import UserNameField from "@/components/atoms/UserNameField.vue";
import PasswordField from "@/components/atoms/PasswordField.vue";
import CPasswordField from "@/components/atoms/CPasswordField.vue";
import { reactive, ref } from "vue";
import SubmitButtonState from "@/components/atoms/SubmitBtnState";
import formValidation from "@/components/molecules/formValidation";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { useRouter } from "vue-router";
import { storage } from "firebase";
import { uploadBytesResumable } from '@firebase/storage';

export default {
  components: {
    EmailField,
    NameField,
    ProfileField,
    UserNameField,
    PasswordField,
    CPasswordField,
  },
  setup() {
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
    const url = ref("");
    const iconFileName = ref("");
    const currentAuth = getAuth();
    const router = useRouter();
    onAuthStateChanged(currentAuth, (currentUser) => {
      if (currentUser) {
        router.push("/");
      }
    });
    console.log(isSignupButtonDisabled);

    const previewImage = (event) => {
      let reader = new FileReader();
      reader.onload = function (e) {
        url.value = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
      iconFileName.value = event.target.files[0].name;
      console.log(iconFileName.value);
    };

    const loginButtonPressed = () => {
      console.log(user.password);
      // パスと名前で参照を作成
      const storageRef = ref(storage, "image/" + iconFileName.value);

      // // 画像のアップロード
      const uploadImage = uploadBytesResumable(storageRef, url);
      // uploadImage.on(
      //   "state_changed",
      //   // upload開始したらloading中になる(loadingがtrueになる)
      //   (snapshot) => {
      //     setLoading(true);
      //   },
      //   (err) => {
      //     <></>;
      //   },
      //   //upload完了したらloadedになる(loadingがfalse,loadedがtrue)
      //   () => {
      //     setLoading(false);
      //     setIsUploaded(true);

      //     getDownloadURL(storageRef).then((url) => {
      //       setImgSrc(url);
      //     });
      //   }
      // );
    };

    return {
      user,
      isSignupButtonDisabled,
      loginButtonPressed,
      previewImage,
      url,
    };
  },
};
</script>

<template>
  <section class="signup-view">
    <div>
      <img :src="url" alt="ユーザーアイコン" />
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
