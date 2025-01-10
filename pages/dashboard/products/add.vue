<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useNuxtApp } from "#app";
import { collection, getDocs, addDoc, doc } from "firebase/firestore";
import axios from "axios";

// Firebase database
const { $db } = useNuxtApp();
const router = useRouter();

// Form fields
const name = ref("");
const price = ref("");
const description = ref("");
const category = ref("");

// Data kategori
const categories = ref([]);
const isLoading = ref(true);

// Gambar
const images = ref([]); // Pastikan ini selalu berupa array
const uploadedImages = ref([]);
const uploadProgress = ref({});

// Fetch kategori
const fetchCategories = async () => {
  isLoading.value = true;
  try {
    const snapshot = await getDocs(collection($db, "categories"));
    categories.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    categories.value = error;
  }
   finally {
    isLoading.value = false;
  }
};

// Upload gambar
const handleImageUpload = async () => {

  const promises = images.value.map((file, index) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Sabilaweb");
    formData.append("cloud_name", "dj6we26m8");

    return axios.post("https://api.cloudinary.com/v1_1/dj6we26m8/image/upload", formData, {
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        uploadProgress.value[index] = progress;
      },
    });
  });

  try {
    const responses = await Promise.all(promises);
    uploadedImages.value = responses.map((res) => res.data.secure_url);
    alert("Images uploaded successfully!");
  } catch (error) {
    console.error("Error uploading images:", error);
  }
};

// Submit data produk
const handleSubmit = async () => {
  try {
    await addDoc(collection($db, "products"), {
      name: name.value,
      price: parseFloat(price.value),
      description: description.value,
      category: category.value,
      imageURL: uploadedImages.value,
    });

    alert("Product added successfully!");
    router.push("/dashboard/products");
  } catch (error) {
    console.error("Error adding product:", error);
    alert("Failed to add product. Please try again.");
  }
};

// Fetch kategori saat komponen dimuat
onMounted(() => {
  fetchCategories();
});
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-6">Add New Product</h1>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Nama Produk -->
      <div>
        <label for="name" class="block">Product Name</label>
        <input v-model="name" type="text" id="name" class="border p-2 w-full" required />
      </div>

      <!-- Harga Produk -->
      <div>
        <label for="price" class="block">Price</label>
        <input v-model="price" type="number" id="price" class="border p-2 w-full" required />
      </div>

      <!-- Kategori Produk -->
      <div>
        <label for="category" class="block">Category</label>
        <div v-if="isLoading" class="text-gray-500">Loading categories...</div>
        <div v-else>
          <select v-model="category" id="category" class="border p-2 w-full" required>
            <option value="" disabled>Select a category</option>
            <option v-for="category in categories"
            :key="category.id" :value="category.name">
              {{ category.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Deskripsi Produk -->
      <div>
        <label for="description" class="block">Description</label>
        <textarea v-model="description" id="description" class="border p-2 w-full" required />
      </div>

      <!-- Upload Gambar -->
      <div>
        <label for="images" class="block">Product Images</label>
        <input
          type="file"
          id="images"
          multiple
          @change="(e) => (images.value = Array.from(e.target.files || []))"
          class="border p-2 w-full"
        />
        <button
          type="button"
          @click="handleImageUpload"
          class="bg-blue-500 text-white px-4 py-2 mt-2"
          :disabled="!images.value || images.value.length === 0"
        >
          Upload Images
        </button>

        <div v-if="Object.keys(uploadProgress).length" class="text-gray-500 text-sm mt-2">
          <div v-for="(progress, index) in uploadProgress" :key="index">
            Image {{ index + 1 }} Upload Progress: {{ progress }}%
          </div>
        </div>
      </div>

      <!-- Tombol Submit -->
      <div>
        <button type="submit" class="bg-blue-500 text-white px-4 py-2">
          Add Product
        </button>
      </div>
    </form>
  </div>
</template>