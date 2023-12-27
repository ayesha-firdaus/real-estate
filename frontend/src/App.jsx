import {BrowserRouter,Routes,Route} from "react-router-dom";
import About from "./pages/About";
import Signin from "./pages/Signin";
import Profile from "./pages/Profile";
import SignOut from "./pages/SignOut";
import Home from "./pages/Home";
import Header from "./components/Header";
function App() {

  return (
    <BrowserRouter>
    <Header />
     <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign-in" element={<Signin />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/sign-out" element={<SignOut />} />
  
      <Route path="/about" element={<About />} />


     </Routes>
    </BrowserRouter>
  )
}

export default App
