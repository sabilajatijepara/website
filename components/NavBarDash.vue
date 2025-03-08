<template>
  <nav class="bg-white shadow-md fixed w-full top-0 left-0 z-50">
    <div class="container mx-auto p-4 flex justify-between items-center">
      <!-- Logo -->
      <NuxtLink class="text-lg font-bold" to="/dashboard">Dashboard</NuxtLink>

      <!-- Menu Icon (Mobile) -->
      <button @click="drawerOpen = true" class="lg:hidden">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"/>
        </svg>
      </button>

      <!-- Desktop Menu -->
      <ul class="hidden lg:flex space-x-6">
        <li v-for="menu in menus" :key="menu.name">
          <NuxtLink :to="menu.link" class="hover:text-blue-500">{{ menu.name }}</NuxtLink>
        </li>
      </ul>
    </div>

    <!-- Drawer (Mobile) -->
    <div 
      v-if="drawerOpen" 
      class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
      @click="drawerOpen = false"
    ></div>

    <aside 
      class="fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50 rounded-l-3xl"
      :class="{ 'translate-x-0': drawerOpen, 'translate-x-full': !drawerOpen }"
    >
      <div class="p-4 flex justify-between items-center border-b">
        <h2 class="text-lg font-bold">Menu</h2>
        <button @click="drawerOpen = false">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <ul class="p-4 space-y-8">
        <li v-for="menu in menus" :key="menu.name" class="">
          
          <NuxtLink 
            :to="menu.link" 
            class="block hover:bg-gray-100"
            @click="drawerOpen = false"
          >
            <Icon :name="menu.iconi" />
            {{ menu.name }}
          </NuxtLink>
        </li>
      </ul>
    </aside>
  </nav>
</template>

<script setup>
import { ref } from "vue";

const drawerOpen = ref(false);

const menus = [
  { name: "Dashboard", link: "/dashboard", iconi: "tabler:home" },
  { name: "Products", link: "/dashboard/products", iconi: "tabler:checkup-list" },
  { name: "Categories", link: "/dashboard/categories", iconi:"tabler:category" },
  { name: "Slider", link: "/dashboard/slider", iconi: "tabler:slideshow" },
];
</script>