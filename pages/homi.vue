<script setup>
import { ref, onMounted } from "vue";

// Data & State
const products = ref([]);
const currentPage = ref(1); // Halaman aktif
const perPage = 6; // Jumlah produk per halaman
const totalProducts = ref(0); // Total produk di database
const totalPages = ref(0); // Total halaman
const loading = ref(false); // State untuk loading

const slides = ref([]);
const currentIndex = ref(0);
const prevIndex = ref(null);
const loadings = ref(true);

const categories = ref([]); // Data kategori
let autoSlideInterval = null;

// Auto-slide setiap 5 detik
const startAutoSlide = () => {
  if (autoSlideInterval) clearInterval(autoSlideInterval); // Bersihkan interval sebelumnya
  if (slides.value.length > 0) {
    autoSlideInterval = setInterval(() => {
      prevIndex.value = currentIndex.value;
      currentIndex.value = (currentIndex.value + 1) % slides.value.length;
    }, 5000);
  }
};

// Fungsi untuk mengubah slide berdasarkan index
const goToSlide = (index) => {
  prevIndex.value = currentIndex.value;
  currentIndex.value = index;
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

// Fetch produk berdasarkan pagination dari API server
const fetchProducts = async (page = 1) => {
  loading.value = true;
  try {
    const response = await $fetch(`/api/products`, {
      query: { page, perPage },
    });

    if (response.success) {
      products.value = response.products;
      totalProducts.value = response.totalProducts;
      totalPages.value = response.totalPages;
      currentPage.value = page;
    } else {
      console.error("Error fetching products:", response.error);
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  } finally {
    loading.value = false;
  }
};

// Fetch kategori dari API server
const fetchCategories = async () => {
  try {
    const response = await $fetch(`/api/categories`);
    if (response.success) {
      categories.value = response.categories;
    } else {
      console.error("Error fetching categories:", response.error);
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

// Fetch slides dari API server
const fetchSlides = async () => {
  try {
    const response = await $fetch(`/api/sliders`);
    if (response.success) {
      slides.value = response.slides;
      if (slides.value.length > 0) {
        startAutoSlide();
      }
    } else {
      console.error("Error fetching slides:", response.error);
    }
  } catch (error) {
    console.error("Error fetching slides:", error);
  } finally {
    loadings.value = false;
  }
};

// Inisialisasi data saat komponen dimount
onMounted(() => {
  fetchProducts(); // Ambil data produk halaman pertama
  fetchSlides(); // Ambil data slides
  fetchCategories(); // Ambil data kategori
});
</script>

<template>
  <!-- Bagian Header -->
  <div>
    <NavBar />
  </div>

  <!-- Slider Section -->
  <div class="container mx-auto relative flex justify-center items-center w-full h-72 bg-black md:rounded-3xl overflow-hidden">
    <div
      v-for="(slide, index) in slides"
      :key="slide.id"
      class="absolute inset-0 w-full h-full transition-all duration-700 ease-in-out"
      :class="{
        'opacity-100 z-10 translate-x-0': index === currentIndex,
        'opacity-0 z-0 translate-x-full': index === prevIndex,
        'opacity-0 -z-10 translate-x-full': index !== currentIndex && index !== prevIndex,
      }"
    >
      <!-- Render gambar jika ada -->
      <img
        v-if="slide.imageURL"
        :src="slide.imageURL"
        :alt="slide.title || 'Slide Image'"
        class="absolute inset-0 w-full h-full object-cover"
      />

      <!-- Overlay untuk teks dan button -->
      <div
        v-if="slide.title || slide.description || slide.buttonText"
        class="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-center text-white px-6"
      >
        <h2 v-if="slide.title" class="text-2xl md:text-3xl font-bold">{{ slide.title }}</h2>
        <p v-if="slide.description" class="mt-2 text-sm md:text-lg">{{ slide.description }}</p>
        <a
          v-if="slide.buttonText && slide.buttonLink"
          :href="slide.buttonLink"
          class="mt-4 bg-white text-black px-4 py-2 rounded-lg font-semibold"
        >
          {{ slide.buttonText }}
        </a>
      </div>
    </div>

    <!-- Bullet navigation -->
    <div class="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2">
      <button
        v-for="(_, index) in slides.length"
        :key="index"
        @click="goToSlide(index)"
        class="w-3 h-3 rounded-full"
        :class="{
          'bg-white': currentIndex === index,
          'bg-gray-400': currentIndex !== index,
        }"
      />
    </div>
  </div>

  <!-- Kategori Produk -->
  <div class="py-4 container mx-auto flex flex-col px-4">
    <div class="py-4 flex overflow-x-auto">
      <div
        v-for="category in categories"
        :key="category.id"
        class="px-1 rounded-2xl"
      >
        <nuxt-link
          :to="`/categories/${category.name}`"
          class="px-4 py-3 rounded-xl bg-slate-300 font-bold text-nowrap"
        >
          {{ category.name }}
        </nuxt-link>
      </div>
    </div>
  </div>

  <!-- Produk -->
  <div class="container mx-auto flex px-4 py-4">
    <div v-if="loading" class="w-full flex justify-center items-center py-4">
      <div class="text-xl">Loading...</div>
    </div>
    <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div class="rounded-2xl" v-for="product in products" :key="product.id">
        <div class="hover:shadow-xl rounded-2xl">
          <nuxt-link :to="`/produk/${product.id}`">
            <div>
              <img :src="product.imageURL[0]" :alt="product.name" class="rounded-2xl" />
            </div>
            <div class="relative bg-gray-100 py-6 rounded-2xl border-4 md:border-8 border-white -mt-6 px-4">
              <div class="font-bold text-xl">{{ product.name }}</div>
              <div>{{ formatPrice(product.price) }}</div>
              <div class="pt-4">
                <nuxt-link
                  :to="`/produk/${product.id}`"
                  class="bg-[#8b5a2b] px-4 py-2 rounded-full text-white"
                >
                  Detail
                </nuxt-link>
              </div>
            </div>
          </nuxt-link>
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