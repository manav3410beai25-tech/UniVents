import { STORAGE_KEYS, getStoredItem, setStoredItem } from './storageService.js';

export const categoryService = {
  getCategories() {
    return getStoredItem(STORAGE_KEYS.CATEGORIES, []);
  },

  getActiveCategories() {
    return this.getCategories().filter((c) => c.isActive);
  },

  createCategory({ name, slug, icon = 'Tag' }) {
    const categories = this.getCategories();
    const cleanSlug = (slug || name).toLowerCase().replace(/[^a-z0-9]/g, '-');

    if (categories.some((c) => c.slug === cleanSlug)) {
      throw new Error('A category with this slug already exists.');
    }

    const newCat = {
      id: `cat_${cleanSlug}_${Date.now().toString(36)}`,
      name: name.trim(),
      slug: cleanSlug,
      icon,
      isActive: true,
    };

    categories.push(newCat);
    setStoredItem(STORAGE_KEYS.CATEGORIES, categories);
    return newCat;
  },

  updateCategory(id, updates) {
    const categories = this.getCategories();
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Category not found');

    categories[index] = { ...categories[index], ...updates };
    setStoredItem(STORAGE_KEYS.CATEGORIES, categories);
    return categories[index];
  },

  toggleCategoryStatus(id) {
    const categories = this.getCategories();
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Category not found');

    categories[index].isActive = !categories[index].isActive;
    setStoredItem(STORAGE_KEYS.CATEGORIES, categories);
    return categories[index];
  },
};
