<script setup>
  import { useI18n } from "#imports";
  import { useRouter } from "#app";
  
  const route = useRoute();
  const { t } = useI18n();
  
  useHead({
        title: () => `${t("About")} — CV. Sabilajati Mebel Jepara`, // Title halaman
        meta: [
          { name: "description", content: "Kami adalah produsen meja kursi sekolah, meja kursi cafe, serta gazebo dan bungalow" },
          { name: "keywords", content: "Mebel jepara, meubel jepara, kursi meja cafe, meja kursi sekolah, jasa pembuatan gazebo, jasa pembuatan bungalow, furniture custom" }, // Meta keywords
          { property: "og:title", content: () => `${t("About")} — CV. Sabilajati Mebel Jepara` }, // Open Graph Title
          { property: "og:description", content: "Kami adalah produsen meja kursi sekolah, meja kursi cafe, serta gazebo dan bungalow" }, // Open
          /* { property: "og:image", content: product.value.imageURL[0] }, //
          Open Graph Image */
        ],
        link: [
          {
          rel: 'canonical',
          href: 'https://sabilajati.com' + route.path,
          },
        ],
});
</script>

<template>
  <div>
    <NavBar />
  </div>
  <div class="container mx-auto px-4 py-4">
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
          <span>{{ $t('About') }}</span>
        </li>
      </ol>
    </div>
    <div class="py-4"></div>
    </div>
    <div>
      <h2 class="font-bold text-2xl">{{ $t('About') }}</h2>
      <div class="py-2"></div>
      <div class="py-4">
        {{ $t('Info About') }}
      </div>
    </div>
    <div class="bg-gray-100 rounded-xl">
      <iframe
        src="https://docs.google.com/gview?url=https://sbjbeta.vercel.app/pdf/company-profile.pdf&embedded=true"
        class="w-full h-56 rounded-xl">
      </iframe>
      <div class="py-4 px-4">
        <div class="font-bold py-2 text-xl md:text-3xl">
          Company Profile Sabilajati
        </div>
        <div class="py-2 text-gray-500">2.35 MB • PDF</div>
        <div class="py-2">
          <nuxt-link to="/pdf/company-profile.pdf" class="bg-blue-300 rounded-xl px-3 py-2">
          Download
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
  <div>
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