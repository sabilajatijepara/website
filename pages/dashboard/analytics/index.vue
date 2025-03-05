<script setup>
import { useRouter } from "#app";
  
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
  { label: "Total Visitors", value: data.value?.totalVisitors, color: "bg-blue-500" },
  { label: "Today Visitors", value: data.value?.todayVisitors, color: "bg-green-500" },
  { label: "Weekly Visitors", value: data.value?.weeklyVisitors, color: "bg-yellow-500" },
  { label: "Monthly Visitors", value: data.value?.monthlyVisitors, color: "bg-red-500" },
]);

const createTable = (items) => items.map((item) => ({
  name: item.name,
  count: item.count,
}));
</script>

<template>
  <div class="p-4 w-full text-black">
      <div class="flex justify-start items-center">
        <button
          class="flex bg-black/20 backdrop-blur-2xl rounded-full px-4 py-3 text-white"
          @click="router.back()"
        >
          Back
        </button>
      </div>
    </div>
  <div class=""></div>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-3xl font-semibold mb-6">Dashboard Analytics</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="stat in stats" :key="stat.label" class="p-4 text-white rounded-lg" :class="stat.color">
        <h2 class="text-lg font-semibold">{{ stat.label }}</h2>
        <p class="text-2xl font-bold">{{ stat.value }}</p>
      </div>
    </div>

    <div class="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Country Stats -->
      <div>
        <h2 class="text-xl font-semibold mb-2">Visitor by Country</h2>
        <button class="mb-2 px-4 py-2 bg-blue-600 text-white rounded-lg" @click="toggleView('countries')">
          {{ showAllCountries ? "Show Top 5" : "Show All" }}
        </button>
        <ul class="bg-white shadow-md rounded-lg p-4">
          <li v-for="(item, index) in createTable(showAllCountries ? data?.allCountries : data?.topCountries)" 
              :key="index" class="flex justify-between py-2 border-b last:border-none">
            <span>{{ item.name }}</span>
            <span class="font-bold">{{ item.count }}</span>
          </li>
        </ul>
      </div>

      <!-- Traffic Sources -->
      <div>
        <h2 class="text-xl font-semibold mb-2">Traffic Sources</h2>
        <button class="mb-2 px-4 py-2 bg-blue-600 text-white rounded-lg" @click="toggleView('sources')">
          {{ showAllSources ? "Show Top 5" : "Show All" }}
        </button>
        <ul class="bg-white shadow-md rounded-lg p-4">
          <li v-for="(item, index) in createTable(showAllSources ? data?.allSources : data?.topSources)" 
              :key="index" class="flex justify-between py-2 border-b last:border-none">
            <span>{{ item.name }}</span>
            <span class="font-bold">{{ item.count }}</span>
          </li>
        </ul>
      </div>

      <!-- Most Visited Pages -->
      <div>
        <h2 class="text-xl font-semibold mb-2">Most Visited Pages</h2>
        <button class="mb-2 px-4 py-2 bg-blue-600 text-white rounded-lg" @click="toggleView('pages')">
          {{ showAllPages ? "Show Top 5" : "Show All" }}
        </button>
        <ul class="bg-white shadow-md rounded-lg p-4">
          <li v-for="(item, index) in createTable(showAllPages ? data?.allPages : data?.topPages)" 
              :key="index" class="flex justify-between py-2 border-b last:border-none">
            <span>{{ item.name }}</span>
            <span class="font-bold">{{ item.count }}</span>
          </li>
        </ul>
      </div>

      <!-- Browser Stats -->
      <div>
        <h2 class="text-xl font-semibold mb-2">Visitor by Browser</h2>
        <button class="mb-2 px-4 py-2 bg-blue-600 text-white rounded-lg" @click="toggleView('browsers')">
          {{ showAllBrowsers ? "Show Top 5" : "Show All" }}
        </button>
        <ul class="bg-white shadow-md rounded-lg p-4">
          <li v-for="(item, index) in createTable(showAllBrowsers ? data?.allBrowsers : data?.topBrowsers)" 
              :key="index" class="flex justify-between py-2 border-b last:border-none">
            <span>{{ item.name }}</span>
            <span class="font-bold">{{ item.count }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>