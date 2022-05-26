# Setup

Make sure you have the latest version of Node.js and npm installed

Run the following command to install necessary modules:

`npm install`

# Run

Run the following command to start the app server:

`npm start`

# About

This is a simple REST API server that will perform CRU(D) operations based on assignment specifications.

This API is built using Node.js, and interacts with data in a Postgres database.

This API supports the following CRU(D) operations:

    Create a loan with the following properties as input:
        Amount
        Interest rate
        Length of loan in months
        Monthly payment amount
    Get the created loan, by an identifier
    Update the created loan, by an identifier

Out of scope: Delete, Authentication, Authorization

# How to use 

Endpoints expecting data in addition to the :loan_id parameter will be expecting JSON in the request body. Expected JSON format is:

```json
{
    "amount": 1000,
    "interest_rate": 4.8,
    "months": 40,
    "payment": 1500.00
}
```

## API endpoints

### GET 
GET `/v1/loan/:loan_id`
where `:loan_id` is a 16-digit hexadecimal value

### POST 
POST `/v1/loan`

### PUT 
PUT `/v1/loan/:loan_id`
where `:loan_id` is a 16-digit hexadecimal value
