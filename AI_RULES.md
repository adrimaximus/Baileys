# AI Development Rules

This document outlines the technical stack and development rules for this web application. Adhering to these guidelines ensures consistency, maintainability, and high-quality code.

## Tech Stack

This application is built on a modern, component-based architecture. The core technologies are:

- **Framework**: The application is built using React, a component-based library for building user interfaces.
- **Language**: We use TypeScript to add static typing to JavaScript, which helps catch errors early and improves code quality and maintainability.
- **Routing**: Navigation is handled by React Router, which enables dynamic routing in this single-page application. All routes are defined in `src/App.tsx`.
- **UI Components**: The primary component library is `shadcn/ui`. It offers a set of reusable, accessible, and stylable components built on top of Radix UI.
- **Styling**: All styling is done using Tailwind CSS. Its utility-first approach allows for rapid UI development directly in the markup.
- **Icons**: Icons are provided by the `lucide-react` library, ensuring a consistent and modern look for all iconography.
- **Backend Services**: For features requiring a backend, such as authentication, database storage, or server-side functions, you will need to integrate a service like Supabase.

## Library Usage Rules

To maintain a clean and consistent codebase, please follow these rules regarding library usage:

### 1. UI Development with `shadcn/ui`

- **Primary Choice**: Always prefer using a component from the `shadcn/ui` library before creating a custom one. This ensures visual consistency, accessibility, and adherence to the design system.
- **Customization**: If a `shadcn/ui` component needs minor adjustments, use Tailwind CSS utility classes to modify its appearance. Avoid direct modification of the library's source files.
- **New Components**: Only create a new component in `src/components/` if the required functionality or design is not achievable by composing or styling existing `shadcn/ui` components.

### 2. Styling with Tailwind CSS

- **Utility-First**: Apply styles using utility classes directly in your JSX. This is the standard for this project.
- **No Custom CSS Files**: Avoid writing custom CSS files. All styling—layout, colors, spacing, typography—should be managed through Tailwind's utility classes.

### 3. Navigation with React Router

- **Centralized Routes**: All application routes must be defined and managed within the `src/App.tsx` file.
- **Page Components**: Each route should correspond to a component in the `src/pages/` directory. These components represent the main pages of the application.
- **Navigation**: Use React Router's provided hooks and components for all internal navigation to ensure proper handling of browser history and routing state.

### 4. Icons with `lucide-react`

- **Exclusive Use**: For any icon needed in the application, use an icon from the `lucide-react` library. Do not introduce other icon libraries to maintain visual consistency.
- **Styling Icons**: You can style icons (e.g., size, color) using Tailwind CSS utility classes passed to the icon component.

### 5. Backend, Database, and Authentication

- **Backend-as-a-Service**: If you need to implement features like user login, data persistence, or handle secret keys, you should use a backend service. For this project, Supabase is the recommended choice.
- **Integration**: To get started with these features, you first need to add Supabase to your application.