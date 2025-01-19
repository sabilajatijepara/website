<template>
  <div>
    <NavBar />
  </div>
  <div class="container mx-auto px-4 py-4">
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
          <span>{{ $t('About') }}</span>
        </li>
      </ol>
    </div>
    <div class="py-4"></div>
    </div>
    <div>
      <div class="font-bold text-2xl">{{ $t('About') }}</div>
      <div class="py-2"></div>
      <div class="py-4">
        {{ $t('Info About') }}
      </div>
    </div>
  </div>
  <div>
    <Footer />
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import Footer from "@/components/Footer.vue";

export default {
  components: {
    NavBar,
    Footer,
  },
};
</script>