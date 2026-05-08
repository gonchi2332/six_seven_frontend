// hooks/useNavbarInfo.ts
import { useEffect, useState } from "react";
import { getPersonalInfo, type PersonalInfoResponse } from "../services/personalInfoService";
import { useAuthContext } from "../context/AuthContext";

export const useNavbarInfo = (refreshTrigger?: number) => {
  const { username } = useAuthContext();
  const [userInfo, setUserInfo] = useState<PersonalInfoResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!username) {
        setUserInfo(null);
        setIsLoading(false);
        return;
      }
      try {
        const info = await getPersonalInfo(username);
        setUserInfo(info);
      } catch {
        setUserInfo(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [username, refreshTrigger]);

  return { userInfo, isLoading };
};