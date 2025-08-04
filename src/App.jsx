import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/layout/Footer/Footer";
import Header from "./components/layout/Header/Header";
import AuthProvider from "./contexts/AuthProvider";
import Apartments from "./Pages/Apartments/Apartments/Apartments";
import Login from "./Pages/auth/Login/Login";
import PrivateRoute from "./Pages/auth/PrivateRoute/PrivateRoute";
import Register from "./Pages/auth/Register/Register";
import Booking from "./Pages/Booking/Booking/Booking";
import BookingForm from "./Pages/Booking/Booking/BookingForm";
import ApartmentAdding from "./Pages/Dashboard/ApartmentAdding/ApartmentAdding";
import ApartmentManaging from "./Pages/Dashboard/ApartmentManaging/ApartmentManaging";
import MakeAdmin from "./Pages/Dashboard/MakeAdmin/MakeAdmin";
import ManageAllBookings from "./Pages/Dashboard/ManageAllBookings/ManageAllBookings";
import Home from "./Pages/Home/Home/Home";
import ReviewAdding from "./Pages/Home/Review/ReviewAdding/ReviewAdding";
import MyApartments from "./Pages/MyApartments/MyApartments";
import NotFound from "./Pages/NotFound/NotFound";
import Payment from "./Pages/Payment/Payment";

function App() {
    return (
        <div className="App">
            <AuthProvider>
                <Router>
                    <Header />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/apartments" element={<Apartments />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/booking/:houseId" element={<Booking />} />
                        <Route
                            path="/booking/:houseId/bookingForm"
                            element={
                                <PrivateRoute>
                                    <BookingForm />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/bookings"
                            element={
                                <PrivateRoute>
                                    <MyApartments />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/reviewAdding"
                            element={
                                <PrivateRoute>
                                    <ReviewAdding />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/payment"
                            element={
                                <PrivateRoute>
                                    <Payment />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/makeAdmin"
                            element={
                                <PrivateRoute>
                                    <MakeAdmin />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/addApartment"
                            element={
                                <PrivateRoute>
                                    <ApartmentAdding />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/manageApartments"
                            element={
                                <PrivateRoute>
                                    <ApartmentManaging />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/manageAllBookings"
                            element={
                                <PrivateRoute>
                                    <ManageAllBookings />
                                </PrivateRoute>
                            }
                        />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                    <Footer />
                </Router>
            </AuthProvider>
        </div>
    );
}

export default App;
