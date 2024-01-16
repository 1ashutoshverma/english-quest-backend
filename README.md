# Project Title

**Book Library Management System**

## Overview

This project implements a backend for a Book Library Management System using Node.js, Express, and MongoDB. It provides endpoints for managing books and user authentication.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Routes and Methods](#routes-and-methods)
  - [User Routes](#user-routes)
  - [Book Routes](#book-routes)
- [Models](#models)
- [Middlewares](#middlewares)
- [Environment Variables](#environment-variables)
- [License](#license)

## Features

- User authentication with signup and login functionality.
- Authorization middleware to restrict access to certain routes based on user roles.
- Book management with CRUD operations.
- Filtering, sorting, and searching for books.
- Logging of API requests using Morgan.

## Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB installed and running
- `.env` file with necessary environment variables (see Environment Variables section)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/1ashutoshverma/book-library-management.git
   ```

2. **Install Dependencies:**

   ```bash
   cd book-library-management
   npm install
   ```

3. **Start the Server:**
   ```bash
   npm start dev
   ```
