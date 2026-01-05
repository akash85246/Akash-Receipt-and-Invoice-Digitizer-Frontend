import { GoogleLogin } from "@react-oauth/google";
import { setUser } from "../redux/slices/userSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
function GoogleLoginButton() {
  const dispatch = useDispatch();

  const handleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const Backend_URL = import.meta.env.VITE_BACKEND_URL;

      const res = await axios.post(
        "/api/auth/google/",
        { token },
        {
          withCredentials: true,
        }
      );

      dispatch(setUser(res.data.user));
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => {
        console.log("Google Login Failed");
      }}
    />
  );
}

export default GoogleLoginButton;
