import { useEffect, useState } from "react";
import api from "../api/axios";

const useTherapists = () => {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const res = await api.get("/therapists");
        setTherapists(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapists();
  }, []);

  return { therapists, loading };
};

export default useTherapists;