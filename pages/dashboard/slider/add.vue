<script setup>
import { ref } from 'vue';
import { useRouter, useNuxtApp } from "#app";
import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore";

// State untuk form dan status
const title = ref('');
const description = ref('');
const imageURL = ref('');
const buttonText = ref('');
const buttonLink = ref('');
const loading = ref(false);
const uploading = ref(false);

// Akses Firebase melalui useNuxtApp
const { $db } = useNuxtApp();
const router = useRouter();

// Fungsi untuk mengunggah gambar ke Cloudinary
const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    uploading.value = true;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'Sabilaweb'); // Ganti dengan upload preset Cloudinary
    formData.append('cloud_name', 'dj6we26m8'); // Ganti dengan nama Cloudinary Anda

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dj6we26m8/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      imageURL.value = data.secure_url;

      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      uploading.value = false;
    }
  }
};

definePageMeta({
  middleware: "auth",
});

// Fungsi untuk menambah slide ke Firestore
const handleSubmit = async () => {
  loading.value = true;

  try {
    // Tambahkan data ke koleksi "sliders"
    await addDoc(collection($db, "sliders"), {
      title: title.value,
      description: description.value,
      imageURL: imageURL.value,
      buttonText: buttonText.value,
      buttonLink: buttonLink.value,
      order: new Date().getTime(),
    });

    alert('Slide added successfully!');
    router.push('/dashboard/slider'); // Redirect ke halaman pengelolaan slide
  } catch (error) {
    console.error('Error adding slide:', error);
    alert('Failed to add slide. Please try again.');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="p-8">
    <div class="py-4">
      <div class="w-full text-black">
        <div class="flex justify-start items-center">
          <button
            class="flex bg-black/20 backdrop-blur-2xl rounded-full px-4 py-3 text-white"
            @click="router.back"
          >
            Back
          </button>
        </div>
      </div>
    </div>
    <h1 class="text-2xl font-bold mb-6">Add New Slide</h1>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-lg mb-2">Title</label>
        <input
          type="text"
          v-model="title"
          class="border px-4 py-2 rounded w-full"
        />
      </div>

      <div>
        <label class="block text-lg mb-2">Description</label>
        <textarea
          v-model="description"
          class="border px-4 py-2 rounded w-full"
        />
      </div>

      <div>
        <label class="block text-lg mb-2">Upload Image</label>
        <input
          type="file"
          @change="handleImageUpload"
          class="border px-4 py-2 rounded w-full"
        />
        <p v-if="uploading">Uploading image...</p>
        <img v-if="imageURL" :src="imageURL" alt="Uploaded" class="mt-2 w-32 h-auto" />
      </div>

      <div>
        <label class="block text-lg mb-2">Button Text</label>
        <input
          type="text"
          v-model="buttonText"
          class="border px-4 py-2 rounded w-full"
        />
      </div>

      <div>
        <label class="block text-lg mb-2">Button Link</label>
        <input
          type="url"
          v-model="buttonLink"
          class="border px-4 py-2 rounded w-full"
        />
      </div>

      <button
        type="submit"
        class="bg-blue-500 text-white px-4 py-2 rounded-lg"
        :disabled="loading || uploading"
      >
        {{ loading ? 'Adding...' : 'Add Slide' }}
      </button>
    </form>
  </div>
</template>