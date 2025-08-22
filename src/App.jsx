import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicLayout from "./components/layout/PublicLayout/PublicLayout";
import DashboardLayout from "./components/layout/DashboardLayout/DashboardLayout";
import "./App.css";
import PrivateRoute from "./Pages/auth/PrivateRoute/PrivateRoute";
import AuthProvider from "./contexts/AuthProvider";

// Public pages
import Home from "./Pages/Home/Home/Home";
import Apartments from "./Pages/Apartments/Apartments/Apartments";
import Login from "./Pages/auth/Login/Login";
import Register from "./Pages/auth/Register/Register";
import Booking from "./Pages/Booking/Booking/Booking";
import NotFound from "./Pages/NotFound/NotFound";

// Dashboard pages
import Dashboard from "./Pages/Dashboard/Dashboard/Dashboard";
import BookingForm from "./Pages/Booking/Booking/BookingForm";
import ApartmentAdding from "./Pages/Dashboard/ApartmentAdding/ApartmentAdding";
import ApartmentManaging from "./Pages/Dashboard/ApartmentManaging/ApartmentManaging";
import MakeAdmin from "./Pages/Dashboard/MakeAdmin/MakeAdmin";
import ManageAllBookings from "./Pages/Dashboard/ManageAllBookings/ManageAllBookings";
import ReviewAdding from "./Pages/Dashboard/ReviewAdding/ReviewAdding";
import MyApartments from "./Pages/Dashboard/MyApartments/MyApartments";
import Payment from "./Pages/Dashboard/Payment/Payment";

function App() {
    return (
        <div className="App">
            <AuthProvider>
                <Router>
                    <Routes>
                        {/* Public layout */}
                        <Route element={<PublicLayout />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/home" element={<Home />} />
                            <Route path="/apartments" element={<Apartments />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/booking/:houseId" element={<Booking />} />
                            <Route path="*" element={<NotFound />} />
                        </Route>

                        {/* Dashboard layout (protected) */}
                        <Route
                            element={
                                <PrivateRoute>
                                    <DashboardLayout />
                                </PrivateRoute>
                            }
                        >
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/booking/:houseId/bookingForm" element={<BookingForm />} />
                            <Route path="/bookings" element={<MyApartments />} />
                            <Route path="/reviewAdding" element={<ReviewAdding />} />
                            <Route path="/payment" element={<Payment />} />
                            <Route path="/manageAllBookings" element={<ManageAllBookings />} />
                            <Route path="/manageApartments" element={<ApartmentManaging />} />
                            <Route path="/addApartment" element={<ApartmentAdding />} />
                            <Route path="/makeAdmin" element={<MakeAdmin />} />
                        </Route>
                    </Routes>
                </Router>
            </AuthProvider>
        </div>
    );
}

export default App;
