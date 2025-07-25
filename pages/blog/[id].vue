<template class="container mx-auto flex">
  <div class="">
    <NavBar />
  </div>
  <div class="px-4 container mx-auto max-w-4xl">
    <div class="py-2"></div>
        <div class="">
          <ol class="text-sm md:text-base">
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
            <li class="inline-flex items-center py-2">
              <h2 class="text-2xl md:text-4xl font-bold">{{ post?.title }}</h2>
            </li>
          </ol>
        </div>
      </div>
      <div class="py-0"></div>
  <div class="px-4 py-4 container mx-auto">
    <!--<h2 class="text-2xl md:text-4xl font-bold">{{ post?.title }}</h2>
    <div class="py-2"></div>-->
    <div>
      <div class="py-4">
        <div class="flex mx-auto">
          <div class="shrink-0">
            <img :src="post.author?.image.url" alt="Profile" class="rounded-full h-12 w-12" />
          </div>
          <div class=" px-3">
          <span class="font-bold" href="">{{ post.author?.displayName }}</span><br/>
          <span class="text-gray-700">{{ post.formattedPublished }}
          </span>
          </div>
        </div>
      </div>
    </div>
    <div class="py-4"></div>
      <div class="flex flex-row text-gray-700 items-center">
        <div class="pr-1">
          <div class="">
            <button class="px-4 py-2 rounded-full border border-gray-500 text-center justify-center items-center inline-flex hover:bg-slate-300" @click="copyLink">
              <Icon name="uil:copy" />  
              <span class="px-1">
                Copy Link
              </span>
            </button>
          </div>
          </div>
          <div class="px-1">
            <div class="px-2 py-2 rounded-full text-center hover:bg-slate-300">
              <button class="" @click="shareTwitter">
                <Icon name="uil:twitter"/>
              </button>
            </div>
          </div>
          <div class="px-1">
            <div class="px-2 py-2 rounded-full text-center hover:bg-slate-300">
              <button class="" @click="shareFacebook">
                <Icon name="uil:facebook"/>
              </button>
            </div>
          </div>
          <div class="px-1">
            <div class="px-2 py-2 rounded-full text-center hover:bg-slate-300">
              <button class="" @click="shareWhatsapp">
                <Icon name="uil:whatsapp"/>
              </button>
        </div>
      </div>
    </div>
    <div class="py-4"></div>
    <div class="py-2"></div>
    <div class="list-inside" v-html="post?.content"></div>
  </div>
    <!-- Footer -->
  <div class="container mx-auto flex py-4 max-w-4xl">
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
  title: post.value?.title 
    ? `${post.value.title} — Sabilajati Mebel Jepara` 
    : "Artikel Blog — Sabilajati Mebel Jepara",
  meta: [
    { name: "description", content: post.value?.content 
      ? post.value.content.replace(/<[^>]+>/g, "").substring(0, 160) 
      : "Baca artikel menarik dari blog kami tentang mebel, desain interior, dan inspirasi rumah." 
    },
    { name: "keywords", content: post.value?.title 
      ? `${post.value.title}, mebel, furniture, desain interior, Jepara, kayu jati` 
      : "mebel, furniture, desain interior, kayu jati, Jepara" 
    },
    { name: "author", content: "CV. Sabilajati Mebel Jepara" },

    // Open Graph (Facebook, LinkedIn)
    { property: "og:title", content: post.value?.title 
      ? `${post.value.title} — Sabilajati Mebel Jepara` 
      : "Artikel Blog — Sabilajati Mebel Jepara" 
    },
    { property: "og:description", content: post.value?.content 
      ? post.value.content.replace(/<[^>]+>/g, "").substring(0, 160) 
      : "Baca artikel menarik dari blog kami tentang mebel, desain interior, dan inspirasi rumah." 
    },
    { property: "og:image", content: "https://res.cloudinary.com/doninmxbl/image/upload/kquaxae4iakjge8rlve6.png" 
    }, 
    { property: "og:url", content: `https://sabilajati.com/blog/${post.value?.id}` },
    { property: "og:type", content: "article" },

    // Twitter Card
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: post.value?.title 
      ? `${post.value.title} — Sabilajati Mebel Jepara` 
      : "Artikel Blog — Sabilajati Mebel Jepara" 
    },
    { name: "twitter:description", content: post.value?.content 
      ? post.value.content.replace(/<[^>]+>/g, "").substring(0, 160) 
      : "Baca artikel menarik dari blog kami tentang mebel, desain interior, dan inspirasi rumah." 
    },
    { name: "twitter:image", content: "https://res.cloudinary.com/doninmxbl/image/upload/kquaxae4iakjge8rlve6.png" 
    },

    // Robots (SEO)
    { name: "robots", content: "index, follow" },
  ],
  link: [
    { rel: "canonical", href: `https://sabilajati.com/blog/${post.value?.id}` }
  ],
});

const copyLink = () =>
  navigator.clipboard.writeText(
    window.location.href.replace(/([^#]*)#.+/, "$1"),
    alert("Tautan Berhasil disalin!"),
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