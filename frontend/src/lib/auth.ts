import api from "@/lib/api";
import { User } from "@/types";

export async function login(
  email: string,
  password: string
): Promise<{ user: User; token: string }> {

  const response = await api.post(
    "/auth/login",
    {
      email,
      password,
    }
  );

  const data = response.data;
  

  localStorage.setItem(
    "auth_token",
    data.token
  );

 const me = await api.get(
    "/auth/me"
  );

  return {
    user: me.data,
    token: data.token,
  };
}


export async function signup(
  name: string,
  email: string,
  password: string
): Promise<{ user: User; token: string }> {

  await api.post(
    "/auth/signup",
    {
      name,
      email,
      password,
    }
  );

  return await login(
    email,
    password,
  );
}

export async function logout() {

  localStorage.removeItem(
    "auth_token"
  );
}

export async function getCurrentUser(): Promise<User> {

  const response = await api.get(
    "/auth/me"
  );

  return response.data;
}

export async function updateProfile(data: {
  name: string;
}): Promise<User> {
  const response = await api.patch(
    "/users/me",
    data,
  );

  return response.data;
}

export async function changePassword(data: {
  current_password: string;
  new_password: string;
}): Promise<void> {
  await api.patch(
    "/users/password",
    data,
  );
}