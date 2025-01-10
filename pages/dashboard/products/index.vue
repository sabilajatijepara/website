<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useNuxtApp } from "#app";
import { collection, getDocs, addDoc, doc } from "firebase/firestore";
import axios from "axios";

const { $db } = useNuxtApp();
const router = useRouter();

const products = ref([]);

const fetchProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection($db, "products"));
    products.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(products);
  } catch (error) {
    console.error("Error fetching products:", error);
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

onMounted(() => {
  fetchProducts();
});
  
</script>

<template>
   <!-- Products Table -->
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
                :src="product.imageURL"
                alt="Product Image"
                class="w-24 h-auto object-cover"
              />
            </td>
            <td class="border border-gray-300 px-4 py-2">{{ product.name }}</td>
            <td class="border border-gray-300 px-4 py-2">{{ formatPrice(product.price) }}</td>
            <td class="border border-gray-300 px-4 py-2">
              <div class="bg-black text-white px-2 py-1 rounded-full">
                {{ product.category }}
              </div>
            </td>
            <td class="border border-gray-300 px-4 py-2">
              <router-link :to="`/dashboard/admin/products/edit/${product.id}`">
                <button class="bg-blue-500 text-white px-4 py-2 rounded-full">
                  Edit
                </button>
              </router-link>
              <button
                @click=""
                class="bg-red-500 text-white px-4 py-2 rounded-full mt-2"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
</template>