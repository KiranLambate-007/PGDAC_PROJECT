🚌 PMPML Bus Online Ticket Booking System

An end-to-end online bus ticket booking system built using 
React.js for the frontend, 
.NET 8 Web API for the backend, and 
SQL Server for the database. 
It includes user registration, route search, seat selection, payment (Razorpay test integration), and ticket generation.

---

## Features

-  User Registration & Login (with Aadhar validation)
-  Route and Bus Search
-  Seat Selection with real-time updates
-  Razorpay Payment Integration (Test Mode)
-  Ticket Confirmation & History
-  Admin Panel for managing Routes, Buses & Users
-  Dashboard with Statistics
-  Docker Support for deployment

---

 Tech Stack

| Layer      | Technology         |
|-----------|--------------------|
| Frontend  | React.js, Tailwind CSS, Lucide Icons |
| Backend   | .NET 8 Web API (C#) |
| Database  | SQL Server          |
| Payment   | Razorpay (Test API) |
| Auth      | Custom (email + Aadhar + password) |
| DevOps    | Git, Docker (optional) |


## Project Setup

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download)
- [Node.js](https://nodejs.org/) (v18+)
- [SQL Server](https://www.microsoft.com/en-us/sql-server)
- Razorpay Test Keys (for test payments)
- Docker (optional, for containerization)

---

##  Frontend Setup (React.js)

```bash
cd frontend
npm install
npm start
```

- Located in `/frontend`
- Uses `BookingContext` for managing global state
- Make sure backend API is running on `http://localhost:5000` or configure `.env`

---

## Backend Setup (.NET 8)

```bash
cd BookingBackend
dotnet restore
dotnet ef database update   # Run migrations
dotnet run
```

- Located in `/BookingBackend`
- Configure your `appsettings.json` with SQL Server connection string
- Controllers: `UserController`, `BusRouteAssignmentController`, `BookingController`, `PaymentController`, etc.

---

##  Database Setup

- Use the provided `database.sql` or Entity Framework migrations
- Tables: `Users`, `Routes`, `Buses`, `Tickets`, `Payments`, `Feedbacks`

---

##  Razorpay Integration (Test Mode)

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Generate **Test API Keys**
3. Add to your `.env` (Frontend) and `appsettings.json` (Backend):

```env
# frontend/.env
REACT_APP_RAZORPAY_KEY=rzp_test_YourKey
```

```json
// backend/appsettings.json
"Razorpay": {
  "Key": "rzp_test_YourKey",
  "Secret": "YourSecret"
}
```

---

## Docker Setup (Optional)

```bash
docker-compose up --build
```

- Define services for `frontend`, `backend`, and `db` in `docker-compose.yml`
- Maps ports:
  - Frontend: `3000`
  - Backend API: `5000`
  - SQL Server: `1433`

---

##  Folder Structure

```
📁 PMPML-Ticket-Booking/
├── frontend/                # React App
│   ├── components/
│   ├── contexts/
│   └── pages/
├── BookingBackend/         # .NET 8 Backend
│   ├── Controllers/
│   ├── Models/
│   ├── Data/
│   └── Services/
├── database.sql             # (Optional) Manual DB Setup
├── docker-compose.yml       # Docker setup
└── README.md
```

---

## 🛡️ Admin Panel

- Navigate to `/admin`
- Add/manage routes, buses, users
- View dashboard stats: bookings, revenue, feedbacks

---

##  Booking Flow

1. Route Search 
2. Bus Selection
3. Seat Selection
4. Payment (Razorpay)
5. Ticket Confirmation

---

##  To-Do (Enhancements)

- [ ] Live Bus Tracking (GPS Integration)
- [ ] SMS/Email Ticket Notifications
- [ ] Cancel Booking Feature
- [ ] Role-based Authorization (Admin/User)

---

##  Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit and push
4. Open a Pull Request 

---

