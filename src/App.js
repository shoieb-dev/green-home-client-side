import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AuthProvider from './contexts/AuthProvider';
import Header from './Pages/Shared/Header/Header';
import Home from './Pages/Home/Home/Home';
import Login from './Pages/Login/Login/Login';
import Footer from './Pages/Shared/Footer/Footer';
import NotFound from './Pages/NotFound/NotFound';
import Apartments from './Pages/Apartments/Apartments/Apartments';
import ApartmentAdding from './Pages/Dashboard/ApartmentAdding/ApartmentAdding';
import Booking from './Pages/Booking/Booking/Booking';
import PrivateRoute from './Pages/Login/PrivateRoute/PrivateRoute';
import Register from './Pages/Login/Register/Register';
import ApartmentManaging from './Pages/Dashboard/ApartmentManaging/ApartmentManaging';
import MyApartments from './Pages/MyApartments/MyApartments';
import Payment from './Pages/Payment/Payment';
import MakeAdmin from './Pages/Dashboard/MakeAdmin/MakeAdmin';
import ManageAllBookings from './Pages/Dashboard/ManageAllBookings/ManageAllBookings';
import Reviews from './Pages/Home/Review/Reviews/Reviews';
import ReviewAdding from './Pages/Home/Review/ReviewAdding/ReviewAdding';


function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Header></Header>

          <Switch>
            <Route exact path="/">
              <Home></Home>
            </Route>

            <Route path="/home">
              <Home></Home>
            </Route>

            <Route path="/apartments">
              <Apartments></Apartments>
            </Route>

            <Route path="/login">
              <Login></Login>
            </Route>

            <Route path="/register">
              <Register></Register>
            </Route>

            <PrivateRoute path="/booking/:houseId">
              <Booking></Booking>
            </PrivateRoute>

            <PrivateRoute path="/myApartments">
              <MyApartments></MyApartments>
            </PrivateRoute>

            <PrivateRoute path="/reviewAdding">
              <ReviewAdding></ReviewAdding>
            </PrivateRoute>

            <PrivateRoute path="/payment">
              <Payment></Payment>
            </PrivateRoute>

            <PrivateRoute path="/makeAdmin">
              <MakeAdmin></MakeAdmin>
            </PrivateRoute>

            <PrivateRoute path="/addApartment">
              <ApartmentAdding></ApartmentAdding>
            </PrivateRoute>

            <PrivateRoute path="/manageApartments">
              <ApartmentManaging></ApartmentManaging>
            </PrivateRoute>

            <PrivateRoute path="/manageAllBookings">
              <ManageAllBookings></ManageAllBookings>
            </PrivateRoute>

            <Route path="*">
              <NotFound></NotFound>
            </Route>

          </Switch>

          <Footer></Footer>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
