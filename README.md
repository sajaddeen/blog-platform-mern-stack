Project Overview
I've completed the full-stack blog platform. The project demonstrates a strong understanding of both frontend and backend development, with all the core features working end-to-end. I've focused on creating a clean, modular architecture that is both maintainable and scalable.

Core Features
User Authentication: I've implemented a secure, JWT-based authentication system for registration, login, and protected routes.

Blog Management: All CRUD operations for blog posts—creating, reading, updating, and deleting—are fully functional. I also added a draft/published workflow to manage content states.

User Interactions: Users can like posts and add comments, which are stored in a threaded format to allow for replies.

User Profiles: I've created public profile pages that display a user's bio and a list of all their posts.

Search & Filter: The platform includes a full-text search feature for finding posts by title or content.

File Uploads: I've built a dedicated API for handling image uploads.

Technologies Used
Backend: The backend is built with NestJS, using MongoDB with Mongoose. I used Passport.js and JWT for authentication, and Swagger for API documentation.

Frontend: The frontend is a Next.js application. I managed global state with Zustand and styled the UI using Tailwind CSS and Shadcn UI. React Quill was used as the rich text editor.

Setup Instructions
To run the project on your machine, follow these steps.

Prerequisites:

Node.js (v18 or higher)

MongoDB instance (local or cloud)

1. Clone the Repository

Bash

git clone https://github.com/ahamedsajad/blog-platform-mern-stack.git
cd blog-platform-mern-stack
2. Backend Setup

Navigate to the backend directory: cd backend

Install dependencies: npm install

Create a .env file with your database URI and JWT secret.

Run the server: npm run start:dev

3. Frontend Setup

Open a new terminal and navigate to the frontend directory: cd frontend

Install dependencies: npm install

Run the development server: npm run dev

The backend will run on http://localhost:3000, and the frontend on http://localhost:3001.

Technical Decisions
I chose NestJS for its modularity and built-in support for a clean architecture, which made building a structured API straightforward. For the frontend, Next.js was the best choice for its performance benefits from server-side rendering and its file-based routing. I used Zustand for state management because of its simplicity and efficiency.

Test Results
I performed end-to-end tests to confirm all features are working.

User Authentication: Registration, login, and protected routes passed testing.

Blog Management: I successfully created, viewed, updated, and deleted posts. The ownership check on the backend works correctly.

User Interactions: I confirmed that I could like a post and add new comments.

Search & Profiles: The search bar correctly filters posts, and clicking a username successfully navigates to the user's profile.
