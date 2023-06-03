import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Application = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/sign-in");
    }
  }, [navigate, token]);

  return (
    <div>
      <h2>Welcome to the Application</h2>
      <p>This can Only Access if you have blockchain based license</p>
    </div>
  );
};

export default Application;
