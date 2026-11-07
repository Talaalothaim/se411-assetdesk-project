
# AssetDesk — IT Asset Management System

SE411 Course Project | Prince Sultan University

## Team Members

- Tala Alothaim
- Reema Alsabhan
- Norah Aljasser

## Project Overview

AssetDesk is a full-stack IT asset management system developed using React and Java Spring Boot. It allows organizations to manage laptops, monitors, desktops, and accessories.

The project consists of two parts:

- Part 1: React frontend and an in-memory data service.
- Part 2: Spring Boot REST API, H2 database, automated backend testing, and frontend-backend integration.

## Technologies Used

### Frontend

- React 18
- JavaScript
- Vite
- React Router
- CSS
- Vitest and React Testing Library

### Backend

- Java 21
- Spring Boot 3.5.7
- Spring Web
- Spring Data JDBC
- H2 Database
- Maven
- JUnit 5 and Mockito

## Features

- Dashboard with inventory statistics
- Add, view, update, and delete IT assets
- Find assets by ID
- Paginated asset listing
- Search by device name, serial number, or employee
- Filter by asset type, condition, and status
- Form validation and duplicate serial detection
- HTTP error handling
- Responsive user interface

## Project Structure

    se411-assetdesk-project/
    ├── backend/
    │   ├── src/
    │   │   ├── main/
    │   │   └── test/
    │   └── pom.xml
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   └── tests/
    ├── public/
    ├── docs/
    ├── package.json
    ├── package-lock.json
    ├── vite.config.js
    └── README.md

## Running the Backend

Requirements:

- Java 21
- Maven or Eclipse with Maven support

Open the `backend` folder in Eclipse as an existing Maven project and run the Spring Boot application.

Alternatively, from the backend directory:

    mvn spring-boot:run

The server runs at:

http://localhost:8080

## Running the Frontend

Requirements:

- Node.js compatible with Vite 8
- npm

From the repository root:

    npm install
    npm run dev

Open the application at:

http://localhost:5173

The Spring Boot backend must also be running.

## REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/assets | Retrieve assets with pagination and filtering |
| GET | /api/assets/{id} | Find an asset by ID |
| POST | /api/assets | Add a new asset |
| PUT | /api/assets/{id} | Update an existing asset |
| DELETE | /api/assets/{id} | Delete an asset |
| GET | /api/assets/stats | Retrieve dashboard statistics |

### Pagination and Filtering

Example request:

    GET /api/assets?page=0&size=5&type=LAPTOP&status=ASSIGNED

Supported parameters:

- page
- size
- q
- type
- condition
- status

## Backend Architecture

The backend follows a layered architecture:

    Controller → Service → Repository → H2 Database

- Controller: Handles HTTP requests and responses.
- Service: Handles business logic, validation, filtering, and pagination.
- Repository: Provides database access through Spring Data JDBC.
- Model: Defines asset properties and enumerations.

## Testing

### Backend

JUnit 5 and Mockito are used for controller and service tests.

From the backend directory:

    mvn test

Verified results:

- 10 tests passed
- 0 failures

### Frontend

From the repository root:

    npm test

Verified results:

- 84 tests passed
- 7 test files passed

Frontend tests cover components, CRUD operations, pagination, filtering, and mocked HTTP requests.

Additional checks:

    npm run lint
    npm run build

Both checks passed during development.

## Frontend-Backend Integration

React communicates with Spring Boot using the Fetch API.

The frontend sends HTTP requests to the backend, processes JSON responses, and displays validation errors.

The original in-memory service is retained for isolated frontend testing.

## Database

The application uses an in-memory H2 database.

- 12 sample assets are loaded on startup.
- Assets can be created, updated, retrieved, and deleted.
- Restarting the backend resets the database to its initial state.

## Documentation

- [Requirements](docs/REQUIREMENTS.md)
- [Architecture](docs/ARCHITECTURE.md)

## Note on AI Use

AI-assisted tools were used in the development of the Part 1 frontend. The team reviewed and tested the implementation. Part 2 involved developing the Spring Boot backend, integrating it with the frontend, and verifying the system through automated testing.
