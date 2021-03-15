import axios from "axios";
import { useQuery } from "react-query";
export default function useProfile() {
  const fetchProfile = async () => {
    const response = await axios.get("/api/auth/me");
    return response.data;
  };
  const { data, isLoading, isError, error } = useQuery(
    "profile",
    fetchProfile,
    { staleTime: 1000 * 60 * 30 }
  );
  return {
    userProfile: data,
    isProfileLoading: isLoading,
    isProfileError: isError,
    profileError: error,
  };
}
