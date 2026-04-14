import { useEffect, useState } from "react";
import { getPersonalInfo } from "../services/personalInfoService";
import type { FormData } from "./useProfileFormRegex";
import { parseProfilePicture } from "../services/decodeBase64";

const getUsernameFromToken = (): string => {
  const token = localStorage.getItem("token");
  if (!token) return "";

  try {
    const payload = token.split(".")[1] || "";
    const decoded = JSON.parse(atob(payload));
    return decoded.username ?? decoded.sub ?? "";
  } catch {
    return "";
  }
};

export const usePersonalInfo = (
  setInitialData: (data: Partial<FormData>) => void
) => {
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const username = getUsernameFromToken();

        if (!username) throw new Error("No se encontró el usuario");

        const info = await getPersonalInfo(username);

        setInitialData({
          firstName: info.names ?? "",
          lastNamePaternal: info.paternal_surname ?? "",
          lastNameMaternal: info.maternal_surname ?? "",
          address: info.address ?? "",
          email: info.contact_email ?? "",
          phone: info.phone ? String(info.phone) : "",
          country: info.name ?? "",
          profileImageUrl: parseProfilePicture(info.profile_picture) ?? null,
        });
      } catch (err: any) {
        setLoadError(err.message);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, []);

  return { isLoadingData, loadError };
};