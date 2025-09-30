<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useNuxtApp, useRoute } from "#app";
import { collection, doc, getDocs, getDoc, updateDoc } from "firebase/firestore";
import axios from "axios";

// Firebase database
const { $db } = useNuxtApp();
const router = useRouter();
const route = useRoute();

// Form fields
const name = ref("");
const name_en = ref("");
const price = ref("");
const description = ref("");
const desc_en = ref("");
const slug = ref("");
const slug_en = ref("");

// Data kategori
const categories = ref([]);
const isLoading = ref(true);

// Gambar
const images = ref([]);
const uploadResult = ref([]);
const uploadedImages = ref([]);
const uploadProgress = ref(0);
const cekUp = ref(false);
const isUploading = ref(false);
const error = ref(null);
const file = ref([]);
const progress = ref(0);

const selectedCategories = ref([]);

// Fungsi untuk mengubah nama jadi slug
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // hapus karakter aneh
    .replace(/\s+/g, '-') // ganti spasi dengan -
    .replace(/--+/g, '-'); // hilangkan double dash
};

// Fetch kategori
const fetchCategories = async () => {
  isLoading.value = true;
  try {
    const snapshot = await getDocs(collection($db, "categories"));
    categories.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(categories.value);
  } catch (error) {
    console.error("Error fetching categories:", error);
  } finally {
    isLoading.value = false;
  }
};

// Fetch data produk berdasarkan ID
const fetchProduct = async (id) => {
  try {
    const productDoc = await getDoc(doc($db, "products", id));
    if (productDoc.exists()) {
      const productData = productDoc.data();
      name.value = productData.name;
      name_en.value = productData.name_en;
      slug.value = productData.slug;
      slug_en.value = productData.slug_en
      price.value = productData.price;
      description.value = productData.description;
      desc_en.value = productData.desc_en;
      selectedCategories.value = productData.categories;
      uploadedImages.value = productData.imageURL || [];
    } else {
      console.error("Produk tidak ditemukan.");
      router.push("/dashboard/products");
    }
  } catch (error) {
    console.error("Error fetching product:", error);
  }
};

// Upload gambar
const uploadImage = async () => {
  error.value = null;
  isUploading.value = true;
  if (file.value.length === 0) {
    error.value = "Please select at least one image.";
    isUploading.value = false;
    return;
  }

  for (let i = 0; i < file.value.length; i++) {
    const formData = new FormData();
    formData.append("file", file.value[i]);
    formData.append("upload_preset", "Sabilaweb");
    formData.append("cloud_name", "dj6we26m8");
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dj6we26m8/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            progress.value = percentCompleted;
          },
        }
      );
      uploadedImages.value.push(response.data.secure_url);
      progress.value = 0;
    } catch (err) {
      error.value = err.message;
      progress.value = 0;
      console.error("Error uploading image:", err);
      isUploading.value = false;
      break;
    }
  }
  isUploading.value = false;
};

// Hapus gambar dari daftar yang diunggah
const removeImage = (index) => {
  uploadedImages.value.splice(index, 1);
};

// Submit perubahan data produk
const handleSubmit = async () => {
  const productId = route.params.id;
  if (uploadedImages.value.length === 0) {
    alert("Please upload images before submitting.");
    return;
  }

  try {
    // Misalnya selectedCategories adalah array objek kategori
    const selectedCategoryNames = selectedCategories.value;
    
    /*console.log("Data yang akan dikirim:", {
      name: name.value,
      slug: generateSlug(name.value),
      price: parseFloat(price.value),
      description: description.value,
      categories: selectedCategoryNames,
      imageURL: uploadedImages.value,
    });*/

    await updateDoc(doc($db, "products", productId), {
      name: name.value,
      name_en: name_en.value,
      slug: await generateUniqueSlug(name.value, route.params.id),
      slug_en: await generateUniqueSlug(name_en.value, route.params.id),
      price: parseFloat(price.value),
      description: description.value,
      desc_en: desc_en.value,
      categories: selectedCategoryNames,
      imageURL: uploadedImages.value,
    });
    alert("Product updated successfully!");
    router.push("/dashboard/products");
  } catch (error) {
    console.error("Error updating product:", error);
    alert("Failed to update product. Please try again.");
  }
};

const toggleCategory = (category) => {
  if (selectedCategories.value.includes(category.name)) {
    selectedCategories.value = selectedCategories.value.filter(
      (name) => name !== category.name
    );
  } else {
    selectedCategories.value.push(category.name);
  }
};

definePageMeta({
  middleware: "auth",
});

// Fetch kategori dan data produk saat halaman dimuat
onMounted(() => {
  fetchCategories();
  const productId = route.params.id;
  fetchProduct(productId);
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
    <h1 class="text-2xl font-bold mb-6">Edit Product</h1>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Nama Produk -->
      <div>
        <label for="name" class="block">Product Name</label>
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
          Slug: {{ generateSlug(name) }}
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
        <label class="block">Category</label>
        <div v-if="isLoading" class="text-gray-500">Loading categories...</div>
        <div v-else>
          <div
            v-for="category in categories"
            :key="category.id"
            class="flex items-center gap-2"
          >
            <input
              type="checkbox"
              :value="category.name"
              v-model="selectedCategories"
              
              class="cursor-pointer"
            />
            <span>{{ category.name }}</span>
          </div>
        </div>
      </div>
      <!-- Deskripsi Produk -->
      <div>
        <label for="description" class="block">Description</label>
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
        <div v-if="uploadedImages.length">
          <h3 class="mt-4">Uploaded Images:</h3>
          <ul>
            <li
              v-for="(image, index) in uploadedImages"
              :key="index"
              class="mt-2 flex items-center gap-4"
            >
              <img :src="image" alt="" class="w-32 h-32 object-cover" />
              <button
                type="button"
                @click="removeImage(index)"
                class="bg-red-500 text-white px-4 py-2"
              >
                Hapus
              </button>
            </li>
          </ul>
        </div>
      </div>
      <!-- Tombol Submit -->
      <div>
        <button
          type="submit"
          class="bg-blue-500 text-white px-4 py-2"
          :disabled="isUploading"
        >
          Update Product
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.error {
  color: red;
}
</style>