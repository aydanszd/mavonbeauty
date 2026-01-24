const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1/auth";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  surname?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    _id: string;
    name: string;
    email: string;
  };
}

export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // For cookies
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Login failed");
    }

    if (result.token) {
      // Store token in localStorage or cookies
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
    }

    return result;
  } catch (error: any) {
    console.error("Login error:", error);
    return {
      success: false,
      message: error.message || "Network error. Please try again.",
    };
  }
};

export const registerUser = async (
  data: RegisterData,
): Promise<AuthResponse> => {
  try {
    // Remove confirmPassword before sending to server
    const { confirmPassword, surname, ...registerData } = data;

    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `${data.name} ${data.surname || ""}`.trim(),
        email: data.email,
        password: data.password,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Registration failed");
    }

    return result;
  } catch (error: any) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: error.message || "Network error. Please try again.",
    };
  }
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  // You might also want to call a logout API endpoint
};

export const getCurrentUser = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
  return null;
};

export const isAuthenticated = () => {
  if (typeof window !== "undefined") {
    return !!localStorage.getItem("token");
  }
  return false;
};
