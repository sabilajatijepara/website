<script setup>
const route = useRoute();
const { id } = route.params; // Ambil ID dari URL

// Fetch data berdasarkan ID
const { data: postDetail, pending, error } = await useFetch(`/api/blogger/${id}`);

useHead({
  title: postDetail.value?.title + " - Blog",
  meta: [
    { name: "description", content: postDetail.value?.content.slice(0, 150) },
    { property: "og:title", content: postDetail.value?.title },
    { property: "og:description", content: postDetail.value?.content.slice(0, 150) },
    { property: "og:image", content: postDetail.value?.author?.profileImage || "" }
  ]
});
</script>

<template>
  <div class="container mx-auto py-10 px-4 max-w-4xl">
    <div v-if="pending">Memuat...</div>
    <div v-else-if="error">Terjadi kesalahan saat memuat artikel.</div>
    <div v-else>
      <h1 class="text-3xl font-bold">{{ postDetail?.post?.title }}</h1>
      <p class="text-gray-600">{{ postDetail?.post?.published }} oleh {{ postDetail?.post?.author?.name }}</p>
      <img v-if="postDetail?.post?.author?.profileImage" :src="postDetail.post.author.profileImage" class="w-10 h-10 rounded-full" />
      <div class="mt-4" v-html="postDetail?.post?.content"></div>
    </div>
  </div>
</template>