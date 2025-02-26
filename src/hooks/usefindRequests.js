import { Base_URL } from "../utils/Constants";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { addRequest } from "../redux/requestsSlice";
const useFindRequest = () => {
const [loading , setLoading] = useState(true);
const dispatch = useDispatch();
    const fetchRequest = async () => {
        
        try {
            const response = await fetch(`${Base_URL}/user/requests/received`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            const data = await response.json();
            dispatch(addRequest(data.data))
            console.log("API Response:", data);
        } catch (err) {
            console.error("Error fetching requests:", err);
        }finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequest();
    }, []);

    return {loading}
};
export default useFindRequest;