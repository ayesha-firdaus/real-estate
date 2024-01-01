import {BrowserRouter,Routes,Route} from "react-router-dom";
import About from "./pages/About";
import Signin from "./pages/Signin";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
function App() {

  return (
    <BrowserRouter>
    <Header />
     <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign-in" element={<Signin />} />
      <Route element={<PrivateRoute />}>
      <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="/sign-up" element={<Signup />} />
  
      <Route path="/about" element={<About />} />


     </Routes>
    </BrowserRouter>
  )
}

export default App
