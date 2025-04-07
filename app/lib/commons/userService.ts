import { ApiService } from "@/api/apiService";
import { User } from "@/types/user";

const api = new ApiService();

export const getUserById = async (userId: string): Promise<User> => {
  return api.get<User>(`/users/${userId}`);
};

export const updateUser = async (userId: string, data: Partial<User>): Promise<User> => {
  return api.put<User>(`/users/${userId}`, data);
};

