<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";

const { $db } = useNuxtApp();

// State management
const categories = ref([]);
const newCategory = ref("");
const editedCategory = ref(""); // Untuk menyimpan nilai kategori yang sedang diedit
const editingCategoryId = ref(null); // Menyimpan ID kategori yang sedang diedit
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

// Start editing a category
const handleEditCategory = (category) => {
  editingCategoryId.value = category.id;
  editedCategory.value = category.name;
};

// Save edited category
const handleSaveCategory = async () => {
  if (!editedCategory.value.trim()) {
    alert("Category name cannot be empty");
    return;
  }

  try {
    const categoryDocRef = doc($db, "categories", editingCategoryId.value);
    await updateDoc(categoryDocRef, { name: editedCategory.value });
    alert("Category updated successfully!");
    editingCategoryId.value = null; // Reset editing state
    editedCategory.value = "";
    await fetchCategories(); // Refresh categories
  } catch (error) {
    alert("Error updating category. Please try again.");
    console.error(error);
  }
};

// Cancel editing
const handleCancelEdit = () => {
  editingCategoryId.value = null;
  editedCategory.value = "";
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
        <!-- Check if editing this category -->
        <div v-if="editingCategoryId === category.id" class="flex items-center gap-2">
          <input
            type="text"
            v-model="editedCategory"
            class="border p-2"
          />
          <button
            @click="handleSaveCategory"
            class="bg-blue-500 text-white px-2 py-1"
          >
            Save
          </button>
          <button
            @click="handleCancelEdit"
            class="bg-gray-500 text-white px-2 py-1"
          >
            Cancel
          </button>
        </div>
        <div v-else class="flex items-center gap-4">
          {{ category.name }}
          <button
            @click="handleEditCategory(category)"
            class="bg-yellow-500 text-white px-2 py-1"
          >
            Edit
          </button>
          <button
            @click="handleDeleteCategory(category.id)"
            class="bg-red-500 text-white px-2 py-1"
          >
            Delete
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* Optional styling */
</style>