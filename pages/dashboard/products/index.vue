<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useNuxtApp } from "#app";
import { collection, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";

import NavBarDash from "../components/NavBarDash"

const { $db, $auth } = useNuxtApp();
const router = useRouter();

const products = ref([]);

const fetchProducts = async () => {
  try {
    const q = query(collection($db, "products"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    products.value = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        categories: Array.isArray(data.categories)
          ? data.categories
          : data.categories
          ? data.categories.split(",").map((cat) => cat.trim())
          : [],
      };
    });
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

const deleteProduct = async (productId) => {
  if (!confirm("Are you sure you want to delete this product?")) {
    return;
  }

  try {
    await deleteDoc(doc($db, "products", productId));
    products.value = products.value.filter((product) => product.id !== productId);
    alert("Product deleted successfully!");
  } catch (error) {
    console.error("Error deleting product:", error);
    alert("Failed to delete the product. Please try again.");
  }
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const keluar = async () => {
  try {
    await $auth.signOut();
    alert("Logout successful!");
    router.push("/"); // Redirect ke halaman utama
  } catch (error) {
    console.error("Error during logout:", error);
    alert("Logout failed. Please try again.");
  }
};

const { $user } = useNuxtApp();

definePageMeta({
  middleware: "auth",
  ssr: false,
});

onMounted(() => {
  
    fetchProducts(); // Fetch produk hanya jika pengguna login
});
</script>

<template>
  <div class="flex">
    <NavBarDash />
  </div>
  <div class="px-4 py-2">
    <div className="flex-1 justify-between items-center">
        <div>
          Dashboard
        </div>
        <div>
          <button @click="keluar">
            Logout
          </button>
        </div>
      </div>
  </div>
  <div class="py-2"></div>
  <div class="px-3 py-3 container mx-auto flex-1">
  <div>
       <nuxt-link to="/dashboard/products/add" class="px-4 py-2 bg-green-600
       rounded-full text-white text-nowrap">Add Product</nuxt-link>
  </div>
  <div class="py-4"></div>
  <div class="overflow-x-auto rounded-xl">
    <table class="w-full border-collapse border border-gray-300">
      <thead>
        <tr>
          <th class="border border-gray-300 px-4 py-2">Image</th>
          <th class="border border-gray-300 px-4 py-2">Name</th>
          <th class="border border-gray-300 px-4 py-2">Price</th>
          <th class="border border-gray-300 px-4 py-2">Category</th>
          <th class="border border-gray-300 px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id" class="border-b">
          <td class="border border-gray-300 px-4 py-2">
            <img
              :src="product.imageURL[0]"
              alt="Product Image"
              class="w-24 h-auto object-cover"
            />
          </td>
          <td class="border border-gray-300 px-4 py-2">{{ product.name }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ formatPrice(product.price) }}</td>
          <td class="border border-gray-300 px-4 py-2">
            <div v-if="product.categories && product.categories.length > 0">
              <div
                v-for="(cat, index) in product.categories"
                :key="index"
                class="bg-black text-white px-2 py-1 rounded-full inline-block mr-2 mb-1 text-nowrap"
              >
                {{ cat }}
              </div>
            </div>
            <div v-else>
              <span class="text-gray-500">No Categories</span>
            </div>
          </td>
          <td class="border border-gray-300 px-4 py-2">
            <router-link :to="`/dashboard/products/edit/${product.id}`">
              <button class="bg-blue-500 text-white px-4 py-2 rounded-full">
                Edit
              </button>
            </router-link>
            <button
              @click="deleteProduct(product.id)"
              class="bg-red-500 text-white px-4 py-2 rounded-full mt-2"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  </div>
</template>
