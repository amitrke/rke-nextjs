# Data Models

This document outlines the data structures used in the Firestore database.

## `events` Collection

The `events` collection stores information about holidays and other time-based events.

Each document in the `events` collection represents a single event and has the following fields:

| Field | Type | Description |
| :--- | :--- | :--- |
| `type` | String | The type of event (e.g., "holiday", "community-event"). |
| `name` | String | The name of the event (e.g., "Diwali", "Farmer's Market"). |
| `description` | String | A detailed description of the event. |
| `date` | String | The date of the event in ISO format (e.g., "2025-10-20"). |
| `holidayTypes`| Array of Strings | For holidays, the type(s) of holiday (e.g., ["National holiday"]). |
| `locations` | String | Information about where the event is held or observed. |
| `states` | String or Array | For holidays, the states where it is observed. Can be "All" or a list of states. |
| `url` | String | A canonical URL with more details about the event. |
| `expireAt` | Timestamp | A Firestore timestamp used for a TTL (Time To Live) policy to automatically delete old documents. |

The **document ID** is a unique string, typically generated from the event's date and a URL-friendly version of its name (e.g., `2025-10-20-diwali`).
