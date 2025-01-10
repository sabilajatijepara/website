<template>
  <div class="px-4 py-2">
    <NavBar />
  </div>
  <div class="container mx-auto flex">
    <div class="px-4 py-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!--Gambar-->
        <div class="space-y-2">
          <div class="rounded-2xl overflow-hidden">
            <img class=""
            src="http://www.jatijeparamebel.com/wp-content/uploads/2020/07/Gazebo-600x600.jpg"
            alt="" />
          </div>
          <div class="flex inline-flex space-x-2 rounded-2xl overflow-hidden">
            <div>
              <img class=""
            src="http://www.jatijeparamebel.com/wp-content/uploads/2020/07/Gazebo-600x600.jpg"
            alt="" />
            </div>
            <div>
              <img class=""
            src="http://www.jatijeparamebel.com/wp-content/uploads/2020/07/Gazebo-600x600.jpg"
            alt="" />
            </div>
            <div>
              <img class=""
            src="http://www.jatijeparamebel.com/wp-content/uploads/2020/07/Gazebo-600x600.jpg"
            alt="" />
            </div>
          </div>
        </div>
        <!--Teks-->
        <div class="">
          <div class="text-4xl md:text-5xl font-bold">Rp 650.000</div>
          <div class="text-2xl md:text-4xl">Lorem Ipsum dolor sit amet</div>
          <div class="py-2"></div>
          <div class="text-base md:text-xl">Isi Teks Deksripsi Produk yang sangat panjang itu lebih
          dari 300 karakter biasanya.</div>
          <div class="py-2"></div>
          <div class="py-4">
            <div>
              <div class="flex justify-between space-x-1">
                <div>
                  <nuxt-link class="border border-slate-300 px-3 py-2
                  rounded-full">Tambah ke Keranjang</nuxt-link>
                </div>
                <div>
                  <nuxt-link class="bg-slate-300 px-3 py-3 rounded-full
                  font-bold">Beli via WhatsApp</nuxt-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="py-4"></div>
  <div class="container mx-auto flex flex-col px-4 py-4">
    <div class="py-2 md:py-6 font-bold text-2xl md:text-4xl">Produk Lainnya</div>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="rounded-2xl">
        <div class="">
          <img
          src="http://www.jatijeparamebel.com/wp-content/uploads/2020/07/Gazebo-600x600.jpg"
          alt="" class="rounded-2xl" />
        </div>
        <div class="relative bg-gray-100 py-6 rounded-2xl border-4 md:border-8 border-white
        -mt-6 px-4">
           <div class="font-bold text-xl">Lorem</div>
          <div class="">Rp 650.000</div>
          <div class="pt-4">
            <nuxt-link to="/products/lorem" class="bg-[#8b5a2b] px-4 py-2 rounded-full text-white">Detail</nuxt-link>
          </div>
        </div>
      </div>
      <div class="rounded-2xl">
        <div class="">
          <img
          src="http://www.jatijeparamebel.com/wp-content/uploads/2020/07/Gazebo-600x600.jpg"
          alt="" class="rounded-2xl" />
        </div>
        <div class="relative bg-slate-300 py-6 rounded-2xl border-4 md:border-8 border-white
        -mt-6 px-4">
           <div class="font-bold text-xl">Lorem Ipsum dolor sit amet</div>
          <div class="">Rp 650.000</div>
          <div class="pt-4">
            <nuxt-link class="bg-slate-100 px-4 py-2 rounded-full">Detail</nuxt-link>
          </div>
        </div>
      </div>
      
    </div>
  </div>
   <div class="py-4">
    <div class="px-4 container mx-auto flex">
      <div class="bg-slate-300 overflow-hidden rounded-2xl px-6 md:px-12 py-8
      md:py-12">
        <div class="relative grid grid-cols-2 gap-2 justify-items-center content-center w-full">
          <div class="place-items-center">
            <div class="relative text-2xl font-bold z-40 md:text-4xl
            backdrop-invert-0
            drop-shadow-2xl">Ingin
            Membuat Furniture Impian Anda?</div>
          </div>
          <div class="absolute z-10 inset-y-0 right-0">
            <img class="size-48 md:size-64"
            src="http://www.jatijeparamebel.com/wp-content/uploads/2020/05/Slide-JJM1.png"
            alt="" />
          </div>
        </div>
        <div class="py-4"></div>
        <div class="flex relative justify-center items-center">
          <div class="relative z-40 grid grid-cols-1 gap-4 justify-items-center content-center">
            <div class="">
              <nuxt-link class="px-4 py-3 bg-green-700 rounded-full
              text-white">Hubungi Kami Sekarang!</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container mx-auto flex">
    <Footer />
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import Footer from "@/components/Footer.vue"

  export default {
    components:
    NavBar,
    Footer,
  }
</script>