import { useEffect, useState } from "react";
import api from "../api/axios";

const useTherapist = (slug) => {
  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const fetchTherapist = async () => {
      try {
        const res = await api.get(`/therapists/${slug}`);
        setTherapist(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapist();
  }, [slug]);

  return { therapist, loading };
};

export default useTherapist;