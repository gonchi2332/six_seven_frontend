interface PersonalInfoPayload {
  phone: number;
  maternalSurname: string;
  address: string;
  residenceCountryId: number;
  contactEmail: string;
}

const API_URL = import.meta.env.API_URL ;

export const registerPersonalInfo = async (payload: PersonalInfoPayload) => {
  const token = localStorage.getItem("auth_token");

  const response = await fetch(
    `${API_URL}/v1/register/users/personal-info`,
    {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Error al registrar la información personal");
  }

  return data;
};