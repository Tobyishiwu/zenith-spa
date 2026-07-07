import { useEffect, useState } from "react";
import api from "../api/axios";

const useTherapists = () => {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const res = await api.get("/therapists");

console.log("Therapists API Response:", res.data);

        console.log("THERAPISTS RESPONSE:", res.data);

const data = Array.isArray(res.data?.data)
          ? res.data.data
          : [];

        console.log("THERAPISTS RESPONSE:", res.data);
console.log("THERAPISTS STATE:", data);

setTherapists(data);
      } catch (error) {
        console.error("Failed to fetch therapists:", error);
        setTherapists([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapists();
  }, []);

  return {
    therapists,
    loading,
  };
};

export default useTherapists;



