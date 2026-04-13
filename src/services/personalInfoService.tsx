export interface PersonalInfoResponse {
  username: string;
  state: string;
  phone: string | null;
  names: string;
  paternal_surname: string;
  maternal_surname: string | null;
  address: string | null;
  name: string | null;
  contact_email: string | null;
  profile_picture: string | null;
}

const API_URL = import.meta.env.VITE_API_URL;

export const getPersonalInfo = async (username: string): Promise<PersonalInfoResponse> => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/v1/register/users/personal-info?username=${username}`,
    {
      headers: {
        Authorization: `Authorization ${token}`,
      },
    }
  );

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Error al obtener la información personal");
  }

  return data.userPersonalInfo;
};

export const updatePersonalInfo = async (formData: FormData) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/api/v1/register/users/personal-info`, {
    method: "POST",
    headers: {
      Authorization: `Authorization ${token}`,
    },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Error al actualizar la información personal");
  }

  return data;
};