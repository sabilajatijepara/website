<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useNuxtApp } from "#app"; // Digunakan untuk akses route dan Firebase
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

const { $db } = useNuxtApp();
const route = useRoute();

// State utama
const products = ref([]);
const isLoading = ref(false);
const error = ref("");
const category = ref(route.params.category || ""); // Ambil kategori dari URL

// Fetch produk berdasarkan kategori
const fetchProductsByCategory = async () => {
  try {
    if (!$db) {
      throw new Error("Firestore is not initialized");
    }

    isLoading.value = true;
    error.value = "";

    console.log("Fetching products for category:", category.value);

    const q = query(collection($db, "products"), where("categories", "array-contains", category.value));

    const querySnapshot = await getDocs(q);

    products.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Products fetched:", products.value);
  } catch (err) {
    console.error("Error fetching products:", err);
    error.value = "Gagal mengambil produk. Silakan coba lagi.";
  } finally {
    isLoading.value = false;
  }
};

// Panggil fetch data saat mounted
onMounted(() => {
  fetchProductsByCategory();
});

useHead({
  title: `Produk ${category.value} - CV. Sabilajati Jepara`,
  meta: [
    { name: "description", content: `Lihat semua produk ${category.value} di toko kami.` },
  ],
});
</script>
<template>
  <!-- Kontainer Utama -->
  <div class="">
    <NavBar />
  </div>

  <!-- Daftar Produk -->
  <div class="container mx-auto py-4 px-4">
    <!-- Judul Kategori -->
    <div class="py-2 px-3 bg-slate-300 rounded-lg">
      <ol class="flex items-center whitespace-nowrap">
        <li class="inline-flex items-center">
          <span>{{ $t('Category') }}</span>
          <svg class="shrink-0 size-5 text-gray-400 dark:text-neutral-600 mx-2" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M6 13L10 3" stroke="currentColor" stroke-linecap="round"></path>
          </svg>
        </li>
        <li>
          <span>{{ category }}</span>
        </li>
      </ol>
    </div>
    <div class="py-4"></div>
    <!-- Loading atau Produk -->
    <div v-if="isLoading" class="text-center py-4">
      <p>{{ $t('Loading') }}</p>
    </div>
    <div v-else-if="error" class="text-center text-red-500">
      <p>{{ error }}</p>
    </div>
    <div v-else>
      <!-- Kondisi Produk Tidak Ada -->
      <div v-if="products.length === 0" class="text-center py-4 text-lg font-semibold text-gray-600">
        {{ $t('Product NF') }}
      </div>

      <!-- Produk -->
      <div v-else class="grid grid-cols-2 gap-4">
        <div class="rounded-2xl" v-for="product in products" :key="product.id">
          <div>
            <img :src="product.imageURL[0]" :alt="product.name" class="rounded-2xl" />
          </div>
          <div class="relative bg-gray-100 py-6 rounded-2xl border-4 md:border-8 border-white -mt-6 px-4">
            <div class="font-bold text-xl">{{ product.name }}</div>
            <div class="">{{ formatPrice(product.price) }}</div>
            <div class="pt-4">
              <nuxt-link
                :to="`/products/${product.id}`"
                class="bg-[#8b5a2b] px-4 py-2 rounded-full text-white"
              >
                Detail
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div class="container mx-auto py-4">
    <Footer />
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import Footer from "@/components/Footer.vue";

// Fungsi format harga
const formatPrice = (price) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export default {
  components: {
    NavBar,
    Footer,
  },
};
</script>