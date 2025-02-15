<template>
  <footer class="container mx-auto px-8 py-8 border-t">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 justify-between">
      <div>
        <div class="font-bold text-2xl">Sabilajati Jepara</div>
        <div class="space-y-2 pt-2">
          <div class="text-gray-600">
            {{ $t('AboutFoo') }}
          </div>
        </div>
      </div>
      <div>
        <div class="font-bold">{{ $t('Find Us') }}</div>
        <div class="space-y-2">
        <div class="pt-3"><Icon name="ri:map-pin-2-line"/>
            <nuxt-link to="https://maps.app.goo.gl/aUv74NiqGtibWH8b7">
            <span class="px-1 hover:underline">Jl. Jepara - Bangsri, Dusun 3, Suwawal, Kec. Mlonggo, Kabupaten
            Jepara, Jawa Tengah 59452 (Samping Alfamart)</span>
            </nuxt-link>
          </div>
          <div class="flex items-center">
            <nuxt-link to="https://wa.me/+6285225208256">
            <Icon name="ri:whatsapp-line"/><span
          class="px-1">+6285225208256</span>
          </nuxt-link>
          </div>
        </div>
      </div>
      <div>
        <div class="font-bold">Company</div>
        <div class="space-y-1 pt-2">
          <div><nuxt-link :to="localePath('about')">{{ $t('About') }}</nuxt-link></div>
          <div><NuxtLinkLocale to="howorder">{{ $t('How To Order') }}</NuxtLinkLocale></div>
          <div><NuxtLinkLocale to="contact">{{ $t('Contact') }}</NuxtLinkLocale></div>
          <div><NuxtLinkLocale to="blog">Blog</NuxtLinkLocale></div>
        </div>
      </div>
    </div>
    <div class="py-4">
      <hr class="w-48 h-1 mx-auto my-2 bg-black/70 border-0 rounded md:my-10">
      <div class="text-center py-2">
        <div class="space-x-4">
          <nuxt-link
          to="https://instagram.com/sabilajati_jepara"><Icon
          name="ri:instagram-line"><title>Instagram</title></Icon></nuxt-link>
          <nuxt-link
          to="https://tiktok.com/@sabilajatijepara"><Icon
          name="ri:tiktok-line"><title>Tiktok</title></Icon></nuxt-link>
        </div>
        <div class="pt-2">© 2025 Sabilajati Jepara.</div>
        <div>All Right Reserved.</div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const { t } = useI18n()
const localePath = useLocalePath()
</script>