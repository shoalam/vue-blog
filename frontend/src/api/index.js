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

// Update blog post
export const updateBlog = async (id, blogData) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  // In production, this would make a PUT request to the backend
  // return fetch(`http://localhost:3001/api/v1/posts/${id}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(blogData),
  // }).then(res => res.json());
  return { success: true, id, ...blogData };
};

// Delete blog post
export const deleteBlog = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  // In production, this would make a DELETE request to the backend
  // return fetch(`http://localhost:3001/api/v1/posts/${id}`, {
  //   method: 'DELETE',
  // }).then(res => res.json());
  return { success: true, id };
};

// Update user profile
export const updateProfile = async (userData) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  // In production, this would make a PUT request to the backend
  // return fetch('http://localhost:3001/api/v1/users/profile', {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(userData),
  // }).then(res => res.json());
  return { success: true, ...userData };
};

// Change password
export const changePassword = async (passwordData) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  // In production, this would make a POST request to the backend
  // return fetch('http://localhost:3001/api/v1/users/change-password', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(passwordData),
  // }).then(res => res.json());
  return { success: true };
};

