<script setup>
const route = useRoute();
const { data: posts } = await useFetch("/api/blogger"); // Fetch semua post untuk dapat ID

// Cari post berdasarkan slug
const post = posts.value?.find((p) => p.slug === route.params.slug);
if (!post) {
  throw createError({ statusCode: 404, message: "Post tidak ditemukan" });
}

// Fetch data berdasarkan ID
const { data: postDetail } = await useFetch(`/api/blogger/${post.id}`);

useHead({
  title: postDetail.value?.title + " - Blog",
  meta: [{ name: "description", content: postDetail.value?.content.slice(0, 150) }]
});
</script>

<template>
  <div class="container mx-auto py-10 px-4">
    <h1 class="text-3xl font-bold">{{ postDetail?.title }}</h1>
    <p class="text-gray-600">{{ postDetail?.published }} oleh {{ postDetail?.author?.name }}</p>
    <img v-if="postDetail?.author?.profileImage" :src="postDetail.author.profileImage" class="w-10 h-10 rounded-full" />
    <div class="mt-4" v-html="postDetail?.content"></div>
  </div>
</template>