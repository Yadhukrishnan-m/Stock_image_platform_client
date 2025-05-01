import userAxiosInstance from "../config/UserAxiosInstence";

interface RegisterPayload {
  phone: number;
  email: string;
  password: string;
}

interface loginPayload {
  email: string;
  password: string;
}   

interface passwordPayload {
  currentPassword: string;
  newPassword: string;
}



export const authService = {
  register: async (formData: RegisterPayload) => {
    return await userAxiosInstance.post("/register", formData);
  },
  login: async (formData: loginPayload) => {
    return await userAxiosInstance.post("/login", formData);
  },
  changePassword: async (formData: passwordPayload) => {
    return await userAxiosInstance.post("/change-password", formData);
  },
  logout: async () => {
    return await userAxiosInstance.post("/logout");
  },

  getUser: async () => {
    return await userAxiosInstance.get("/get-user");
  },
}
