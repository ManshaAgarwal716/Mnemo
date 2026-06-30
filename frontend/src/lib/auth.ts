import { User } from "@/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockUser: User = {
  id: "user-1",
  email: "researcher@mnemo.ai",
  name: "Alex Chen",
  avatar: undefined,
};

export async function login(
  email: string,
  password: string
): Promise<{ user: User; token: string }> {
  await delay(600);

  if (!email || !password) {
    throw new Error("Email and password required");
  }

  const token = "mock_jwt_token_" + Date.now();

  return {
    user: mockUser,
    token,
  };
}

export async function signup(
  name: string,
  email: string,
  password: string
): Promise<{ user: User; token: string }> {
  await delay(800);

  if (!name || !email || !password) {
    throw new Error("All fields required");
  }

  const token = "mock_jwt_token_" + Date.now();

  return {
    user: { ...mockUser, name, email },
    token,
  };
}

export async function logout(): Promise<void> {
  await delay(200);
  // Clear token in the store
}

export async function getCurrentUser(): Promise<User> {
  await delay(300);
  return mockUser;
}
