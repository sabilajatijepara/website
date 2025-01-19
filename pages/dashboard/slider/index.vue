<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter, useNuxtApp } from '#app';
import { collection, query, getDocs, deleteDoc, doc } from "firebase/firestore";

const slides = ref([]);
const currentIndex = ref(0);
const prevIndex = ref(null);
const loading = ref(true);

const { $db } = useNuxtApp(); // Akses Firebase instance
const router = useRouter();

let autoSlideInterval = null;

// Fetch data dari Firestore
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
    loading.value = false;
  }
};

// Auto-slide setiap 10 detik
const startAutoSlide = () => {
  if (autoSlideInterval) clearInterval(autoSlideInterval); // Bersihkan interval sebelumnya
  if (slides.value.length > 0) {
    autoSlideInterval = setInterval(() => {
      prevIndex.value = currentIndex.value;
      currentIndex.value = (currentIndex.value + 1) % slides.value.length;
    }, 10000);
  }
};

// Fungsi untuk mengubah slide berdasarkan index
const goToSlide = (index) => {
  prevIndex.value = currentIndex.value;
  currentIndex.value = index;
};

// Fungsi untuk menghapus slide
const handleDelete = async (id) => {
  if (confirm('Are you sure you want to delete this slide?')) {
    try {
      const slideRef = doc($db, 'sliders', id);
      await deleteDoc(slideRef);
      slides.value = slides.value.filter((slide) => slide.id !== id);
      alert('Slide deleted successfully!');
    } catch (error) {
      console.error('Error deleting slide:', error);
      alert('Failed to delete slide. Please try again.');
    }
  }
};

definePageMeta({
  middleware: "auth",
});

// Bersihkan interval saat komponen di-unmount
onUnmounted(() => {
  if (autoSlideInterval) clearInterval(autoSlideInterval);
});

// Fetch slides saat komponen dimuat
onMounted(() => {
  fetchSlides();
});
</script>

<template>
  <div class="p-8 bg-[#FEFEFE]">
    <div class="pb-4">
      <div class="w-full text-black">
        <div class="flex justify-start items-center">
          <button
            class="flex bg-black/20 backdrop-blur-2xl rounded-full px-4 py-3 text-white"
            @click="router.back"
          >
            Back
          </button>
        </div>
      </div>
    </div>
    <!-- Slider Section -->
    <div class="relative flex justify-center items-center w-full h-[40vh] bg-black rounded-3xl overflow-hidden mb-8">
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
          class="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center text-white px-6"
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

    <!-- Manage Slides Section -->
    <div class="flex justify-between mb-6">
      <h1 class="text-2xl font-bold">Manage Slides</h1>
      <nuxt-link to="/dashboard/slider/add" class="bg-green-600 text-white px-4 py-2 rounded-full">
        Add New Slide
      </nuxt-link>
    </div>

    <div class="space-y-4">
      <div
        v-for="slide in slides"
        :key="slide.id"
        class="flex justify-between items-center p-4 bg-gray-100 rounded-lg"
      >
        <div>
          <h2 class="text-xl font-semibold">{{ slide.title }}</h2>
          <p>{{ slide.description }}</p>
          <img v-if="slide.imageURL" :src="slide.imageURL" :alt="slide.title" class="mt-2 w-32 h-auto" />
        </div>
        <button
          @click="handleDelete(slide.id)"
          class="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>