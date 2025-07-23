<template>
  <div>
    <NavBar />
    <div class="py-3"></div>
    <div class="container mx-auto flex flex-col px-6 space-y-4 max-w-4xl">
      <div class="bg-slate-300 px-4 py-6">
        <div><Icon name="tabler:help-square-rounded" size="3rem"></Icon></div>
        <div class="text-xl font-bold py-2">Anda memiliki pertanyaan?</div>
        <div>Lihat berbagai solusi di halaman FAQ kami.</div>
        <div class="py-6 w-full">
          <NuxtLinkLocale to="/faq" class="border-2 border-black px-4 py-3 hover:bg-black hover:text-white">Lihat FAQ</NuxtLinkLocale>
        </div>
      </div>
      <div class="border-2 border-black px-4 py-6">
        <div><Icon name="tabler:message-circle" size="3rem"></Icon></div>
        <div class="text-xl font-bold py-2">Message</div>
        <div>(+62)85225208256</div>
        <div>sabilajatijepara@gmail.com</div>
        <div>admin@sabilajati.com</div>
      </div>
      <div class="border-2 border-black px-4 py-6">
        <div><Icon name="tabler:map-pin" size="3rem"></Icon></div>
        <div class="text-xl font-bold py-2">{{ $t('Location') }}</div>
        <div>
          <iframe class="w-full h-64"
          src="https://maps.google.com/maps?width=600&amp;height=400&amp;hl=en&amp;q=Workshop Sabilajati&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
          allowfullscreen="" loading="lazy"></iframe>
        </div>
      </div>
    </div>
    <div class="py-3"></div>
    <div class="max-w-4xl">
      <Footer />
    </div>
  </div>
</template>

<script setup>
</script>