<template>
  <div>
    <input type="file" @change="onFileChange" ref="fileInput" />
    <img v-if="preview" :src="preview" />
  </div>
</template>

<script>
import useImagePreview from './imagePreview';

export default {
    
  setup() {
    const { file, preview } = useImagePreview();

    const onFileChange = (event) => {
      file.value = event.target.files[0];
      console.log()
    };

    return {
      file,
      preview,
      onFileChange,
    };
  },
};
</script>
