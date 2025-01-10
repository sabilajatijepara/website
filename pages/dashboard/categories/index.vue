<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";

const { $db } = useNuxtApp();

// State management
const categories = ref([]);
const newCategory = ref("");
const router = useRouter();

// Fetch categories from Firestore
const fetchCategories = async () => {
  try {
    const snapshot = await getDocs(collection($db, "categories"));
    categories.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

// Add new category
const handleAddCategory = async () => {
  if (!newCategory.value.trim()) {
    alert("Category name cannot be empty");
    return;
  }

  try {
    await addDoc(collection($db, "categories"), { name: newCategory.value });
    newCategory.value = ""; // Clear input field
    alert("Category added successfully!");
    await fetchCategories(); // Refresh categories
  } catch (error) {
    alert("Error adding category. Please try again.");
    console.error(error);
  }
};

// Delete a category
const handleDeleteCategory = async (id) => {
  if (confirm("Are you sure you want to delete this category?")) {
    try {
      await deleteDoc(doc($db, "categories", id));
      categories.value = categories.value.filter((category) => category.id !== id);
    } catch (error) {
      alert("Error deleting category. Please try again.");
      console.error(error);
    }
  }
};

// Fetch categories on mount
onMounted(fetchCategories);
</script>

<template>
  <div class="p-8">
    <!-- Back Button -->
    <div class="w-full text-black">
      <div class="flex justify-start items-center">
        <button
          class="flex bg-black/20 backdrop-blur-2xl rounded-full px-4 py-3 text-white"
          @click="router.back()"
        >
          Back
        </button>
      </div>
    </div>

    <div class="py-2"></div>
    <h1 class="text-2xl font-bold mb-6">Manage Categories</h1>

    <!-- Add Category Form -->
    <form @submit.prevent="handleAddCategory" class="mb-6">
      <input
        type="text"
        v-model="newCategory"
        class="border p-2 mr-4"
        placeholder="New Category Name"
      />
      <button type="submit" class="bg-green-500 text-white px-4 py-2">
        Add Category
      </button>
    </form>

    <!-- Categories List -->
    <h2 class="text-xl font-semibold">Categories List</h2>
    <ul class="list-disc ml-6">
      <li v-for="category in categories" :key="category.id" class="mb-2">
        {{ category.name }}
        <button
          @click="handleDeleteCategory(category.id)"
          class="bg-red-500 text-white px-2 py-1 ml-4"
        >
          Delete
        </button>
      </li>
    </ul>
  </div>
</template>