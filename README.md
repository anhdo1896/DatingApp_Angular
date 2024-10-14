# Get started 

This project using Angular and ASP.NET Core allows users to register, update their profiles, upload images, like other users, and send messages.

## Technology Stack
- `Front-End`: Angular
- `Back-End`: ASP.NET Core
- `Database`: SQLite (relational DB)
- `Image Hosting`: Cloudinary
- `Deployment`:
    - `Front-End`: Amazon S3
    - `Back-End`: Azure App Service


## Available script

After clone this project, in the DatingApp-SPA project directory, you can run:

### `npm install`

Install the necessary dependences.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:4200](http://localhost:4200) to view it in the browser.

The page will reload if you make edits.

### `npm run build`

Builds the app for production to the `build` folder (dist).\
It correctly bundles Angular in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

## Project Structure

## Frontend

The application will consist of a single root module. In addition, it contains some components.

 ### Components:

- `Home Component`: Contains logic for login.
- `Register Component`: Manages the user registration process.
- `Members Components`: Displaying potential friends and other core actions. Handles CRUD operations for users, allowing them to update profiles, like someone, and edit profile photos.
- `Messages Component`: Allows users to view and send messages.

### Supporting Files/Folders:
- `Services` Contains business logic for handling API requests.
- `Resolvers`: Pre-fetches necessary data before rendering the component view.
- `Models`: Data models to structure API requests and responses.
- `Guards`: Auth guards to protect routes that require user authentication 
    - `CanActivate` : The CanActivate guard is used to prevent users from navigating to a route unless a condition is met. Apply for routing after/before authenticating.
    - `CanDeactivate`: The CanDeactivate guard is used to prevent users from accidentally navigating away from a route when they have unsaved changes in their profiles.

###  Additional Techniques:
- `Reactive Forms`: Used for managing complex forms such as registration and profile updates.
- `HTTP Interceptors`: Handles HTTP errors globally and provides a unified error-handling strategy.

## Backend
The back-end solution will be structured based on the SOLID design principles and organized into the following:

- `Models`: Represent the database tables (e.g., Users, Messages, Likes).
- `Data`: Handle database operations, ensuring separation of concerns between the data layer and the business logic.
- `Controllers`: Expose API endpoints for the front-end to interact with (e.g., UserController, AuthController, MessageController).
- `Helpers:` Contains utility classes for tasks like `AutoMapper`, `Cloudinary Settings`, `Pagination`.
 - `Configuration Files`: Contains settings for database connections, third-party services (Cloudinary), and authentication keys.
- `Program.cs & Startup.cs`: Configures middleware, services, and routing.

## Tools

- `IDE`: Visual Studio (for .NET Core development) and Visual Studio Code (for Angular development).
Testing:
- `Postman`: manual testing and writing scripts to automate testing of API endpoints.
- `Swagger`: Integrated API documentation and testing tool.

## Learn More

You access the demo [Dating App](http://anhdo-16092024.s3-website-us-east-1.amazonaws.com).

To learn API, check out the [Dating App API](https://datingappapi.azurewebsites.net/swagger/index.html).













