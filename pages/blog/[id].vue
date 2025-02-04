<template class="container mx-auto flex">
  <div class="">
    <NavBar />
  </div>
  <div class="px-4 container mx-auto">
        <div class="py-2 px-3 bg-slate-300 rounded-full overflow-hidden">
          <ol class="items-center whitespace-nowrap text-sm md:text-base">
            <li class="inline-flex items-center">
              <nuxt-link to="/">{{ $t('Home') }}</nuxt-link>
              <svg class="shrink-0 size-5 text-gray-400 dark:text-neutral-600" width="16" height="16">
                <path d="M6 13L10 3" stroke="#000" stroke-linecap="round"></path>
              </svg>
            </li>
            <li class="inline-flex items-center">
              <nuxt-link to="/blog">Blog</nuxt-link>
              <svg class="shrink-0 size-5 text-gray-400 dark:text-neutral-600" width="16" height="16">
                <path d="M6 13L10 3" stroke="#000" stroke-linecap="round"></path>
              </svg>
            </li>
            <li class="inline-flex items-center">
              <span class="text-wrap">{{ post?.title }}</span>
            </li>
          </ol>
        </div>
      </div>
      <div class="py-2"></div>
  <div class="px-4 py-4 container mx-auto">
    <h2 class="text-2xl md:text-4xl font-bold">{{ post?.title }}</h2>
    <div class="py-2"></div>
    <div>
      <div class="py-4">
        <div class="flex mx-auto">
          <div class="shrink-0">
            <img :src="post.author.image.url" alt="Profile" class="rounded-full h-12 w-12" />
          </div>
          <div class=" px-3">
          <span class="font-bold" href="">{{ post.author.displayName }}</span><br/>
          <span class="text-gray-500">{{ post.formattedPublished }}
          </span>
          </div>
        </div>
      </div>
    </div>
    <div class="py-4"></div>
      <div class="flex flex-row text-gray-500">
        <div class="pr-1">
          <div class="">
            <button class="px-4 py-2 rounded-full border text-center justify-center items-center inline-flex" @click="copyLink"><Icon name="uil:copy" />  <span class="px-1">Copy Link</span></button>
                </div>
          </div>
          <div class="px-1">
            <div class="px-2 py-2 rounded-full text-center">
              <button class="" @click="shareTwitter">
                <Icon name="uil:twitter"/>
              </button>
            </div>
          </div>
          <div class="px-1">
            <div class="px-2 py-2 rounded-full text-center">
              <button class="" @click="shareFacebook"><Icon name="uil:facebook"/></button>
            </div>
          </div>
          <div class="px-1">
            <div class="px-2 py-2 rounded-full text-center">
              <button class="" @click="shareWhatsapp"><Icon name="uil:whatsapp"/>
              </button>
        </div>
      </div>
    </div>
    <div class="py-4"></div>
    <div class="py-2"></div>
    <div class="list-inside" v-html="post?.content"></div>
  </div>
    <!-- Footer -->
  <div class="container mx-auto flex py-4">
    <Footer />
  </div>
</template>

<script setup>
import { useRoute, useAsyncData } from "#app";

const route = useRoute();
const postId = route.params.id;

// Mengambil data artikel berdasarkan ID
const { data: post } = await useAsyncData(`blogPost-${postId}`, async () => {
  const res = await $fetch(`/api/blog/${postId}`);
  return res;
});

// Menambahkan SEO
useHead({
  title: post.value?.title + " — CV. Sabilajati Mebel Jepara" || "Artikel Blog"+ " — CV. Sabilajati Mebel Jepara",
  meta: [
    { name: "description", content: post.value?.content?.substring(0, 160) || "Baca artikel menarik dari blog kami." },
    { name: 'og:image', content: "https://res.cloudinary.com/doninmxbl/image/upload/kquaxae4iakjge8rlve6.png" }, // Gambar pertama di artikel
  ],
});

const copyLink = () =>
  navigator.clipboard.writeText(
    window.location.href.replace(/([^#]*)#.+/, "$1")
);

const shareTwitter = () => {
  window.open(
    "https://twitter.com/intent/tweet?text=" +
      encodeURIComponent(document.title) +
      "&url=" +
      encodeURIComponent(window.location.href.replace(/([^#]*)#.+/, "$1")),
    "",
    "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=350,width=600"
  );
};

const shareFacebook = () => {
  window.open(
    "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(window.location.href.replace(/([^#]*)#.+/, "$1")
       +
      "&t=" +
      encodeURIComponent(document.title)),
    ""
  );
};

const shareWhatsapp = () => {
  window.open("whatsapp://send?text=" + encodeURIComponent(document.title) + " \n \n" + encodeURIComponent(window.location.href.replace(/([^#]*)#.+/, "$1"))
  )
};
</script>