import React from "react";
import ReactDOM from "react-dom";
import {
   BrowserRouter as Router,
   Routes,
   Route,
   Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Bridge from "./pages/Bridge";
import Stake from "./pages/Stake";
import UserPosition from "./pages/UserPosition";
import Footer from "./components/Footer";

function App() {
   return (
      <Router>
         <Navbar />
         <Routes>
            <Route path="" element={<Navigate replace to="/bridge" />} />
            <Route path="/bridge" element={<Bridge />} />
            <Route path="/stake" element={<Stake />} />
            <Route path="/user" element={<UserPosition />} />
         </Routes>
         <Footer />
      </Router>
   );
}

ReactDOM.render(<App />, document.getElementById("root"));
