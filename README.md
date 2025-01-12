# Inventory Dashboard

This project is a dashboard application built using React, Redux Toolkit, and Express. The application visualizes inventory data provided in sample-data.csv and allows users to filter and analyze the data.

## Features Dashboard Components:

 Displays the most recently gathered inventory data. Inventory Count: Categorized and filtered by: NEW vehicles USED vehicles CPO (Certified Pre-Owned) vehicles Average MSRP (USD): Filtered by vehicle condition (NEW, USED, CPO). History Log: Displays all inventory data, including: Count Total MSRP Average MSRP for NEW, USED, and CPO vehicles.

Filter data by: Vehicle Make Duration (e.g., Last month, This month, Last 3 months, etc.). API Endpoint:

/api/inventory: Serves data from sample-data.csv and supports filtering by parameters such as vehicle make and duration. 

Dynamic filtering updates Inventory Count, Average MSRP, and History Log. Tools and Technologies

## Frontend:
 
React Redux Toolkit Tailwind CSS (for styling)

## Backend:
 
Express.ts

## Data Handling:

CSV-to-JSON conversion for loading sample-data.csv. Development Tools:

## Steps Clone the repository:

Clone the repository:


```bash
git clone https://github.com/navneethvi/Inventory-Management.git
```

Install dependencies:

```bash
npm install
```

Start the development servers:

Frontend: 

```bash
cd frontend
npm run dev
```

Backend: 

```bash
cd backend
npm start
```

## Access the application at the following URL:

[https://inventory-frontend-wheat.vercel.app/]
