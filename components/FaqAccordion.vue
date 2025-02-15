<template>
  <div class="w-full max-w-2xl mx-auto">
    <div class="divide-y">
    <div v-for="(item, index) in faqs" :key="index" class="py-2">
      <!-- Button Pertanyaan -->
      <button
        @click="toggle(index)"
        class="w-full flex justify-between items-center py-4 px-4 text-left text-lg font-bold transition-colors hover:text-slate-600"
      >
        {{ item.question }}
        <Icon
          :name="activeIndex === index ? 'ic:round-remove' : 'ic:round-add'"
          class="text-2xl transition-transform duration-300"
        />
      </button>

      <!-- Jawaban dengan Animasi -->
      <div 
        class="overflow-hidden transition-all duration-300"
        :class="activeIndex === index ? 'max-h-40 opacity-100 py-2' : 'max-h-0 opacity-0 py-0'"
      >
        <p class="px-4 text-gray-600">{{ item.answer }}</p>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const activeIndex = ref(null);

const toggle = (index) => {
  activeIndex.value = activeIndex.value === index ? null : index;
};

const faqs = ref([
  { question: "Apa saja jenis furniture yang tersedia?", answer: "Kami menyediakan berbagai jenis furniture seperti meja dan kursi sekolah, meja dan kursi cafe, gazebo, bungalow, serta furniture custom sesuai permintaan." },
  { question: "Apakah bisa custom desain furniture?", answer: "Ya, kami menerima pesanan custom sesuai dengan desain, ukuran, dan bahan yang diinginkan pelanggan. Silakan hubungi kami untuk konsultasi lebih lanjut." },
  { question: "Berapa lama waktu produksi furniture custom?", answer: "Waktu produksi bervariasi tergantung pada jenis dan kompleksitas desain. Secara umum, produksi membutuhkan waktu sekitar 2-4 minggu." },
  { question: "Apakah harus membayar DP (Down Payment) sebelum produksi?", answer: "Ya."
  },
  { question: "Apakah harga yang tertera sudah termasuk ongkir?", answer: "Harga yang tertera belum termasuk ongkos kirim. Biaya pengiriman akan disesuaikan dengan lokasi tujuan."
  },
  { question: "Apakah bisa mengirim ke seluruh Indonesia?", answer: "Ya, kami bisa mengirim ke seluruh Indonesia melalui ekspedisi terpercaya yang bekerja sama dengan kami."
  },
  { question: "Bagaimana jika produk yang diterima rusak atau cacat?", answer: "Jika ada kerusakan akibat proses produksi atau pengiriman, segera hubungi kami dalam waktu 24 jam setelah barang diterima, disertai foto atau video sebagai bukti."
  },
  { question: "Apakah ada toko fisik yang bisa dikunjungi?", answer: "Ya, anda bisa mengunjungi showroom/workshop kami di Jepara."
  },
]);
</script>