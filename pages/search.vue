<script setup>
import { ref, onMounted } from "vue";
import { collection, getDocs, query } from "firebase/firestore";
import { useNuxtApp, useRouter } from "#app";
import { useI18n } from "#imports";

const { $db } = useNuxtApp();
const router = useRouter();
const products = ref([]); // Semua produk
const searchResults = ref([]); // Hasil pencarian
const searchQuery = ref(""); // Query pencarian
const isLoading = ref(false);
const error = ref("");

const { t } = useI18n();

// SEO
useHead({
        title: () => `${t("Search Product")} — CV. Sabilajati Mebel Jepara`, // Title halaman
        meta: [
          { name: "description", content: "Kami adalah produsen meja kursi sekolah, meja kursi cafe, serta gazebo dan bungalow" },
          { name: "keywords", content: "Mebel jepara, meubel jepara, kursi meja cafe, meja kursi sekolah, jasa pembuatan gazebo, jasa pembuatan bungalow, furniture custom" }, // Meta keywords
          { property: "og:title", content: () => `${t("Search Product")} — CV. Sabilajati Mebel Jepara` }, // Open Graph Title
          { property: "og:description", content: "Kami adalah produsen meja kursi sekolah, meja kursi cafe, serta gazebo dan bungalow" }, // Open
          /* { property: "og:image", content: product.value.imageURL[0] }, //
          Open Graph Image */
        ],
        link: [
          {
          rel: 'canonical',
          href: 'https://sabilajati.com' + router.path,
          },
        ],
});

// Ambil semua produk dari Firestore
const fetchProducts = async () => {
  try {
    isLoading.value = true;
    error.value = "";
    const q = query(collection($db, "products"));
    const querySnapshot = await getDocs(q);

    products.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    searchResults.value = [...products.value]; // Tampilkan semua produk secara default
  } catch (err) {
    console.error("Error fetching products:", err);
    error.value = "Gagal memuat produk. Silakan coba lagi.";
  } finally {
    isLoading.value = false;
  }
};

// Fungsi untuk melakukan pencarian
const searchProducts = () => {
  if (!searchQuery.value) {
    searchResults.value = [...products.value]; // Jika query kosong, tampilkan semua produk
  } else {
    searchResults.value = products.value.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
};

// Panggil fetch data saat halaman dimuat
onMounted(() => {
  fetchProducts();
});
</script>

<template>
  <div>
    <!-- Header -->
    <NavBar />

    <!-- Form Pencarian -->
     <div class="container mx-auto py-4 px-4">
    <!-- Input Pencarian -->
    <div class="mb-4">
      <input
        v-model="searchQuery"
        @input="searchProducts"
        type="text"
        placeholder="Cari produk..."
        class="w-full px-4 py-2 border focus:border-slate-300 focus:ring-slate-300 rounded-lg"
      />
    </div>

    <!-- Hasil Pencarian -->
    <div v-if="isLoading" class="text-center py-4">
      <p>{{ $t('Loading') }}</p>
    </div>
    <div v-else-if="error" class="text-center text-red-500">
      <p>{{ error }}</p>
    </div>
    <div v-else>
      <!-- Tampilkan pesan jika tidak ada produk yang ditemukan -->
      <div v-if="searchResults.length === 0" class="text-center py-4">
        <p>{{ $t('Product NF') }}</p>
      </div>

      <!-- Daftar Produk -->
      <div v-else class="grid grid-cols-2 gap-4">
        
        <div
          v-for="product in searchResults"
          :key="product.id"
          class="rounded-2xl border p-4 hover:bg-gray-50"
        >
          <nuxt-link :to="`/products/${product.id}`">
          <img :src="product.imageURL[0]" :alt="product.name" class="rounded-2xl" />
          <h2 class="font-bold text-xl mt-2">{{ product.name }}</h2>
          <p>{{ formatPrice(product.price) }}</p>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import Footer from "@/components/Footer.vue";

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