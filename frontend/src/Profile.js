import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [navigate, token]);

  return (
    <div>
      <h2>Welcome to your profile</h2>
      <p>This is a private route</p>
    </div>
  );
};

export default Profile;
