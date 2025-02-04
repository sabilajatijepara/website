<script setup>
const { data: posts } = await useAsyncData("blog", async () => {
  const { success, posts } = await $fetch("/api/blog");
  return success ? posts : [];
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
    <div v-if="posts?.length > 0">
      <div v-for="post in posts" :key="post.id" class="grid grid-cols-1 divide-y-2 gap-8 w-full">
        <nuxt-link :to="`/blog/${post.id}`" class="py-4 rounded-lg hover:rounded-lg hover:bg-red-50/40 px-4 transition duration-300 hover:duration-300 space-y-2">
          <div>
            <span class="hover:underline text-2xl font-bold">
              {{ post.title }}
            </span>
            <!--<p class="text-gray-600" v-html="post.content.substring(0, 150) + '...'"></p>-->
          </div>
          <div class="flex inline-flex justify-center items-center space-x-1">
            <!--<div>by</div>
            <div>
              <img :src="post.author.image.url" class="rounded-full size-6"/>
            </div>
            <div class="font-semibold">
              {{ post.author.displayName}}
            </div>-->
            <span class="text-gray-700">{{ post.formattedDate }}
            </span>
          </div>
        </nuxt-link>
      </div>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
  <!-- Footer -->
  <div class="container mx-auto flex py-4">
    <Footer />
  </div>
</template>