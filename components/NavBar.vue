<template>
  <header class="">
    <div class="container mx-auto flex items-center justify-between p-4 rounded-2xl">
      <!-- Logo -->
      <h1 class="text-2xl font-bold">
        <NuxtLinkLocale to="/">Sabilajati Jepara</NuxtLinkLocale>
      </h1>

      <!-- Desktop Menu -->
      <nav class="hidden md:flex space-x-6">
        <NuxtLinkLocale to="/" class="hover:text-gray-300">{{ $t('Home') }}</NuxtLinkLocale>
        <NuxtLinkLocale to="/about" class="hover:text-gray-300">{{ $t('About') }}</NuxtLinkLocale>
        <NuxtLinkLocale to="/blog" class="hover:text-gray-300">Blog</NuxtLinkLocale>
        <NuxtLinkLocale to="/contact" class="hover:text-gray-300">{{ $t('Contact') }}</NuxtLinkLocale>
      </nav>

      <!-- Mobile Menu Button -->
      <NuxtLinkLocale to="/search" class="block"><Icon name="ri:search-line"><title>Search</title></Icon></NuxtLinkLocale>
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
          >
            <title>Menu</title>
          </path>
        </svg>
      </button>
    </div>

    <!-- Mobile Menu -->
    <transition name="fade">
      <div
        v-if="isMenuOpen"
        class="fixed inset-0 bg-slate-300 flex flex-col text-xl
        px-4 py-4 z-50"
      >
        <div class="flex text-gray-300 focus:outline-none
          text-2xl justify-between">
          <div class="font-bold text-black">Sabilajati Jepara</div>
          <div class="space-x-2">
            <button
              class="text-gray-300 focus:outline-none
              text-2xl"
              @click="toggleMenu"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="#000"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                >
                  <title>Close</title>
                </path>
              </svg>
            </button>
          </div>
        </div>
        <div class="flex flex-col px-8 py-20 space-y-8">
        <NuxtLinkLocale
          to="/"
          class="hover:text-gray-400 text-2xl"
          @click="toggleMenu"
        >{{ $t('Home') }}</NuxtLinkLocale>
        <NuxtLinkLocale
          to="/about"
          class="hover:text-gray-400 text-2xl"
          @click="toggleMenu"
        >{{ $t('About') }}</NuxtLinkLocale>
        <NuxtLinkLocale
          to="/blog"
          class="hover:text-gray-400 text-2xl"
          @click="toggleMenu"
        >Blog</NuxtLinkLocale>
        <NuxtLinkLocale
          to="/howorder"
          class="hover:text-gray-400 text-2xl"
          @click="toggleMenu"
        >{{ $t('How To Order') }}</NuxtLinkLocale>
        <NuxtLinkLocale
          to="/contact"
          class="hover:text-gray-400 text-2xl"
          @click="toggleMenu"
        >{{ $t('Contact') }}</NuxtLinkLocale>
        </div>
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
      
      if (this.isMenuOpen) {
        document.body.classList.add("overflow-hidden");
      } else {
        document.body.classList.remove("overflow-hidden");
      }
    },
  },
  // Bersihkan kelas ketika komponen dihancurkan
  beforeDestroy() {
    document.body.classList.remove("overflow-hidden");
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