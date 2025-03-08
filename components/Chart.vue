<script setup>
import { ref, onMounted } from "vue";

const props = defineProps(["dataPoints"]);
const pathD = ref("");

onMounted(() => {
  generatePath();
});

const generatePath = () => {
  if (!props.dataPoints || props.dataPoints.length === 0) return;

  const width = 300; // Lebar chart
  const height = 150; // Tinggi chart
  const maxData = Math.max(...props.dataPoints); // Cari nilai tertinggi untuk skala
  const minData = Math.min(...props.dataPoints); // Cari nilai terendah

  const scaleY = (value) => height - ((value - minData) / (maxData - minData)) * height;
  const stepX = width / (props.dataPoints.length - 1);

  let path = `M 0 ${height}`;
  props.dataPoints.forEach((point, index) => {
    const x = index * stepX;
    const y = scaleY(point);
    path += ` L ${x} ${y}`;
  });

  path += ` L ${width} ${height} Z`; // Tutup area chart
  pathD.value = path;
};
</script>

<template>
  <div class="w-full max-w-md mx-auto">
    <svg viewBox="0 0 300 150" class="w-full h-auto">
      <defs>
        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.6" />
          <stop offset="100%" stop-color="#3b82f6" stop-opacity="0" />
        </linearGradient>
      </defs>

      <!-- Area Chart -->
      <path :d="pathD" fill="url(#gradient)" stroke="#3b82f6" stroke-width="2" />

      <!-- Garis dasar -->
      <line x1="0" y1="150" x2="300" y2="150" stroke="#ddd" stroke-width="1" />
    </svg>
  </div>
</template>