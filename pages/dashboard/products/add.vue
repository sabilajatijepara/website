<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useNuxtApp } from "#app";
import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore";
import axios from "axios";

// Firebase database
const { $db } = useNuxtApp();
const router = useRouter();

// Form fields
const name = ref("");
const price = ref("");
const description = ref("");
const categories = ref([]); // Array untuk menyimpan kategori yang dipilih
const selectedCategories = ref([]); // Array kategori terpilih

const name_en = ref("");
const desc_en = ref("");

// Data kategori
const isLoading = ref(true);

// Gambar
const images = ref([]);
const uploadResult = ref([]);
const uploadedImages = ref([]);
const uploadProgress = ref(0); // Track overall progress
const cekUp = ref(false);
const isUploading = ref(false); // Track overall upload status
const totalBytes = ref(0); // Total bytes of all files
const error = ref(null);
const file = ref([]);
const progress = ref(0);

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
  } finally {
    isLoading.value = false;
  }
};

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
      uploadResult.value.push(response.data.secure_url);
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

// Fungsi untuk mengubah nama jadi slug
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // hapus karakter aneh
    .replace(/\s+/g, '-') // ganti spasi dengan -
    .replace(/--+/g, '-'); // hilangkan double dash
};

const generateUniqueSlug = async (name, currentId = null) => {
  const baseSlug = generateSlug(name);
  let uniqueSlug = baseSlug;
  let counter = 1;

  const snapshot = await getDocs(collection($db, "products"));
  const products = snapshot.docs.map(doc => ({
    id: doc.id,
    slug: doc.data().slug
  }));

  const isDuplicate = (slug) => {
    return products.some(
      (product) => product.slug === slug && product.id !== currentId
    );
  };

  while (isDuplicate(uniqueSlug)) {
    counter++;
    uniqueSlug = `${baseSlug}-${counter}`;
  }

  return uniqueSlug;
};

const generateUniqueSlug_en = async (name_en, currentId = null) => {
  const baseSlug = generateSlug(name_en);
  let uniqueSlug = baseSlug;
  let counter = 1;

  const snapshot = await getDocs(collection($db, "products"));
  const products = snapshot.docs.map(doc => ({
    id: doc.id,
    slug: doc.data().slug_en
  }));

  const isDuplicate = (slug) => {
    return products.some(
      (product) => product.slug_en === slug && product.id !== currentId
    );
  };

  while (isDuplicate(uniqueSlug)) {
    counter++;
    uniqueSlug = `${baseSlug}-${counter}`;
  }

  return uniqueSlug;
};

// Submit data produk
const handleSubmit = async () => {
  if (uploadResult.value.length === 0) {
    alert("Please upload images before submitting.");
    return;
  }

  try {
    await addDoc(collection($db, "products"), {
      name: name.value,
      name_en: name_en.value,
      slug: await generateUniqueSlug(name.value),
      slug_en: await generateUniqueSlug_en(name_en.value),
      price: parseFloat(price.value),
      description: description.value,
      desc_en: desc_en.value,
      categories: selectedCategories.value, // Simpan array kategori yang dipilih
      imageURL: uploadResult.value,
      createdAt: Timestamp.now(),
    });
    alert("Product added successfully!");
    router.push("/dashboard/products");
  } catch (error) {
    console.error("Error adding product:", error);
    alert("Failed to add product. Please try again.");
  }
};

definePageMeta({
  middleware: "auth",
});

// Fetch kategori saat komponen dimuat
onMounted(() => {
  fetchCategories();
});
</script>

<template>
  <div class="p-8">
    <div class="w-full text-black">
      <div class="flex justify-start items-center">
        <button
          class="flex bg-black/20 backdrop-blur-2xl rounded-full px-4 py-3 text-white"
          @click="router.back()"
        >
          Back
        </button>
      </div>
    </div>
    <div class="py-4"></div>
    <h1 class="text-2xl font-bold mb-6">Add New Product</h1>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Nama Produk -->
      <div>
        <label for="name" class="block">Product Name (ID)</label>
        <input
          v-model="name"
          type="text"
          id="name"
          class="border p-2 w-full"
          required
        />
      </div>
      <div>
        <label for="name_en" class="block">Product Name (EN)</label>
        <input
          v-model="name_en"
          type="text"
          id="name_en"
          class="border p-2 w-full"
          required
        />
      </div>
      <div>
        <p class="text-sm text-gray-500 mt-1">
          Slug (ID): {{ generateSlug(name) }}
        </p>
      </div>
      <div>
        <p class="text-sm text-gray-500 mt-1">
          Slug (EN): {{ generateSlug(name_en) }}
        </p>
      </div>
      <!-- Harga Produk -->
      <div>
        <label for="price" class="block">Price</label>
        <input
          v-model="price"
          type="number"
          id="price"
          class="border p-2 w-full"
          
        />
      </div>
      <!-- Kategori Produk -->
      <div>
        <label for="category" class="block">Categories</label>
        <div v-if="isLoading" class="text-gray-500">Loading categories...</div>
        <div v-else>
          <div
            v-for="category in categories"
            :key="category.id"
            class="flex items-center space-x-2"
          >
            <input
              type="checkbox"
              :value="category.name"
              v-model="selectedCategories"
              id="category-{{ category.id }}"
            />
            <label :for="category.id">{{ category.name }}</label>
          </div>
        </div>
      </div>
      <!-- Deskripsi Produk -->
      <div>
        <label for="description" class="block">Description (ID)</label>
        <textarea
          v-model="description"
          id="description"
          class="border p-2 w-full"
          required
        />
      </div>
      <div>
        <label for="desc_en" class="block">Description (EN)</label>
        <textarea
          v-model="desc_en"
          id="desc_en"
          class="border p-2 w-full"
          required
        />
      </div>
      <!-- Upload Gambar -->
      <div>
        <label for="images" class="block">Product Images</label>
        <input
          type="file"
          id="images"
          multiple
          @change="file = $event.target.files"
          class="border p-2 w-full"
        />
        <button
          type="button"
          @click="uploadImage"
          class="bg-blue-500 text-white px-4 py-2 mt-2"
          :disabled="isUploading"
        >
          Upload Images
        </button>
        <div v-if="isUploading" class="text-gray-500 text-sm mt-2">
          Upload Progress: {{ uploadProgress }}%
        </div>
      </div>
      <!-- Tombol Submit -->
      <div>
        <button
          type="submit"
          class="bg-blue-500 text-white px-4 py-2"
          :disabled="uploadedImages.value?.length === 0"
        >
          Add Product
        </button>
      </div>
    </form>
  </div>
</template>
