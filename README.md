# Vue Blog CMS 🚀

A modern, full-stack Blog Content Management System (CMS) built with **Vue 3**, **Naive UI**, and **Express.js**. This project features a professional dashboard for managing posts, users, and profile settings with a focus on clean design and smooth user experience.

## ✨ Features

- **Professional Dashboard**: A beautiful management interface built with Naive UI.
- **Dynamic Content Management**: Create, edit, and delete blog posts with a rich form interface.
- **Advanced Authentication**: Secure login and registration with JWT, featuring real-time validation.
- **User Management**: Admin-only user list for managing platform contributors.
- **Profile Settings**: Personalized user profiles with avatar support and security settings.
- **Modern UI/UX**:
  - **Sticky Headers**: Accessible navigation throughout the site.
  - **Global Toast Feedback**: Smooth, non-intrusive notifications for all actions.
  - **Dynamic Breadcrumbs**: Intuitive navigation trail on every page.
  - **Dark Mode Support**: Styled for both light and dark aesthetics.

## 🛠 Tech Stack

### Frontend
- **Vue 3** (Composition API)
- **Vite** (Build Tool)
- **Naive UI** (Component Library)
- **Tailwind CSS** (Styling)
- **Vue Router** (Navigation)
- **Ionicons** (Icons)

### Backend
- **Node.js** & **Express**
- **MongoDB** with **Mongoose**
- **JWT (JSON Web Tokens)** for Authentication

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)

### 1. Clone the project
```bash
git clone <repository-url>
cd vue-blog
```

### 2. Backend Setup
```bash
cd backend
npm install
# Create a .env file based on your environment
# PORT, MONGODB_URI, JWT_SECRET, etc.
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Create a .env file with VITE_API_URL
npm run dev
```

---

## 📂 Project Structure

```text
├── backend/            # Express.js API
│   ├── controllers/    # Request handlers
│   ├── models/         # Database schemas
│   └── routes/         # API endpoints
├── frontend/           # Vue 3 Application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── views/      # Page components
│   │   ├── composables/# Logic hooks (auth, etc.)
│   │   └── router/     # Navigation config
```

## 📝 License

Distributed under the MIT License.
