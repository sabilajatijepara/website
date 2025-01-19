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
          <span>{{ $t('How To Order') }}</span>
        </li>
      </ol>
    </div>
    <div class="py-4"></div>
    </div>
    <div>
      <div class="font-bold text-2xl">{{ $t('How To Order') }}</div>
      <div class="py-2"></div>
      <div class="py-4">
        <div>
          {{ $t('How Order 0') }}
        </div>
        <div class="py-2"></div>
        <ul class="list-decimal px-4">
          <li>
            {{ $t('How Order 1') }}
          </li>
          <li>
            {{ $t('How Order 2') }}
          </li>
          <li>
            {{ $t('How Order 3') }}
          </li>
          <li>
            {{ $t('How Order 4') }}
          </li>
          <li>
            {{ $t('How Order 5') }}
          </li>
        </ul>
        <div class="py-4">
          <div class="mt-2 bg-blue-100 border border-blue-200 text-sm
          text-blue-800 rounded-lg p-4">
            {{ $t('How Order Alert') }}
          </div>
        </div>
        <div class=""></div>
        <div>{{ $t('Happy Shopping') }}</div>
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