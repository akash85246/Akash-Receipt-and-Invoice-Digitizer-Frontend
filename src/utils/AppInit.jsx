import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUser } from "../redux/slices/userSlice";

const AppInit = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return null;
};

export default AppInit;