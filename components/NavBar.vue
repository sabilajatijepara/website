<template>
  <header class="">
    <div class="container mx-auto flex items-center justify-between p-4
    bg-slate-300 rounded-2xl">
      <!-- Logo -->
      <div class="text-2xl font-bold">
        <nuxt-link to="/">Sabilajati Jepara</nuxt-link>
      </div>

      <!-- Desktop Menu -->
      <nav class="hidden md:flex space-x-6">
        <nuxt-link to="/" class="hover:text-gray-300">Home</nuxt-link>
        <nuxt-link to="/" class="hover:text-gray-300">About</nuxt-link>
        <nuxt-link to="/" class="hover:text-gray-300">Services</nuxt-link>
        <nuxt-link to="/" class="hover:text-gray-300">Contact</nuxt-link>
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
        class="fixed inset-0 bg-slate-300 flex flex-col text-xl
        px-8 py-6 z-50"
      >
        <div class="flex text-gray-300 focus:outline-none
          text-2xl justify-between">
          <div class="font-bold text-black">Sabilajati Jepara</div>
          <div>
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
                ></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="flex flex-col px-8 py-20 space-y-8">
        <nuxt-link
          to="/"
          class="hover:text-gray-300 text-2xl"
          @click="toggleMenu"
        >Home</nuxt-link>
        <nuxt-link
          to="/"
          class="hover:text-gray-300 text-2xl"
          @click="toggleMenu"
        >About</nuxt-link>
        <nuxt-link
          to="/"
          class="hover:text-gray-300 text-2xl"
          @click="toggleMenu"
        >Services</nuxt-link>
        <nuxt-link
          to="/"
          class="hover:text-gray-300 text-2xl"
          @click="toggleMenu"
        >Contact</nuxt-link>
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