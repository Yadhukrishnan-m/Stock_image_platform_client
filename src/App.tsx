
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import { ToastContainer } from "react-toastify";
import IsLogout from "./protected/IsLogout";
import IsLogin from "./protected/IsLogin";
import  Home  from "./pages/Home";

function App() {


  return (
    <>
      <ToastContainer />

      <Router>
        <Routes>
          <Route
            path="/auth"
            element={
              <IsLogout>
                <AuthPage />
              </IsLogout>
            }
          />
          <Route
            path="/"
            element={
              <IsLogin>
                <Home />
              </IsLogin>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App
