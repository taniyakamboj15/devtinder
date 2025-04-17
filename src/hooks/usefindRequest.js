import { BASE_URL } from "../constants/constants";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { addRequest } from "../Slices/requestSlice";
const useFindRequest = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const fetchRequest = async () => {
    try {
      const response = await fetch(`${BASE_URL}/user/requests/received`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      dispatch(addRequest(data.data));
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, []);

  return { loading };
};
export default useFindRequest;
