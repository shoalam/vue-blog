import data from "../data/data.json";

export const fetchRecentBlogs = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return data.blogs.slice(0, 3);
};

export const fetchAllBlogs = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return data.blogs;
};

export const fetchBlogById = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return data.blogs.find((blog) => blog.id === parseInt(id));
};

export const searchBlogs = async (query) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  query = query.toLowerCase();
  return data.blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(query) ||
      blog.content.toLowerCase().includes(query) ||
      blog.excerpt.toLowerCase().includes(query) ||
      blog.tags.some((tag) => tag.toLowerCase().includes(query))
  );
};

export const fetchBlogsByCategory = async (category) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return data.blogs.filter(
    (blog) => blog.category.toLowerCase() === category.toLowerCase()
  );
};

export const fetchCategories = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return data.categories;
};

export const fetchAuthorInfo = async (authorName) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return data.authors.find(
    (author) => author.name.toLowerCase() === authorName.toLowerCase()
  );
};
