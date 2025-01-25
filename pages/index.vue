<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useNuxtApp } from "#app";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

// SEO

useHead({
        title: "CV. Sabilajati Mebel Jepara — Produsen Meja Kursi Sekolah, Furniture Cafe, Gazebo dan Bungalow", // Title halaman
        meta: [
          { name: "description", content: "Kami adalah produsen meja kursi sekolah, meja kursi cafe, serta gazebo dan bungalow" },
          { name: "keywords", content: "Mebel jepara, meubel jepara, kursi meja cafe, meja kursi sekolah, jasa pembuatan gazebo, jasa pembuatan bungalow, furniture custom" }, // Meta keywords
          { property: "og:title", content: "CV. Sabilajati Mebel Jepara — Produsen Meja Kursi Sekolah, Furniture Cafe, Gazebo dan Bungalow" }, // Open Graph Title
          { property: "og:description", content: "Kami adalah produsen meja kursi sekolah, meja kursi cafe, serta gazebo dan bungalow" }, // Open
          /* { property: "og:image", content: product.value.imageURL[0] }, //
          Open Graph Image */
        ],
});

const { $db } = useNuxtApp();
const router = useRouter();

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

let autoSlideInterval = null;

const updatePerPage = () => {
  const screenWidth = window.innerWidth;
  perPage.value = screenWidth >= 768 ? 6 : 4; // 6 untuk PC/tablet, 4 untuk mobile
};

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

const categories = ref([]); // Data kategori

const fetchCategories = async () => {
  try {
    const q = query(collection($db, "categories"));
    const querySnapshot = await getDocs(q);
    categories.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

// Auto-slide setiap 10 detik
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

onMounted(() => {
  fetchProducts(); // Ambil data untuk halaman pertama
  
  // Tambahkan event listener untuk menangani perubahan ukuran layar
  window.addEventListener("resize", updatePerPage);
  
  fetchSlides();
  fetchCategories();
});

onUnmounted(() => {
  if (autoSlideInterval) clearInterval(autoSlideInterval);
});

// Bersihkan event listener saat komponen dihancurkan
onBeforeUnmount(() => {
  window.removeEventListener("resize", updatePerPage);
});
</script>

<template>
  <!-- Bagian Header -->
  <div class="">
    <NavBar />
  </div>

  <!-- Banner Slider -->
  <!--<div class="px-4 container mx-auto flex">
    <div class="flex w-full h-72 justify-center items-center bg-gray-300 overflow-hidden rounded-2xl">
      <div class="text-3xl font-bold text-center px-4">Selamat datang di CV.
      Sabilajati Mebel Jepara</div>
    </div>
  </div>-->
  <!-- Slider Section -->
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
          <p v-if="slide.description" class="mt-2 text-sm md:text-lg">{{ slide.description }}</p>
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
          }"
        />
      </div>
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
      <div class="text-xl">Loading...</div> <!-- Menampilkan loading saat data sedang dimuat -->
    </div>
    <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div class="rounded-2xl" v-for="product in products" :key="product.id">
        <div class="hover:shadow-xl rounded-2xl">
          <nuxt-link :to="`/products/${product.id}`">
          <div>
            <img :src="product.imageURL[0]" :alt="product.name" class="rounded-2xl" />
          </div>
          <div class="relative bg-gray-100 py-6 rounded-2xl border-4 md:border-8 border-white -mt-6 px-4">
            <div class="font-bold text-xl">{{ product.name }}</div>
            <div class="">{{ formatPrice(product.price) }}</div>
            <div class="pt-4">
              <NuxtLinkLocale
                :to="`/products/${product.id}`"
                class="bg-[#8b5a2b] px-4 py-2 rounded-full text-white"
              >
                Detail
              </NuxtLinkLocale>
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
  <div class="py-2"></div>
  <div class="py-4">
    <div class="px-4 container mx-auto flex">
      <div class="bg-slate-300 overflow-hidden rounded-2xl px-6 md:px-12 py-8
      md:py-12">
        <div class="relative grid grid-cols-2 gap-2 justify-items-center content-center w-full">
          <div class="place-items-center">
            <div class="relative text-2xl font-bold z-40 md:text-4xl
            backdrop-invert-0
            drop-shadow-2xl">{{ $t('Make Furniture') }}</div>
          </div>
          <div class="absolute z-10 inset-y-0 right-0">
            <img class="size-48 md:size-64"
            src="https://res.cloudinary.com/doninmxbl/image/upload/custom_ebtmqw.png"
            alt="" />
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