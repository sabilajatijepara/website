<template>
  <header class="">
    <div class="container mx-auto flex items-center justify-between p-4">
      <!-- Logo -->
      <div class="text-2xl font-bold">
        <nuxt-link to="/">Sabilajati Jepara</nuxt-link>
      </div>

      <!-- Desktop Menu -->
      <nav class="hidden md:flex space-x-6">
        <nuxt-link to="/" class="hover:text-gray-300">Home</nuxt-link>
        <nuxt-link to="/about" class="hover:text-gray-300">About</nuxt-link>
        <nuxt-link to="/services" class="hover:text-gray-300">Services</nuxt-link>
        <nuxt-link to="/contact" class="hover:text-gray-300">Contact</nuxt-link>
      </nav>

      <!-- Mobile Menu Button -->
      <button
        class="block md:hidden focus:outline-none"
        @click="toggleMenu"
      >
        <svg
          class="w-6 h-6 transition-transform duration-300"
          :class="{ 'rotate-90': isMenuOpen }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16m-7 6h7"
          ></path>
        </svg>
      </button>
    </div>

    <!-- Mobile Menu -->
    <transition name="fade">
      <div
        v-if="isMenuOpen"
        class="fixed inset-0 bg-gray-900 bg-opacity-95 flex flex-col items-center justify-center space-y-8 text-xl"
      >
        <nuxt-link
          to="/"
          class="text-white hover:text-gray-300"
          @click="toggleMenu"
        >Home</nuxt-link>
        <nuxt-link
          to="/about"
          class="text-white hover:text-gray-300"
          @click="toggleMenu"
        >About</nuxt-link>
        <nuxt-link
          to="/services"
          class="text-white hover:text-gray-300"
          @click="toggleMenu"
        >Services</nuxt-link>
        <nuxt-link
          to="/contact"
          class="text-white hover:text-gray-300"
          @click="toggleMenu"
        >Contact</nuxt-link>

        <button
          class="absolute top-4 right-4 text-gray-300 focus:outline-none"
          @click="toggleMenu"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
    </transition>
  </header>
</template>

<script>
export default {
  data() {
    return {
      isMenuOpen: false,
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>