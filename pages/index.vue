<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useNuxtApp } from "#app";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

// SEO

useHead({
        title: "CV. Sabilajati Jepara", // Title halaman
        meta: [
          { name: "description", content: "Kami adalah produsen meja kursi sekolah, meja kursi cafe, serta gazebo dan bungalow" },
          { name: "keywords", content: "Mebel jepara, meubel jepara, kursi meja cafe, meja kursi sekolah, jasa pembuatan gazebo, jasa pembuatan bungalow, furniture custom" }, // Meta keywords
          { property: "og:title", content: "CV. Sabilajati Jepara" }, // Open Graph Title
          { property: "og:description", content: "Kami adalah produsen meja kursi sekolah, meja kursi cafe, serta gazebo dan bungalow" }, // Open
          /* { property: "og:image", content: product.value.imageURL[0] }, //
          Open Graph Image */
        ],
});

const { $db } = useNuxtApp();
const router = useRouter();

const products = ref([]);
const currentPage = ref(1); // Halaman aktif
const perPage = 4; // Jumlah produk per halaman
const totalProducts = ref(0); // Total produk di database
const totalPages = ref(0); // Total halaman
const loading = ref(false); // State untuk loading

// Mengambil produk berdasarkan pagination
const fetchProducts = async (page = 1) => {
  loading.value = true; // Set loading menjadi true saat mulai mengambil data
  try {
    const offset = (page - 1) * perPage;
    const q = query(
      collection($db, "products"),
      orderBy("createdAt", "desc"),
      limit(offset + perPage)
    );

    // Ambil total produk (hanya sekali di halaman pertama)
    if (page === 1) {
      const totalQuery = query(collection($db, "products"));
      const totalSnapshot = await getDocs(totalQuery);
      totalProducts.value = totalSnapshot.size; // Simpan total produk
      totalPages.value = Math.ceil(totalProducts.value / perPage); // Hitung total halaman
    }

    const querySnapshot = await getDocs(q);

    // Filter data sesuai halaman
    const allProducts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    products.value = allProducts.slice(offset, offset + perPage);
    currentPage.value = page;
  } catch (error) {
    console.error("Error fetching products:", error);
  } finally {
    loading.value = false; // Set loading menjadi false setelah data selesai diambil
  }
};

// Format harga IDR
const formatPrice = (price) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

onMounted(() => {
  fetchProducts(); // Ambil data untuk halaman pertama
});
</script>

<template>
  <!-- Bagian Header -->
  <div class="px-4 py-2">
    <NavBar />
  </div>

  <!-- Banner -->
  <div class="px-4 container mx-auto flex">
    <div class="w-full h-72 justify-center items-center bg-gray-300 overflow-hidden rounded-2xl">
      <img
        src="https://unsplash.com/photos/URGPh9yIiI8/download?force=true&w=1920"
        alt=""
        class="w-full h-full object-cover"
      />
    </div>
  </div>

  <!-- Kategori Produk -->
  <div class="py-4 container mx-auto flex flex-col px-4">
    <!--<div class="pb-4 font-bold text-2xl">Kategori Produk</div>-->
    <div class="py-4 flex space-x-2 overflow-x-auto">
      <div class="rounded-2xl">
        <nuxt-link :to="`/categories/Cafe`" class="px-4 py-3 rounded-xl bg-slate-300 font-bold">Cafe</nuxt-link>
      </div>
      <div class="rounded-2xl">
        <nuxt-link :to="`/categories/Sekolah`" class="px-4 py-3 rounded-xl bg-slate-300 font-bold">Sekolah</nuxt-link>
      </div>
      <div class="rounded-2xl">
        <nuxt-link :to="`/categories/Satu Set`" class="px-4 py-3 rounded-xl
        bg-slate-300 font-bold">Set</nuxt-link>
      </div>
      <div class="rounded-2xl">
        <nuxt-link :to="`/categories/Rumah`" class="px-4 py-3 rounded-xl
        bg-slate-300 font-bold">Rumah</nuxt-link>
      </div>
      <div class="rounded-2xl">
        <nuxt-link :to="`/categories/Gazebo`" class="px-4 py-3 rounded-xl
        bg-slate-300 font-bold">Gazebo</nuxt-link>
      </div>
    </div>
  </div>

  <!-- Produk -->
  <div class="container mx-auto flex px-4 py-4">
    <div v-if="loading" class="w-full flex justify-center items-center py-4">
      <div class="text-xl">Loading...</div> <!-- Menampilkan loading saat data sedang dimuat -->
    </div>
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

  <!-- Pagination -->
  <div v-if="!loading" class="flex justify-center mt-8 space-x-2">
    <button
      v-for="page in totalPages"
      :key="page"
      :class="['px-4 py-2 rounded-full', currentPage === page ? 'bg-slate-400 text-white' : 'border border-black']"
      @click="fetchProducts(page)"
    >
      {{ page }}
    </button>
  </div>
  <div class="py-2"></div>
  <div class="py-4">
    <div class="px-4 container mx-auto flex">
      <div class="bg-slate-300 overflow-hidden rounded-2xl px-6 md:px-12 py-8
      md:py-12">
        <div class="relative grid grid-cols-2 gap-2 justify-items-center content-center w-full">
          <div class="place-items-center">
            <div class="relative text-2xl font-bold z-40 md:text-4xl
            backdrop-invert-0
            drop-shadow-2xl">Ingin
            Membuat Furniture Impian Anda?</div>
          </div>
          <div class="absolute z-10 inset-y-0 right-0">
            <img class="size-48 md:size-64"
            src="http://www.jatijeparamebel.com/wp-content/uploads/2020/05/Slide-JJM1.png"
            alt="" />
          </div>
        </div>
        <div class="py-4"></div>
        <div class="flex relative justify-center items-center">
          <div class="relative z-40 grid grid-cols-1 gap-4 justify-items-center content-center">
            <div class="">
              <nuxt-link class="px-4 py-3 bg-green-700 rounded-full
              text-white">Hubungi Kami Sekarang!</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div class="container mx-auto flex py-4">
    <Footer />
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import Footer from "@/components/Footer.vue";

export default {
  components: {
    NavBar,
    Footer,
  },
};
</script>