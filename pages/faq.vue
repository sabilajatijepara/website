<template>
  <div>
    <NavBar />
  </div>
  <div class="min-h-screen py-10 px-4 max-w-4xl">
    <h1 class="text-3xl font-bold text-center mb-6">Frequently Asked Questions</h1>
    <FaqAccordion />
  </div>
  <div class="container mx-auto max-w-4xl">
    <Footer />
  </div>
</template>

<script setup>
import { useHead } from "#imports";
import FaqAccordion from '~/components/FaqAccordion.vue';

const seoData = {
  title: "FAQ - CV. Sabilajati Mebel Jepara",
  description: "Temukan jawaban dari pertanyaan yang sering diajukan seputar furniture, custom order, dan pengiriman.",
  keywords: ["FAQ", "pertanyaan umum", "furniture", "custom furniture", "pengiriman furniture"],
  image: "https://res.cloudinary.com/doninmxbl/image/upload/kquaxae4iakjge8rlve6.png",
  url: "https://sabilajati.com/faq"
};

// Data FAQ dalam bentuk array (bisa dipindah ke JSON terpisah jika perlu)
const faqs = [
  {
    question: "Apakah bisa custom desain furniture?",
    answer: "Ya, kami menerima pesanan custom sesuai desain, ukuran, dan bahan yang diinginkan pelanggan."
  },
  {
    question: "Berapa lama waktu produksi furniture custom?",
    answer: "Produksi membutuhkan waktu sekitar 2-4 minggu, tergantung jenis dan kompleksitas desain."
  },
  {
    question: "Apakah harga yang tertera sudah termasuk ongkir?",
    answer: "Harga belum termasuk ongkos kirim, biaya pengiriman tergantung lokasi tujuan."
  },
  {
    question: "Apakah ada toko fisik yang bisa dikunjungi?",
    answer: "Ya, Anda bisa mengunjungi showroom/workshop kami di Jepara."
  }
];

// Konversi FAQ ke format JSON-LD Schema.org
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map((faq) => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
};

// Menggunakan useHead untuk meta tags dan JSON-LD
useHead({
  title: seoData.title,
  meta: [
    { name: "description", content: seoData.description },
    { name: "keywords", content: seoData.keywords.join(", ") },
    { name: "robots", content: "index, follow" },
    { property: "og:title", content: seoData.title },
    { property: "og:description", content: seoData.description },
    { property: "og:image", content: seoData.image },
    { property: "og:url", content: seoData.url },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: seoData.title },
    { name: "twitter:description", content: seoData.description },
    { name: "twitter:image", content: seoData.image },
  ],
  link: [
    {
      rel: 'canonical',
      href: seoData.url
    },
  ],
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify(faqSchema)
    }
  ]
});
</script>