
# Candle Gift Box Production Builder
Author: Tal Givati Dener

---

## Overview
The Monday-Candle-App is a full-stack web application designed to streamline the order and production process for custom luxury candles. It allows designers to place orders via a web interface, which are then processed and tracked by production managers. The application integrates with Monday.com for order tracking and workflow management.

## Key Features:
- **Fragrance Management**: Designers can select from a catalog of available fragrances to create custom scent combinations for each order. New fragrances can be added, updated, or deleted.
- **Order Management**: Designers can create orders by selecting fragrances and creating custom inscriptions.
- **Production Management**: Production managers can track the status of orders and manage candle production.
- **User Feedback and Notifications**: The system provides custom error messages, notifications for successful actions, and alerts for missing or incorrect information, guiding users through the workflow.
- **Integration with Monday.com**: Orders are synchronized with Monday.com, and the production process can be tracked within the platform.
- **SPA Architecture**: A seamless, single-page application (SPA) built with React, allowing users to navigate between pages without full-page reloads.
- **Scalability and Performance**: The application is designed to scale with increased demand, whether adding more orders or fragrances, ensuring smooth operation even with high traffic.
- **Observability**: The application includes basic logging in the server to provide insight into the system's behavior. Currently, logs are printed to the console, helping developers track requests and identify issues during development.
Logs are generated using winston, which provides flexibility for future improvements.


## Code Structure and Architecture

The project follows a modular, clean architecture that organizes functionality into separate components and directories. The primary directories in the project are:

- **`src/`**: Contains the backend code for the application.
- **`client/`**: Contains the frontend code.
- **`tests/`**: Contains test files for both frontend and backend.
- **`database/`**: Contains database-related files (schema definitions, seeding scripts).

### Backend (`src/`)
The backend follows the Service-Controller Architecture, which ensures a clean separation of concerns between handling requests and business logic:

- **`controllers/`**: Manages incoming HTTP requests and responses. Each controller handles a specific resource.
- **`services/`**: Contains business logic, such as interacting with the database and performing core functionality.
- **`routes/`**: Defines the API routes, mapping them to corresponding controllers.
- **`middlewares/`**: Includes middleware for tasks like error handling and authentication (relevant only when running the app via the Monday.com Iframe).
- **`config/`**: Stores configuration files and constants used throughout the application, such as HTTP status codes, environment-specific settings, and other configuration data needed by the app. It does not store `.env` files, which are located outside this directory.
- **`utils/`**: Includes utility functions that are used throughout the application. This folder includes things like logging utilities, error handling utilities, or any other helper functions.
- **`errors/`**: Defines custom error handling mechanisms, ensuring that all errors are properly logged and sent to the client in a structured way.


### Frontend (`client/`)
The client-side of the application follows a modular and scalable architecture built with React and VIBE, ensuring a well-organized structure, a consistent, high-quality user interface, and aligning with the look and feel of Monday.com.

- **`src/`**: Contains the React app code, including components and state management.
  1. **`components/`**
   Contains React components, which are individual UI units responsible for displaying data and handling user interactions. These components follow the VIBE guidelines for consistent design and user experience.
  2. **`config/`**
   Stores constants used throughout the application. This includes values that are global to the app.
   **Note**: Environment variables (`.env`) are located outside this directory.

  3. **`pages/`**
   Contains the main pages or views of the app, representing complete sections of the app.
   - Each page component aggregates multiple child components to form a complete view.

  4. **`services/`**
   - Contains business logic and services responsible for interacting with the backend (API calls, fetching data, processing business logic).
   Services are abstracted from the UI components and are used to handle core functionality.

  5. **`types/`**
   - Contains TypeScript type definitions for the application.
   This helps enforce strong typing and ensures that data structures used across the app (like orders, fragrances, etc.) are consistent and correctly typed.

  6. **`App.tsx`**
   - The main component of the React app that defines the overall structure and layout.
   - It is the root component that connects all the components together and typically includes routing (if applicable).

  7. **`index.tsx`**
   - The entry point for the React app where the root component (`App.tsx`) is rendered into the DOM. 
   This file is responsible for initializing the React application.

  8. **`.env`**
   - Stores environment variables used throughout the application.
   It contains sensitive data such as API keys, database URLs, or other environment-specific settings (e.g., production or development configurations).

  9. **`package.json`**
   - Manages the project’s dependencies and scripts.
   This file defines the scripts for building, testing, and running the app, as well as the dependencies required for the project to run.

- **`public/`**: Contains static files, like `index.html`, which serves as the entry point for the application.


## Design Considerations & Out-of-Scope Decisions


### Inventory Management

Although each fragrance includes a `stock_quantity` field, full inventory management was intentionally not implemented.

The exercise explicitly states that Inventory Management is out of scope, therefore:
- No stock decrement is performed when creating an order.
- No database-level locking or transactional reservation logic was introduced.
- Only backend and frontend validation is performed to ensure requested quantities do not exceed available stock.

In a production system, stock updates would be handled within a database transaction using row-level locking to prevent race conditions.


### Concurrency Considerations

Since inventory management is out of scope, full race-condition handling was not implemented.

In a real-world system managing physical inventory, the following approach would be used:
- Wrap stock check and update in a database transaction.
- Apply row-level locking.
- Ensure atomic stock decrement.

The current implementation focuses on requirement alignment and clean architecture rather than full ERP-level inventory control.


### Multi-Company / Multi-Tenant Support

The current implementation assumes a single company context.

If multi-company support were required, the system could be extended by:

- Introducing a `companies` table.
- Associating `fragrances` with a `company_id` (via foreign key or many-to-many relation).
- Scoping all queries by `company_id`, derived from the Monday context.

This was not implemented as it was not part of the exercise requirements.


### Configuration Duplication (Client & Server)

The maximum number of fragrances per kit is defined in both client and server configuration files.

In a production system, this value would be managed centrally and exposed via configuration endpoint.
For the purpose of this assignment, it is duplicated intentionally to keep the architecture simple.

### CORS and Authorization

CORS is enabled to control which domains are allowed to make requests to our backend API. This is crucial for security reasons, as it prevents unauthorized websites or malicious actors from interacting with our API. 

- **During development**, we allow specific domains (e.g., `http://localhost:8301`) to send requests to the backend.
- **In production**, only trusted origins should be allowed to interact with the API, ensuring that no unauthorized sources can make requests.

The list of authorized origins is stored in environment variables (`ALLOWED_CLIENT_URLS`) and can be easily updated as needed. This ensures flexibility and security across different environments.

### Authorization Layer (via Monday.com Iframe)

The Authorization Layer is implemented to identify the user interacting with the app. It is used exclusively when the app is running within the Monday.com Iframe, allowing us to fetch the user context(such as `createdBy`) for each operation.
- This layer helps identify the user performing certain actions (like creating or updating an order), allowing us to track who made the change and associate the action with the correct user.


### Fragrance Catalog

Adding a fragrance catalog that displays fragrance images, prices, and additional details would be a very useful feature. However, it was initially considered out of scope due to time constraints.

Reason for Change: Given its importance for the designer to understand the fragrances better and have easy access to the information, it seems like a valuable feature to implement now.

## Testing Strategy

The tests cover both the backend logic (services) and frontend components to ensure that all parts of the application are tested, providing high confidence in the system’s reliability.
The application focuses on unit testing the core business logic in the Service layer. This approach ensures that the logic is tested in isolation, making the tests more efficient and reliable.

- **Server - Service Tests**: Located in `tests/server/service/`, these tests verify the functionality of core services (e.g., `fragrance-service`, `order-service`). Dependencies are mocked to focus on the logic, avoiding the need for an actual database or external systems.

- **Server - Controller Tests**: Not included, as the controllers primarily handle HTTP requests and route them to services. The service layer is thoroughly tested, making controller tests unnecessary for this project.

- **Client Tests**: 
  - Located in `tests/client/`, these tests ensure that the frontend components behave as expected when interacting with the user. 
  The tests focus on rendering components, handling user input, and integrating with the backend correctly.

- **No End-to-End (E2E) Tests**: E2E tests were not implemented as the focus is on isolated unit testing of services. These tests would typically require more resources and are not needed given the scope of the application.

---



## Installation, Running and Testing

Follow these steps to set up and run the application locally, or through Monday.com's Iframe. This process includes installing dependencies, configuring the database, creating the necessary Monday.com resources, and updating environment variables.

### Prerequisites
1. Node.js v18+
2. PostgreSQL 14+
3. A monday.com developer account

### Clone the repository
Start by cloning the repository to your local machine.

### Install Dependencies
Navigate to the project directory (main folder and also client) and install the dependencies:
```
cd <project_directory>
npm install

cd <client project_directory>
npm install
```

### Configure the database
#### 1. Install PostgreSQL
Make sure PostgreSQL (v14+) is installed and running.

#### 2. Create the database
Create the database by running the following SQL query:
```
psql -U postgres -W
CREATE DATABASE monday_candles;
\q
```

#### 3. Update and run init & seed scripts:
In your `package.json`, you'll find the following script templates:

- **`db:init`**: Initializes the database and creates the necessary tables.
- **`db:seed`**: Seeds the database with initial data for testing or demonstration purposes.

Before running the scripts, make sure to replace the placeholder `<your_user>` with your PostgreSQL username (e.g., `postgres`).

Example:
"db:init": "psql -h localhost -U postgres -W -d monday_candles -f database/schema.sql"

##### 4. Initialize schema
`npm run db:init`

Expected output:
- CREATE TABLE
- CREATE EXTENSION
- etc.


##### 5. Seed initial data
`npm run db:seed`

Expected output:
INSERT 0 3

#### 6. Verify installation (optional)
`psql -h localhost -U <your_user> -d monday_candles`

Then run:
`SELECT name, stock_quantity, is_active FROM fragrances;`

You should see 3 rows.



### Create Monday Board

In order to test the order creation flow, please create a board in Monday with the following configuration.
- Boared Name: Production Orders
- Board Groups: New Requests, Working On It, Done
- Columns and types:
  First Name (TEXT)
  Last Name (TEXT)
  Kits (Numbers)
  Fragrances (TEXT)
  Created By (Person)

  Status (TEXT)
  Created At (Date)
  Asignee (Person)
  Completion Time (Date)

**Important** - Column IDs are not hardcoded in this implementation. Instead, the application dynamically retrieves board columns and matches them by title.
This ensures flexibility and prevents tight coupling to specific board configurations.
As a result, column titles must match exactly (case sensitive), as the application dynamically resolves column IDs by title.

#### Retrieve Board and Group IDs
After creating the board:
1. Open the board in your browser
2. Update the .env file with the MONDAY_BOARD_ID: The Board ID is the number found in the URL of your Monday.com board: 
https://your-domain.monday.com/boards/{BOARD_ID}
3. Retrieve the Group ID using the Monday GraphQL Playground:
{
  boards(ids: YOUR_BOARD_ID) {
    groups {
      id
      title
    }
  }
}

Use the group ID corresponding to the group where new items should be created (e.g., "New Requests").



### Create Monday app 
In addition to the board, you need to create an app in your Monday.com account to get your API token and signing secret.
1. Go to Monday.com Developer Section and create a new app for your project.
2. Obtain the API Token and Signing Secret from the app settings.

### Add Monday Application to Monday board view
After creating the app and the board, you need to add a view to the board so that the app (i.e., the form you developed) can be displayed. To do this, click on Add View and then select the app you created. 

### Update Environment variables (.env files)
The application can be run locally or through Monday's Iframe development tunnel.

The application requires two .env files for proper configuration: one for the server and one for the client.

#### 1. **Server `.env` Configuration**:
The `.env` file should be created in the `src` directory for the server. 
This file contains configuration for your server and database, as well as Monday.com integration settings.

The file should contain the following keys: 
```
PORT=<your_app_port, (e.g - 8080)>
BROWSER=none
MONDAY_SIGNING_SECRET=<your Monday.com signing secret used to authenticate API requests from your app.>
MONDAY_API_TOKEN=<your Monday.com API token used for authenticating API requests from your application>
MONDAY_BOARD_ID=<explenation below, under Monday Board Setup>
MONDAY_GROUP_ID=<explenation below, under Monday Board Setup. The Group ID within a specific board on Monday.com. This ID identifies the group within a board where the order will be initially stored>

DB_HOST=<the host address of your PostgreSQL database (e.g., `localhost`)>
DB_PORT=<the port number used by PostgreSQL (default is `5432`)>
DB_NAME=monday_candles
DB_USER=<the PostgreSQL username that connects to your database (e.g., `postgres`)>
DB_PASSWORD=<the password for the PostgreSQL user used to connect to the database>

ALLOWED_CLIENT_URLS=<a comma-separated list of allowed client URLs for CORS. This defines which domains can interact with your API (e.g., http://localhost:8301).>
```

#### 2. **Client `.env` Configuration**:
The `.env` file should be created in the `client` directory for the client. 
This file contains configuration for your server and database, as well as Monday.com integration settings.

The file should contains the following keys:

```
PORT=<your_app_port(e.g - 8301)>
BROWSER=none
REACT_APP_API_BASE_URL=<the base URL of your backend API. For local development, this points to the local server. Update this URL for production or other environments.(e.g - http://localhost:8080)>
```

### Running the Application

#### Run locally
##### Start Server
Open the terminal and run the following: 
```
npm run dev-server
```

##### Start Client
Open the terminal, nevigate to the client folder and run the following: 
```
npm run dev
```

#### Run via Monday Iframe 
When you run the Server locally, it automatically creates a tunnel that connects your local API to Monday.com. This tunnel routes all requests from Monday.com to your local server.

To use the Iframe integration:

1. Run the Server: When you start the server locally, a tunnel is automatically created.
2. Copy the Tunnel URL: You will need to copy the tunnel URL (provided by the system) and configure it for your feature in Monday.com.
3. Connect the Iframe: When creating a new feature or app in Monday.com, link it to the tunnel URL. This allows your local server to communicate with the Monday API via the tunnel.

By using the tunnel, your application is able to interact with Monday.com as if it were running in their environment, without needing to configure complex network settings.

### RUN TESTING
In order to run the client & server tests run the following:
```
npm test
```