import "bootstrap/dist/css/bootstrap.min.css";
import "react-tooltip/dist/react-tooltip.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicLayout from "./components/layout/PublicLayout/PublicLayout";
import DashboardLayout from "./components/layout/DashboardLayout/DashboardLayout";
import "./App.css";
import PrivateRoute from "./Pages/auth/PrivateRoute/PrivateRoute";
import AuthProvider from "./contexts/AuthProvider";
import { SidebarProvider } from "./contexts/SidebarContext";

// Public pages
import Home from "./Pages/Home/Home/Home";
import Apartments from "./Pages/Apartments/Apartments/Apartments";
import Login from "./Pages/auth/Login/Login";
import Register from "./Pages/auth/Register/Register";
import Booking from "./Pages/Booking/Booking";
import NotFound from "./Pages/NotFound/NotFound";
import { Toaster } from "react-hot-toast";

// Dashboard pages
import Dashboard from "./Pages/Dashboard/Dashboard/Dashboard";
import BookingForm from "./Pages/Booking/BookingForm";
import AddApartment from "./Pages/Dashboard/AddApartment/AddApartment";
import ManageApartments from "./Pages/Dashboard/ManageApartments/ManageApartments";
import MakeAdmin from "./Pages/Dashboard/MakeAdmin/MakeAdmin";
import ManageAllBookings from "./Pages/Dashboard/ManageAllBookings/ManageAllBookings";
import ReviewAdding from "./Pages/Dashboard/ReviewAdding/ReviewAdding";
import MyApartments from "./Pages/Dashboard/MyApartments/MyApartments";
import Payment from "./Pages/Dashboard/Payment/Payment";

function App() {
    return (
        <div className="App">
            <SidebarProvider>
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
                                <Route path="/manageApartments" element={<ManageApartments />} />
                                <Route path="/apartment-form/:mode/:id" element={<AddApartment />} />
                                <Route path="/makeAdmin" element={<MakeAdmin />} />
                            </Route>
                        </Routes>
                    </Router>
                    <Toaster position="top-right" reverseOrder={false} />
                </AuthProvider>
            </SidebarProvider>
        </div>
    );
}

export default App;
