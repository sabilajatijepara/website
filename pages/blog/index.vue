<script setup>
definePageMeta({ ssr: true }); // Paksa SSR untuk render awal

const route = useRoute();
const router = useRouter();
const currentPage = ref(parseInt(route.query.page) || 1);
const limit = 5; // Jumlah post per halaman

// Fetch data dari API
const { data, pending, refresh } = useFetch(() => `/api/blogger?page=${currentPage.value}&limit=${limit}`, {
  key: `blog-page-${currentPage.value}`, // Gunakan key unik agar bisa di-cache
});

// Komputasi daftar artikel dan total halaman
const posts = computed(() => data.value?.posts || []);
const totalPages = computed(() => data.value?.totalPages || 1);

// Watch perubahan halaman untuk fetch ulang
watch(currentPage, async (newPage) => {
  router.push({ query: { page: newPage } }, { replace: true }); // Perbarui URL tanpa reload
  await refresh(); // Fetch ulang data tanpa refresh halaman
});

// Fungsi ubah halaman
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

useHead({
  title: "Blog — CV. Sabilajati Mebel Jepara",
  meta: [
    { name: "description", content: "Baca artikel menarik dari blog kami tentang mebel, desain interior, dan inspirasi rumah." },
    { name: "keywords", content: "mebel, furniture, desain interior, kayu jati, kursi, meja, lemari, Jepara" },
    { name: "author", content: "CV. Sabilajati Mebel Jepara" },

    // Open Graph (Facebook, LinkedIn)
    { property: "og:title", content: "Blog — CV. Sabilajati Mebel Jepara" },
    { property: "og:description", content: "Baca artikel menarik dari blog kami tentang mebel, desain interior, dan inspirasi rumah." },
    { property: "og:image", content: "https://res.cloudinary.com/doninmxbl/image/upload/kquaxae4iakjge8rlve6.png" },
    { property: "og:url", content: "https://sabilajati.com/blog" },
    { property: "og:type", content: "website" },

    // Twitter Card
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Blog — CV. Sabilajati Mebel Jepara" },
    { name: "twitter:description", content: "Baca artikel menarik dari blog kami dari tentang mebel, desain interior, dan inspirasi rumah." },
    { name: "twitter:image", content: "https://res.cloudinary.com/doninmxbl/image/upload/kquaxae4iakjge8rlve6.png" },
    
    // Robots (SEO)
    { name: "robots", content: "index, follow" },
    
  ],
  link: [
    { rel: "canonical", href: "https://sabilajati.com/blog" }
  ],
});
</script>

<template>
  <div class="">
    <NavBar />
  </div>
  <div class="py-4 container mx-auto flex flex-col px-4">
    <div>
      <div class="py-2 px-3 bg-slate-300 rounded-lg">
        <ol class="flex items-center whitespace-nowrap">
          <li class="inline-flex items-center">
            <span>{{ $t('Home') }}</span>
            <svg class="shrink-0 size-5 text-gray-400 dark:text-neutral-600 mx-2" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M6 13L10 3" stroke="currentColor" stroke-linecap="round"></path>
            </svg>
          </li>
          <li>
            <span>Blog</span>
          </li>
        </ol>
      </div>
    </div>
    <div class="py-4"></div>
    <div v-if="pending">
      <p>Loading...</p>
    </div>
    <div v-else-if="posts?.length > 0">
      <div class="divide-y">
        <div v-for="post in posts" :key="post.id" class="flex flex-col">
          <nuxt-link :to="`/blog/${post.id}/${post.slug}`" class="py-4 rounded-lg hover:rounded-lg hover:bg-slate-300/40 px-4 transition duration-300 hover:duration-300 space-y-2">
            <div>
              <h2 class="hover:underline text-2xl font-bold">
                {{ post.title }}
              </h2>
            </div>
            <div class="flex inline-flex justify-center items-center space-x-1">
              <span class="text-gray-700">{{ post.published }}</span>
            </div>
          </nuxt-link>
        </div>
      </div>

      <!-- Pagination -->
      <div class="py-2"></div>
      <div class="text-center flex justify-center">
        <button class="gap-x-2 -ms-px text-sm md:text-base bg-transparent px-6 py-3 border border-black rounded-l-[32px] hover:bg-slate-300/60 focus:bg-red-200/60" @click="changePage(currentPage - 1)"
        :class="{ 'bg-gray-300 text-gray-400 hover:bg-gray-300' : currentPage === 1 }" :disabled="currentPage === 1">Sebelumnya</button>
        <span class="gap-x-2 -ms-px text-sm md:text-base bg-transparent px-6 py-3 border-y border-black hover:bg-slate-300/60 focus:bg-red-200/60">{{ currentPage }} / {{ totalPages }}</span>
        <button class="gap-x-2 -ms-px text-sm md:text-base bg-transparent px-6 py-3 border border-black rounded-r-[32px] hover:bg-slate-300/60 focus:bg-red-200/60" @click="changePage(currentPage + 1)"
        :class="{ 'bg-gray-300 text-gray-400 hover:bg-gray-300' : currentPage === totalPages }" :disabled="currentPage === totalPages">Berikutnya</button>
      </div>
    </div>
    <div v-else>
      <h2>Tidak ada artikel.</h2>
    </div>
  </div>
  <!-- Footer -->
  <div class="container mx-auto flex py-4">
    <Footer />
  </div>
</template>

<style scoped>
</style>