<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useCookie } from "#app";

import { signInWithEmailAndPassword } from 'firebase/auth';

// State untuk login form
const email = ref("");
const password = ref("");
const error = ref("");
const isLoading = ref(false);
const router = useRouter();
const userToken = useCookie("userToken");

// Mengakses Firebase Authentication yang sudah di-inject
const { $auth } = useNuxtApp();  // Mengakses objek auth dari NuxtApp

// Fungsi untuk login
const handleLogin = async () => {
  if (!email.value.trim() || !password.value.trim()) {
    error.value = "Email dan Password tidak boleh kosong.";
    return;
  }

  isLoading.value = true;
  error.value = ""; // Reset error message

  try {
    // Pastikan menggunakan auth dari useNuxtApp()
    const { user } = await signInWithEmailAndPassword($auth, email.value, password.value);
    
    // Ambil token ID dari Firebase
    const token = await user.getIdToken();
    //console.log(token);
    // Simpan token di cookies agar tetap login meskipun refresh
    userToken.value = token;
    alert("Login berhasil!");
    router.push("/dashboard"); // Redirect ke dashboard
  } catch (err) {
    error.value = "Login gagal. Periksa email dan password Anda.";
    console.error("Error during login:", err);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 px-8">
    <div class="w-full max-w-md bg-white shadow-md rounded-2xl px-8 py-10">
      <h1 class="text-2xl font-bold mb-6 text-center">Login</h1>
      <!-- Form Login -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div class="mb-4">
          <label for="email" class="block text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="w-full border p-2 rounded mt-1"
            placeholder="Masukkan email"
            required
          />
        </div>
        <div class="mb-4">
          <label for="password" class="block text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="w-full border p-2 rounded mt-1"
            placeholder="Masukkan password"
            required
          />
        </div>
        <!-- Pesan Error -->
        <div v-if="error" class="text-red-500 text-sm mb-4">
          {{ error }}
        </div>
        <!-- Tombol Login -->
        <div class="flex justify-center">
          <button
            type="submit"
            class="bg-slate-300 px-4 py-2 rounded w-full"
            :disabled="isLoading"
          >
            {{ isLoading ? "Logging in..." : "Login" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>