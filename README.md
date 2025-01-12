#Full-Stack Web Developer - Technical Exam

#Project Overview
This project is a dashboard application built using React, Redux Toolkit, and Express. The application visualizes inventory data provided in sample-data.csv and allows users to filter and analyze the data.

Features
Dashboard Components:

Recent Data: Displays the most recently gathered inventory data.
Inventory Count: Categorized and filtered by:
NEW vehicles
USED vehicles
CPO (Certified Pre-Owned) vehicles
Average MSRP (USD): Filtered by vehicle condition (NEW, USED, CPO).
History Log: Displays all inventory data, including:
Count
Total MSRP
Average MSRP for NEW, USED, and CPO vehicles.
Filters:

Filter data by:
Vehicle Make
Duration (e.g., Last month, This month, Last 3 months, etc.).
API Endpoint:

/api/inventory: Serves data from sample-data.csv and supports filtering by parameters such as vehicle make and duration.
Data Visualization:

Dynamic filtering updates Inventory Count, Average MSRP, and History Log.
Tools and Technologies
Frontend:

React
Redux Toolkit
Tailwind CSS (for styling)
Backend:

Express.js
Data Handling:

CSV-to-JSON conversion for loading sample-data.csv.
Development Tools:

Steps
Clone the repository:

Install dependencies:

npm install  

Start the development servers:

Frontend:

cd frontend
npm run dev

Backend:

cd backend  
npm start  

Access the application:
Open http://localhost:5173 in your browser for the frontend and http://localhost:3000/api/inventory for the API endpoint.

API Documentation
Endpoint
GET /api/inventory


Time Taken
Total Time Spent: 7 hours and 30 minutes.

