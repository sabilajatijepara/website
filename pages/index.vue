<template class="">
  <div class="px-4 py-2">
    <NavBar />
  </div>
  <div class="px-4 container mx-auto flex">
    <div class="w-full h-72 justify-center items-center bg-gray-300
    overflow-hidden rounded-2xl">
    <img
    src="https://unsplash.com/photos/URGPh9yIiI8/download?ixid=M3wxMjA3fDB8MXxhbGx8Nnx8fHx8fHx8MTczNjEzNzgwMHw&force=true&w=1920"
    alt="" class="w-full h-full object-cover" />
    </div>
  </div>
  <div class="py-2"></div>
  <div class="container mx-auto flex">
    <div>Kategori Produk</div>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
  export default {
    components:
    NavBar,
  }
</script>