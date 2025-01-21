<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useHead, useAsyncData } from "#app";
import NavBar from "@/components/NavBar.vue";
import Footer from "@/components/Footer.vue";

const route = useRoute();

const product = ref(null);
const categories = ref([]);
const otherProducts = ref([]);
const selectedImage = ref(""); // Menyimpan gambar yang dipilih
const loading = ref(true);

const { data: ssrProduct } = await useAsyncData("product", async () => {
  const id = route.params.id;
  try {
    const { success, product: fetchedProduct } = await $fetch(`/api/products/${id}`);

    if (success) {
      product.value = fetchedProduct;
      selectedImage.value = fetchedProduct.imageURL[0]; // Set gambar pertama sebagai default

      // Atur metadata untuk SEO
      useHead({
        title: fetchedProduct.name + " — CV. Sabilajati Jepara",
        meta: [
          { name: "description", content: fetchedProduct.description || "" },
          { name: "keywords", content: fetchedProduct.keywords?.join(", ") || "" },
          { property: "og:title", content: fetchedProduct.name + " — CV. Sabilajati Jepara" },
          { property: "og:description", content: fetchedProduct.description || "" },
          { property: "og:image", content: fetchedProduct.imageURL[0] || "" },
        ],
      });

      return fetchedProduct;
    } else {
      console.error("Produk tidak ditemukan!");
      return null;
    }
  } catch (error) {
    console.error("Gagal mengambil data produk:", error);
    return null;
  } finally {
    loading.value = false;
  }
});

// Mengambil produk lainnya
const fetchOtherProducts = async () => {
  try {
    const { success, products } = await $fetch(`/api/products/other`, {
      query: { id: route.params.id },
    });

    if (success) {
      otherProducts.value = products;
    } else {
      console.error("Gagal mengambil produk lainnya.");
    }
  } catch (error) {
    console.error("Error fetching other products:", error);
  }
};

// Menggunakan formatPrice
const formatPrice = (price) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Fetch produk lainnya saat komponen dimuat
onMounted(() => {
  fetchOtherProducts();
});
</script>

<template>
  <div>
    <div class="">
      <NavBar />
    </div>
    <div class="py-2"></div>

    <div v-if="product" class="container mx-auto flex flex-col">
      <div class="px-4">
      <div class="py-2 px-3 bg-slate-300 rounded-full">
      <ol class="items-center whitespace-nowrap text-sm md:text-base">
        <li class="inline-flex items-center">
          <nuxt-link to="/">{{ $t('Home') }}</nuxt-link>
          <svg class="shrink-0 size-5 text-gray-400 dark:text-neutral-600 " width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M6 13L10 3" stroke="#000" stroke-linecap="round"></path>
          </svg>
        </li>
        <li class="inline-flex items-center">
          <nuxt-link :to="`/categories/` + product.categories[0]">{{ product.categories[0] }}</nuxt-link>
          <svg class="shrink-0 size-5 text-gray-400 dark:text-neutral-600 " width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M6 13L10 3" stroke="#000" stroke-linecap="round"></path>
          </svg>
        </li>
        <li class="inline-flex items-center">
          <span>{{ product.name }}</span>
        </li>
      </ol>
    </div>
    </div>
    <div class="py-2"></div>
      <div class="px-4 py-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Gambar -->
          <div class="space-y-2">
            <!-- Gambar besar -->
            <div class="rounded-2xl overflow-hidden">
              <img :src="selectedImage" :alt="product.name" />
            </div>
            <!-- Gambar kecil (scrollable) -->
            <div class="flex space-x-2 overflow-x-auto py-2">
              <div
                v-for="(image, index) in product.imageURL"
                :key="index"
                @click="selectedImage = image" class="cursor-pointer flex-none w-20 h-20 rounded-xl overflow-hidden"
              >
                <img :src="image" :alt="product.name" class="object-cover w-full h-full" />
              </div>
            </div>
          </div>
          <!-- Teks -->
          <div>
            <div class="text-base">{{ $t('Start From') }}</div>
            <div class="text-4xl md:text-5xl font-bold">{{ formatPrice(product.price) }}</div>
            <div class="py-2"></div>
            <div class="text-2xl md:text-4xl font-semibold">{{ product.name }}</div>
            <div class="py-2"></div>
            <div class="font-bold text-xl">{{ $t('Description') }}</div>
            <div class="py-1"></div>
            <div class="text-base md:text-xl">{{ product.description }}</div>
            <div class="py-2"></div>
            <div class="py-4">
              <div class="flex justify-between space-x-1">
                <!--<div>
                  <nuxt-link class="border border-slate-300 px-3 py-2 rounded-full">Tambah ke Keranjang</nuxt-link>
                </div>-->
                <div>
                  <nuxt-link
                    :href="`https://wa.me/6285225208256?text=${encodeURIComponent($t('waText', { product: product.name }))}`"
                    class="bg-slate-300 px-3 py-3 rounded-full font-bold"
                    >{{ $t('Buy WA') }}</nuxt-link
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--<div class="container mx-auto text-center py-8">
      <div>{{ $t('Product NF') }}</div>
    </div>-->

    <!-- Produk lainnya -->
    <div class="container mx-auto flex flex-col px-4 py-4">
      <div class="py-2 md:py-6 font-bold text-2xl md:text-4xl">{{ $t('Other Product') }}</div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          v-for="item in otherProducts"
          :key="item.id"
          class="rounded-2xl"
        >
          <div>
            <img :src="item.imageURL[0]" alt="Produk Lain" class="rounded-2xl" />
          </div>
          <div
            class="relative bg-gray-100 py-6 rounded-2xl border-4 md:border-8 border-white -mt-6 px-4"
          >
            <div class="font-bold text-xl">{{ item.name }}</div>
            <div>{{ formatPrice(item.price) }}</div>
            <div class="pt-4">
              <nuxt-link
                :to="'/products/' + item.id"
                class="bg-[#8b5a2b] px-4 py-2 rounded-full text-white"
              >
                Detail
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="py-4"></div>
    <div class="container mx-auto flex">
      <Footer />
    </div>
  </div>
</template>