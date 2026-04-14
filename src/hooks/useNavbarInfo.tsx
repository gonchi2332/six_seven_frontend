// hooks/useNavbarInfo.ts
import { useEffect, useState } from "react";
import { getPersonalInfo, type PersonalInfoResponse } from "../services/personalInfoService";

const getUsernameFromToken = (): string => {
  const token = localStorage.getItem("token");
  if (!token) return "";
  try {
    const part = token.split(".").at(1);
    if (!part) return "";
    const payload = JSON.parse(atob(part));
    return payload.username ?? "";
  } catch {
    return "";
  }
};

export const useNavbarInfo = () => {
  const [userInfo, setUserInfo] = useState<PersonalInfoResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const username = getUsernameFromToken();
        if (!username) return;
        const info = await getPersonalInfo(username);
        setUserInfo(info);
      } catch {
        setUserInfo(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return { userInfo, isLoading };
};