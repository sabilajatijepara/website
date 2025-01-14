<script setup>
import { ref } from 'vue';
import axios from 'axios';

const file = ref([]);
const uploadResult = ref([]);
const error = ref(null);
const progress = ref(0);
const isUploading = ref(false);

const uploadImage = async () => {
  error.value = null;
  isUploading.value = true;
  if (file.value.length === 0) {
    error.value = 'Please select at least one image.';
    isUploading.value = false;
    return;
  }

  for (let i = 0; i < file.value.length; i++) {
    const formData = new FormData();
    formData.append('file', file.value[i]);
    formData.append('upload_preset', 'Sabilaweb');
    formData.append('cloud_name', 'dj6we26m8');
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dj6we26m8/image/upload`, // Ganti dengan Cloud Name Anda
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            progress.value = percentCompleted;
          },
        }
      );
      uploadResult.value.push(response.data);
      progress.value = 0; // Reset progress bar setelah setiap unggahan
    } catch (err) {
      error.value = err.message;
      progress.value = 0;
      console.error('Error uploading image:', err);
      isUploading.value = false;
      break; // Stop uploading if there's an error
    }
  }
  isUploading.value = false;
};
</script>

<template>
  <div>
    <input type="file" multiple @change="file = $event.target.files" />
    <button @click="uploadImage" :disabled="isUploading">Upload Images</button>
    <div v-if="isUploading">
      <p>Upload Progress: {{ progress }}%</p> </div>
    <div v-if="uploadResult.length > 0">
      <h3>Uploaded Successfully!</h3>
      <ul>
        <li v-for="result in uploadResult" :key="result.public_id">
          <p>URL: {{ result.secure_url }}</p>
          <img :src="result.secure_url" :alt="'Uploaded Image'" />
        </li>
      </ul>
    </div>
    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<style scoped>
.error {
  color: red;
}
</style>
