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
import ApartmentAdding from './Pages/ApartmentAdding/ApartmentAdding';
import Booking from './Pages/Booking/Booking/Booking';


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

            <Route path="/addApartment">
              <ApartmentAdding></ApartmentAdding>
            </Route>

            <Route path="/booking/:houseId">
              <Booking></Booking>
            </Route>

            <Route path="*">
              <NotFound></NotFound>
            </Route>


            {/*<PrivateRoute path="/myPackages">
              <MyPackages></MyPackages>
            </PrivateRoute>
            
            <PrivateRoute path="/managePackages">
            <PackageManaging></PackageManaging>
          </PrivateRoute> */}

          </Switch>

          <Footer></Footer>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
