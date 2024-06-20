# VirtualStockMarket
Create a virtual stock trading game where users can simulate buying and selling stocks with virtual currency. User account management and transaction history needs to be maintained for every user. Integrate the  Finance API to ensure accurate and real-time stock prices for a realistic trading experience.

 **Note:** We opted to use live cryptocurrency data instead of stock data due to the unavailability of free real-time stock data APIs on the internet.

## Table of Contents

- Introduction
- Features
- Technology Stack
- Setup and Installation
- Usage
- Directory Structure

## Introduction

The Virtual Stock Market application provides a platform for users to engage in simulated trading. Users can buy and sell cryptocurrency assets, track their portfolio, and view market trends.

## Features

- User authentication and profile management
- Real-time cryptocurrency data
- Portfolio management
- Transaction history
- Market trends and analysis

## Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB

### Other
- Cryptocurrency API (e.g., CoinGecko)

## Setup and Installation

### Prerequisites

- Node.js and npm installed
- MongoDB installed and running

### Backend Setup

1. Navigate to the Backend directory:
    ```bash
    cd Backend
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file and configure the environment variables:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

4. Start the backend server:
    ```bash
    npm start
    ```

## Usage

- Open your web browser and go to `http://localhost:5000`.
- Register a new account or log in with an existing account.
- Start trading cryptocurrency assets and manage your portfolio.

## Directory Structure

VirtualStockMarket-Team-02-master/
- ├── Backend/
- │ ├── controllers/
- │ ├── models/
- │ ├── routes/
- │ ├── utils/
- │ ├── .env.example
- │ ├── server.js
- │ └── package.json
- ├── Frontend/
- │ ├── src/
- │ │ ├── components/
- │ │ ├── pages/
- │ │ ├── redux/
- │ │ ├── App.js
- │ │ └── index.js
- │ ├── public/
- │ ├── .env.example
- │ └── package.json
- ├── Testing/
- ├── .gitignore
-── README.md
- └── package.json

