// src/composables/useDarkMode.js
import { ref, onMounted, watch } from "vue";

export function useDarkMode() {
  const isDark = ref(false);

  onMounted(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      isDark.value = savedTheme === "dark";
    } else {
      isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    updateTheme();
  });

  const toggleDark = () => {
    isDark.value = !isDark.value;
    updateTheme();
  };

  const updateTheme = () => {
    // Update document class and localStorage
    if (isDark.value) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Watch for system theme changes
  onMounted(() => {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (!localStorage.getItem("theme")) {
          isDark.value = e.matches;
          updateTheme();
        }
      });
  });

  return {
    isDark,
    toggleDark,
  };
}
