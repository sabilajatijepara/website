<script setup>
import { useRouter } from "#app";

import NavBarDash from "../components/NavBarDash";
  
const { data } = await useFetch("/api/analytics");

const router = useRouter();

definePageMeta({
  middleware: "auth",
});

const showAllCountries = ref(false);
const showAllSources = ref(false);
const showAllPages = ref(false);
const showAllBrowsers = ref(false);

const toggleView = (type) => {
  if (type === "countries") showAllCountries.value = !showAllCountries.value;
  if (type === "sources") showAllSources.value = !showAllSources.value;
  if (type === "pages") showAllPages.value = !showAllPages.value;
  if (type === "browsers") showAllBrowsers.value = !showAllBrowsers.value;
};

const stats = computed(() => [
  { label: "Total Pengunjung", value: data.value?.totalVisitors, color: "bg-slate-700" },
  { label: "Hari Ini", value: data.value?.todayVisitors, color: "bg-slate-600" },
  { label: "Per Minggu", value: data.value?.weeklyVisitors, color: "bg-slate-500" },
  { label: "Per Bulan", value: data.value?.monthlyVisitors, color: "bg-slate-400" },
]);

const createTable = (items) => items.map((item) => ({
  name: item.name,
  count: item.count,
}));
</script>

<template class="bg-slate-100">
  <div class="flex">
    <NavBarDash />
  </div>
  <div class="bg-slate-100">
  <div class="container mx-auto p-6 bg-slate-100 flex-1 min-h-screen">
    <h1 class="text-3xl font-semibold mb-6">Dashboard</h1>

    <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="stat in stats" :key="stat.label" class="p-4 text-white rounded-2xl" :class="stat.color">
        <h2 class="text-3xl font-bold">{{ stat.value }}</h2>
        <p class="text-base">{{ stat.label }}</p>
      </div>
    </div>

    <div class="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Country Stats -->
      <div>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold mb-2">Visitor by Country</h2>
          <button class="mb-2 px-4 py-2 bg-blue-600 text-white rounded-full" @click="toggleView('countries')">
            {{ showAllCountries ? "Show Top 5" : "Show All" }}
          </button>
        </div>
        <ul class="bg-white shadow-md rounded-2xl p-4">
          <li v-for="(item, index) in createTable(showAllCountries ? data?.allCountries : data?.topCountries)" 
              :key="index" class="flex justify-between py-2 border-b last:border-none">
            <span>{{ item.name }}</span>
            <span class="font-bold">{{ item.count }}</span>
          </li>
        </ul>
      </div>

      <!-- Traffic Sources -->
      <div>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold mb-2">Traffic Sources</h2>
          <button class="mb-2 px-4 py-2 bg-blue-600 text-white rounded-full" @click="toggleView('sources')">
            {{ showAllSources ? "Show Top 5" : "Show All" }}
          </button>
        </div>
        <ul class="bg-white shadow-md rounded-2xl p-4">
          <li v-for="(item, index) in createTable(showAllSources ? data?.allSources : data?.topSources)" 
              :key="index" class="flex justify-between py-2 border-b last:border-none">
            <span>{{ item.name }}</span>
            <span class="font-bold">{{ item.count }}</span>
          </li>
        </ul>
      </div>

      <!-- Most Visited Pages -->
      <div>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold mb-2">Most Visited Pages</h2>
          <button class="mb-2 px-4 py-2 bg-blue-600 text-white rounded-full" @click="toggleView('pages')">
            {{ showAllPages ? "Show Top 5" : "Show All" }}
          </button>
        </div>
        <ul class="bg-white shadow-md rounded-2xl p-4">
          <li v-for="(item, index) in createTable(showAllPages ? data?.allPages : data?.topPages)" 
              :key="index" class="flex justify-between py-2 border-b last:border-none">
            <span>{{ item.name }}</span>
            <span class="font-bold">{{ item.count }}</span>
          </li>
        </ul>
      </div>

      <!-- Browser Stats -->
      <div>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold mb-2">Visitor by Browser</h2>
          <button class="mb-2 px-4 py-2 bg-blue-600 text-white rounded-full" @click="toggleView('browsers')">
            {{ showAllBrowsers ? "Show Top 5" : "Show All" }}
          </button>
        </div>
        <ul class="bg-white shadow-md rounded-2xl p-4">
          <li v-for="(item, index) in createTable(showAllBrowsers ? data?.allBrowsers : data?.topBrowsers)" 
              :key="index" class="flex justify-between py-2 border-b last:border-none">
            <span>{{ item.name }}</span>
            <span class="font-bold">{{ item.count }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
  </div>
</template>