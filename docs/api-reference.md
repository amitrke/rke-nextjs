# API Reference

This document provides a reference for the API routes in the Roorkee.org Next.js application.

## API Routes

The API routes are located in the `pages/api` directory.

### `/api/fetchCount`

-   **Method**: `GET`
-   **Description**: Fetches the current value of the counter from the Firebase Realtime Database.
-   **Returns**: A JSON object with the current count.
    ```json
    {
      "count": 10
    }
    ```

### `/api/incrementCount`

-   **Method**: `POST`
-   **Description**: Increments the counter in the Firebase Realtime Database.
-   **Returns**: A JSON object with a success message.
    ```json
    {
      "message": "Counter incremented successfully"
    }
    ```

### `/api/hello`

-   **Method**: `GET`
-   **Description**: A sample API route that returns a "Hello, world!" message.
-   **Returns**: A JSON object with a message.
    ```json
    {
      "name": "John Doe"
    }
    ```
