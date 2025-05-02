
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import { ToastContainer } from "react-toastify";
import IsLogout from "./protected/IsLogout";
import IsLogin from "./protected/IsLogin";
import  Home  from "./pages/Home";
import NotFound from "./pages/Norfound";

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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App
