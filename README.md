# Patient Data Management System

[![Angular](https://img.shields.io/badge/Angular-DD0031?logo=angular)](https://angular.io/)
[![Bun](https://img.shields.io/badge/Bun-000000?logo=bun)](https://bun.sh)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38BDF8?logo=tailwind-css)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript)](https://www.typescriptlang.org/)
[![Sass](https://img.shields.io/badge/Sass-CC6699?logo=sass)](https://sass-lang.com/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3)](https://developer.mozilla.org/en-US/docs/Web/CSS)


Modern patient record management system with real-time CRUD operations and advanced form validation.

<!-- ![Application Screenshot](./screenshot.png) Add actual screenshot path -->

## 📦 Dependencies

### Core Stack
- **Runtime**: Bun 1.1+
- **Framework**: Angular 19
- **Styling**: Tailwind CSS 4.0
- **Component Library**: Angular Material 19
- **API Mocking**: JSON Server 0.17+
- **Type System**: TypeScript 5.3+

### Key Packages
- `@angular/core@19`
- `@angular/material@19`
- `tailwindcss@4.0`
- `json-server@0.17`
- `rxjs@7.8+`

## 🌟 Key Features

- **Modern Angular 19 Architecture**
  - Signals-based state management
  - Standalone components
  - Enhanced reactivity model
- **Tailwind 4 Advantages**
  - Zero runtime CSS
  - 25% smaller CSS output
  - New cascade layers support
- **Bun-powered Toolchain**
  - Fast package management
  - Bun runtime for server
  - Modern module resolution
- **Core Functionality**
  - Dynamic form validation
  - Image upload with preview
  - Bulk operations
  - Real-time updates
  - Error boundary handling

## 🛠️ Technology Stack

| Layer            | Technology               | Version  |
|------------------|--------------------------|----------|
| Framework        | Angular                  | 19       |
| Package Manager  | Bun                      | 1.1+     |
| Styling          | Tailwind CSS             | 4.0      |
| UI Components    | Angular Material         | 19       |
| Build System     | Vite                     | 5.0+     |
| State Management | Angular Signals          | 19       |
| API Simulation   | JSON Server              | 0.17+    |

## Installation 🚀

**1. Clone the repository:**

```
git clone https://github.com/nextpointer/skoolwhiz-task.git

cd skoolwhiz-task
```

**2. Install dependencies:**
 Make sure you have Node.js and Angular CLI installed. Then run:

```
bun install

or

npm install
```

**3. Development server**

Run the application:
```
bun start

or

npm start
```

Open your browser and navigate to http://localhost:4200/.

**4. API URL Environment setup**

create a file "_environment.ts_" under environment.ts folder ( same as environment.sample.ts file)
```
export const environment = {
    production: false,
    apiUrl: 'http://localhost:3000'
  };
```

**5. Start JSON server**
```
bun json-server --watch db.json --port 3000
```
**6. Building**

To build the project run:
```
bun build
```

This will compile your project and store the build artifacts in the dist/ directory. By default, the production build optimizes your application for performance and speed.

## 📂 Project Structure
```
src/
├── app/
│   ├── components/
│   │   ├── data-table/      # Reusable data grid component
│   │   └── patient-form/    # Form dialog component
│   ├── pages/
│   │   └── patient-list/    # Main application view
│   ├── services/            # API service layer
│   ├── validator/           # check UID uniqeness
│   └── models/              # TypeScript interfaces
├── assets/                  # Static resources

```
## 🖥️ Usage
**1. Access Application**
- Frontend:
```
http://localhost:4200
```

- API Endpoint: 
```
http://localhost:3000/patients
```

**2. Key Features**

- Add Patient: Click "Add Patient" ➞ Fill form ➞ Save

- Edit Patient: Click edit icon ➞ Modify fields ➞ Save Changes

- Delete Patient: Select checkbox(es) ➞ Delete Selected

- Image Upload: JPEG/PNG

- Form Validation: Real-time validation with error messages

- Bulk Operations: Multi-select + bulk delete

**3. Form Guidelines**

- Required fields marked with *

- UID: Exactly 11 digits

- Phone Numbers: International format accepted

- Blood Group: Select from dropdown

- Medical History: Multi-line text input

## 🤝 Acknowledgements
Bun Team - Revolutionizing JS tooling

Angular Team - Modern framework features

Tailwind Labs - CSS utility innovations

JSON Server - Mock API simplicity


## Happy Coding :)