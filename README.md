# 🚗 Car Rental — React Frontend (Vite)

Responsive React frontend for the Car Rental backend system. Built with **Vite** for fast development and optimized builds.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Build Tool | Vite 5 |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Styling | Bootstrap 5 + Bootstrap Icons |

---

## 📁 Project Structure

```
src/
├── context/
│   └── AuthContext.jsx       # Global auth state, login/logout
├── services/
│   └── api.js                # Axios instance + all API calls
├── components/
│   ├── Navbar.jsx            # Responsive navbar with role-based links
│   └── ProtectedRoute.jsx    # PrivateRoute and AdminRoute guards
└── pages/
    ├── Home.jsx              # Landing page
    ├── Login.jsx             # Login form
    ├── Register.jsx          # Register form
    ├── Vehicles.jsx          # Browse + filter + book vehicles
    ├── MyBookings.jsx        # Booking history + cancel
    └── AdminPanel.jsx        # Manage vehicles & all bookings
```

---

## ⚙️ Setup & Run

### Prerequisites
- Node.js 18+
- Car Rental Spring Boot backend running on `http://localhost:8080`

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Suyash1608/car-rental-frontend.git
   cd car-rental-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the dev server**
   ```bash
   npm run dev
   ```

   Opens at: `http://localhost:3000`

4. **Build for production**
   ```bash
   npm run build
   ```

> The Vite dev server proxies `/api` requests to `http://localhost:8080` automatically — no CORS issues during development.

---

## 🔐 Roles & Pages

| Page | Guest | USER | ADMIN |
|------|-------|------|-------|
| Home | ✅ | ✅ | ✅ |
| Browse Cars | ✅ | ✅ | ✅ |
| Book a Car | Redirect to login | ✅ | ✅ |
| My Bookings | ❌ | ✅ | ✅ |
| Admin Panel | ❌ | ❌ | ✅ |

---

## ✅ Features

- Vite-powered — instant HMR, fast builds
- JWT auto-attached to all requests via Axios interceptor
- Route guards for authenticated and admin-only pages
- Category filter for vehicles (ALL / SEDAN / SUV / HATCHBACK / LUXURY)
- Live total price preview while selecting booking dates
- Inline error messages from backend
- Admin panel — add/delete vehicles, view all bookings, mark complete
- Fully responsive — mobile and desktop

---

## 👤 Author

**Suyash Gupta** — Full Stack Developer  
[LinkedIn](https://linkedin.com/in/suyash-16d08m/) | [GitHub](https://github.com/Suyash1608)
