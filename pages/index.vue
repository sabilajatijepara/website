<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAsyncData } from '#app';

import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

const { $db } = useNuxtApp();

// SEO
useHead({
        title: "Sabilajati Mebel Jepara — Meja Kursi Sekolah, Cafe, Gazebo, Bungalow", // Title halaman
        meta: [
          { name: "description", content: "Kami adalah produsen meja kursi sekolah, meja kursi cafe, serta gazebo dan bungalow" },
          { name: "keywords", content: "Mebel jepara, meubel jepara, kursi meja cafe, meja kursi sekolah, jasa pembuatan gazebo, jasa pembuatan bungalow, furniture custom" }, // Meta keywords
          { property: "og:title", content: "Sabilajati Mebel Jepara — Meja Kursi Sekolah, Cafe, Gazebo, Bungalow" }, // Open Graph Title
          { property: "og:description", content: "Kami adalah produsen meja kursi sekolah, meja kursi cafe, serta gazebo dan bungalow" }, // Open
          { property: "og:image", content: "https://res.cloudinary.com/doninmxbl/image/upload/kquaxae4iakjge8rlve6.png" }, 
        ],
        link: [
          {
          rel: 'canonical',
          href: 'https://sabilajati.com'
          },
        ],
    script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Sabilajati Mebel Jepara",
        "url": "https://sabilajati.com",
        "logo": "https://res.cloudinary.com/doninmxbl/image/upload/kquaxae4iakjge8rlve6.png",
        "description": "Kami adalah produsen meja kursi sekolah, meja kursi cafe, serta gazebo dan bungalow.",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Jl. Raya Jepara - Bangsri KM 6",
          "addressLocality": "Jepara",
          "addressRegion": "Jawa Tengah",
          "postalCode": "59452",
          "addressCountry": "ID"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+62 852-2520-8256",
          "contactType": "customer service"
        },
        "sameAs": [
          "https://www.facebook.com/sabilajatimebeljepara",
          "https://www.instagram.com/sabilajati_jepara",
          "https://wa.me/6285225208256"
        ]
      })
    }
  ]
});

const slides = ref([]);
const currentIndex = ref(0);
const prevIndex = ref(null);
const loadings = ref(true);

let autoSlideInterval = null;

const fetchSlides = async () => {
  try {
    const slidersCollection = collection($db, 'sliders');
    const q = query(slidersCollection);
    const snapshot = await getDocs(q);
    const slidesData = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => a.order - b.order);
    slides.value = slidesData;

    // Mulai auto-slide setelah data berhasil diambil
    if (slidesData.length > 0) {
      startAutoSlide();
    }
  } catch (error) {
    console.error('Error fetching slides:', error);
  } finally {
    loadings.value = false;
  }
};

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


const { data: categoryData } = await useAsyncData("categories", async () => {
  try {
    const response = await $fetch("/api/categories");
    return response.success ? response.categories : [];
  } catch (error) {
    console.error("Gagal mengambil Kategori:", error);
    return [];
  }
});

const computedCategory = computed(() => categoryData.value || []);


const perPage = 6; // Produk per halaman

// Mendapatkan query parameter page
const route = useRoute();
const router = useRouter();
const currentPage = ref(parseInt(route.query.page) || 1);

// Memanggil API produk berdasarkan page dan perPage
const { data: productsData, refresh } = await useAsyncData(
  'products', 
  async () => {
    const page = currentPage.value;
    const response = await $fetch(`/api/products?page=${page}&perPage=${perPage}`);
    
    if (response.success) {
      return {
        products: response.products,
        totalProducts: response.totalProducts,
        totalPages: response.totalPages,
      };
    }
    
    return { products: [], totalProducts: 0, totalPages: 0 };
  },
  {
    key: computed(() => currentPage.value), // Memastikan refresh saat page berubah
  }
);

// Data produk dan total halaman
const products = computed(() => productsData.value?.products || []);
const totalPages = computed(() => productsData.value?.totalPages || 0);

// Fungsi untuk berpindah halaman
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    router.push({ query: { ...route.query, page: String(page) } });
  }
};

// Monitor perubahan query parameter 'page'
watch(() => route.query.page, (newPage) => {
  currentPage.value = parseInt(newPage) || 1;
  refresh(); // Memanggil refresh data produk saat page berubah
});

const formatPrice = (price) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

onMounted(() => {
  fetchSlides();
  //fetchCategories();
});

onUnmounted(() => {
  if (autoSlideInterval) clearInterval(autoSlideInterval);
});

</script>

<template>
  <div class="">
    <NavBar />
  </div>

  <div class="">
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
          <h3 v-if="slide.description" class="mt-2 text-sm md:text-lg">{{ slide.description }}</h3>
          <a
            v-if="slide.buttonText && slide.buttonLink"
            :href="slide.buttonLink"
            class="mt-4 bg-white text-black px-4 py-2 rounded-lg font-semibold bottom-0 left-0"
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
          }">
           
        </button>
      </div>
    </div>
  </div>
  
  <!-- Kategori Produk -->
<div class="py-4 container mx-auto flex flex-col px-4">
  <div class="py-4 flex overflow-x-auto">
    <div
      v-for="category in computedCategory"
      :key="category.id"
      class="px-1 rounded-2xl"
    >
      <nuxt-link
        :to="`/categories/${category.name}`"
        class="px-4 py-3 rounded-full font-bold border border-black hover:bg-slate-300 text-nowrap"
      >
        {{ category.name }}
      </nuxt-link>
    </div>
  </div>
</div>

<!-- Produk -->
  <div class="container mx-auto flex px-4 py-4">
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div class="rounded-2xl" v-for="product in products" :key="product.id">
        <div class="hover:shadow-xl rounded-2xl">
          <NuxtLinkLocale :to="`/products/${product.id}`">
          <div>
            <img :src="product.imageURL[0]" :alt="product.name" class="rounded-2xl" width="512" height="512" loading="lazy" />
          </div>
          <div class="relative bg-gray-100 py-6 rounded-2xl border-4 md:border-8 border-white -mt-6 px-4">
            <div class="font-bold text-xl">{{ product.name }}</div>
            <div class="">{{ formatPrice(product.price) }}</div>
            <div class="pt-4">
              <span
                class="bg-[#8b5a2b] px-4 py-2 rounded-full text-white"
              >
                Detail
              </span>
            </div>
          </div>
          </NuxtLinkLocale>
        </div>
      </div>
    </div>
  </div>

  <!-- Pagination -->
  <div class="container mx-auto flex justify-center py-6">
    <button class="gap-x-2 -ms-px text-sm md:text-base bg-transparent px-6 py-3 border border-black rounded-l-[32px] hover:bg-slate-300/60 focus:bg-red-200/60" @click="goToPage(currentPage - 1)"
        :class="{ 'bg-gray-300 text-gray-400 hover:bg-gray-300' : currentPage === 1 }" :disabled="currentPage === 1">{{ $t('Previous') }}</button>
        <span class="gap-x-2 -ms-px text-sm md:text-base bg-transparent px-6 py-3 border-y border-black hover:bg-slate-300/60 focus:bg-red-200/60">{{ currentPage }} / {{ totalPages }}</span>
        <button class="gap-x-2 -ms-px text-sm md:text-base bg-transparent px-6 py-3 border border-black rounded-r-[32px] hover:bg-slate-300/60 focus:bg-red-200/60" @click="goToPage(currentPage + 1)"
        :class="{ 'bg-gray-300 text-gray-400 hover:bg-gray-300' : currentPage === totalPages }" :disabled="currentPage === totalPages">{{ $t('Next') }}</button>
  </div>
  
  <div class="py-2"></div>
  <div class="py-4">
    <div class="px-4 container mx-auto flex">
      <div class="bg-slate-300 overflow-hidden rounded-2xl px-6 md:px-12 py-8 md:py-12">
        <div class="relative grid grid-cols-2 gap-2 justify-items-center content-center w-full">
          <div class="place-items-center">
            <h2 class="relative text-2xl font-bold z-40 md:text-4xl backdrop-invert-0 drop-shadow-2xl">
                {{ $t('Make Furniture') }}
              </h2>
          </div>
          <div class="absolute z-10 inset-y-0 right-0">
            <img class="size-48 md:size-64"
            src="https://res.cloudinary.com/doninmxbl/image/upload/custom_ebtmqw.png" height="512" width="512"
            alt="Kursi Kotak" />
          </div>
        </div>
        <div class="py-4"></div>
        <div class="flex relative justify-center items-center">
          <div class="relative z-40 grid grid-cols-1 gap-4 justify-items-center content-center">
            <div class="">
              <nuxt-link to="https://wa.me/+6285225208256" class="px-4 py-3 bg-green-700 hover:bg-green-800 rounded-full
              text-white">{{ $t('Contact Now') }}</nuxt-link>
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

<style scoped>
/* Style tetap sama */
</style>