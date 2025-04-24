<script setup>
import { ref } from "vue";
import { useRoute, useNuxtApp, useHead, useAsyncData, useState } from "#app";

import NavBar from "@/components/NavBar.vue";
import Footer from "@/components/Footer.vue";

const { $adminDb } = useNuxtApp();
const route = useRoute();

const product = useState(`product-${route.params.id}`, () => null);;
const otherProducts = ref([]);
const selectedImage = ref("");

// Fetch produk secara SSR
const { data: ssrProduct } = await useAsyncData("product", async () => {
  const id = route.params.id;
  try {
    const { success, product: fetchedProduct } = await $fetch(`/api/products/${id}`);

    if (success) {
      product.value = fetchedProduct;
      selectedImage.value = fetchedProduct.imageURL[0]; // Set gambar pertama sebagai default

      // Atur metadata untuk SEO
      useHead({
        title: fetchedProduct.name + " — Sabilajati Mebel Jepara",
        meta: [
          { name: "description", content: fetchedProduct.description || "" },
          { name: "keywords", content: fetchedProduct.name.split(" ").join(", ") + ", Mebel jepara, meubel jepara, kursi meja cafe, meja kursi sekolah, jasa pembuatan gazebo, jasa pembuatan bungalow, furniture custom" || "" },
          { property: "og:title", content: fetchedProduct.name + " — Sabilajati Mebel Jepara" },
          { property: "og:description", content: fetchedProduct.description || "" },
          { property: "og:image", content: fetchedProduct.imageURL[0] || "" },
        ],
        link: [
          { rel: 'canonical', href: 'https://sabilajati.com' + route.path },
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
  }
},
{ initialCache: false }
);

// Fetch produk lainnya secara SSR
const { data: otherProductsData } = await useAsyncData("other-products", async () => {
  try {
    const { success, products } = await $fetch(`/api/products/other`);
    return success ? products.filter((p) => p.id !== route.params.id) : [];
  } catch (error) {
    console.error("Gagal mengambil produk lainnya:", error);
    return [];
  }
});

// Set produk lainnya
otherProducts.value = otherProductsData.value;

// Format harga
const formatPrice = (price) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};
</script>

<template>
  <div>
    <NavBar />
    <div class="py-2"></div>

    <div v-if="product" class="container mx-auto flex flex-col">
      <div class="px-4">
        <div class="py-2 px-3 bg-slate-300 rounded-full overflow-hidden">
          <ol class="items-center whitespace-nowrap text-sm md:text-base">
            <li class="inline-flex items-center">
              <nuxt-link to="/">{{ $t('Home') }}</nuxt-link>
              <svg class="shrink-0 size-5 text-gray-400 dark:text-neutral-600" width="16" height="16">
                <path d="M6 13L10 3" stroke="#000" stroke-linecap="round"></path>
              </svg>
            </li>
            <li class="inline-flex items-center">
              <nuxt-link :to="`/categories/` + product.categories[0]">{{ product.categories[0] }}</nuxt-link>
              <svg class="shrink-0 size-5 text-gray-400 dark:text-neutral-600" width="16" height="16">
                <path d="M6 13L10 3" stroke="#000" stroke-linecap="round"></path>
              </svg>
            </li>
            <li class="inline-flex items-center">
              <span class="text-wrap">{{ product.name }}</span>
            </li>
          </ol>
        </div>
      </div>
      <div class="py-2"></div>
      <div class="px-4 py-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-2">
            <div class="rounded-2xl overflow-hidden">
              <!--<img :src="selectedImage" :alt="product.name" />-->
              <NuxtImg
                provider="cloudinary"
                :src="selectedImage"
                :alt="product.name"
                width="400"
                
                format="webp"
                quality="auto"
              />
            </div>
            <div class="flex space-x-2 overflow-x-auto py-2">
              <div
                v-for="(image, index) in product.imageURL"
                :key="index"
                @click="selectedImage = image"
                class="cursor-pointer flex-none w-20 h-20 rounded-xl overflow-hidden"
              >
                <!--<img :src="image" :alt="product.name" class="object-cover w-full h-full" />-->
                <NuxtImg
                  provider="cloudinary"
                  :src="image"
                  :alt="product.name"
                  width="400"
                  height="400"
                  format="webp"
                  quality="auto"
                />
              </div>
            </div>
          </div>
          <div>
            <div class="text-base">{{ $t('Start From') }}</div>
            <div class="text-4xl md:text-5xl font-bold">{{ formatPrice(product.price) }}</div>
            <div class="py-2"></div>
            <h1 class="text-2xl md:text-4xl font-semibold">{{ product.name }}</h1>
            <div class="py-2"></div>
            <div class="font-bold text-xl">{{ $t('Description') }}</div>
            <div class="py-1"></div>
            <div class="text-base md:text-xl whitespace-pre-line">
              {{ product.description }}
            </div>
            <div class="py-2"></div>
            <div class="py-4">
              <div class="flex justify-between space-x-1">
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

    <div v-else class="container mx-auto text-center py-8">
      <div>{{ $t('Product NF') }}</div>
    </div>

    <div class="container mx-auto flex flex-col px-4 py-4">
      <h2 class="py-2 md:py-6 font-bold text-2xl md:text-4xl">{{ $t('Other Product') }}</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="item in otherProducts" :key="item.id" class="rounded-2xl">
          <div>
            <img :src="item.imageURL[0]" alt="Produk Lain" class="rounded-2xl" />
          </div>
          <div class="relative bg-gray-100 py-6 rounded-2xl border-4 md:border-8 border-white -mt-6 px-4">
            <div class="font-bold text-xl">{{ item.name }}</div>
            <div>{{ formatPrice(item.price) }}</div>
            <div class="pt-4">
              <nuxt-link :to="'/products/' + item.id" class="bg-[#8b5a2b] px-4 py-2 rounded-full text-white">
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