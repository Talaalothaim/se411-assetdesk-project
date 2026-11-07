
# AssetDesk — IT Asset Management System

SE411 Course Project | Prince Sultan University

## Team Members

- Tala Alothaim
- Reema Alsabhan
- Norah Aljasser

## Project Overview

AssetDesk is a full-stack IT asset management application developed using React and Java Spring Boot. It allows organizations to manage laptops, monitors, desktops, and accessories.

The project consists of:

- Part 1: React frontend with an in-memory data service.
- Part 2: Spring Boot REST API, H2 database, automated backend tests, and frontend-backend integration.

## Technologies Used

### Frontend
- React 18
- JavaScript
- Vite
- React Router
- CSS
- Vitest
- React Testing Library

### Backend
- Java 21
- Spring Boot 3.5.7
- Spring Web
- Spring Data JDBC
- H2 Database
- Maven
- JUnit 5
- Mockito

## Features

- Dashboard with inventory statistics
- Add new assets
- Find assets by ID
- View assets with pagination
- Update asset details
- Delete assets
- Filter by type, condition, and status
- Search by device name, serial number, or employee
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
    ├── vite.config.js
    └── README.md

## Running the Backend

Requirements:
- Java 21
- Maven or Eclipse with Maven support

Open the backend folder in Eclipse as an existing Maven project and run the Spring Boot application.

Alternatively, from the backend directory:

    mvn spring-boot:run

The backend runs at:

http://localhost:8080

The API base URL is:

http://localhost:8080/api/assets

The H2 database contains 12 sample assets when the application starts.

## Running the Frontend

Requirements:
- Node.js compatible with Vite 8
- npm

From the repository root, run:

    npm install
    npm run dev

Open:

http://localhost:5173

The Spring Boot backend must be running for asset operations to work.

## REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/assets | View assets with pagination and filters |
| GET | /api/assets/{id} | Find an asset by ID |
| POST | /api/assets | Add an asset |
| PUT | /api/assets/{id} | Update an asset |
| DELETE | /api/assets/{id} | Delete an asset |
| GET | /api/assets/stats | Get dashboard statistics |

### Pagination and Filtering

Example:

    GET /api/assets?page=0&size=5&type=LAPTOP&status=ASSIGNED

Supported query parameters:

- page
- size
- q
- type
- condition
- status

## Backend Architecture

The backend follows a layered architecture:

    Controller -> Service -> Repository -> H2 Database

- Controller: Handles HTTP requests and responses.
- Service: Handles business logic, validation, filtering, and pagination.
- Repository: Provides database access using Spring Data JDBC.
- Model: Defines asset properties and enumerations.

## Testing

### Backend Tests

JUnit 5 and Mockito are used to test controllers and services.

Run from the backend folder:

    mvn test

Verified results:

- 10 tests passed
- 0 failures

### Frontend Tests

Run from the repository root:

    npm test

Verified results:

- 84 tests passed
- 7 test files passed

The frontend includes component, CRUD, filtering, pagination, and mocked HTTP communication tests.

### Additional Checks

    npm run lint
    npm run build

Both commands completed successfully during development.

## Frontend-Backend Integration

The frontend communicates with Spring Boot using the Fetch API.

The React service sends HTTP requests to the backend, processes JSON responses, and handles validation and request errors.

The original in-memory service is retained for isolated frontend tests.

## Database

The application uses an in-memory H2 database.

- 12 sample assets are loaded at startup.
- Assets can be added, updated, searched, and deleted.
- Restarting the backend resets the database.

## Documentation

- [Requirements](docs/REQUIREMENTS.md)
- [Architecture](docs/ARCHITECTURE.md)

## AI Use

AI-assisted tools were used in the development of the Part 1 frontend. The team reviewed and tested the implementation. Part 2 involved developing the Spring Boot backend, integrating it with the frontend, and verifying the system through automated testing.
