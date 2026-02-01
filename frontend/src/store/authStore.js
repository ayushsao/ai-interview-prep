// // // import { create } from 'zustand';
// // // import { authAPI } from '../services/api';

// // // export const useAuthStore = create((set, get) => ({
// // //   user: JSON.parse(localStorage.getItem('user') || 'null'),
// // //   token: localStorage.getItem('token'),
// // //   isAuthenticated: !!localStorage.getItem('token'),
// // //   isLoading: false,
// // //   error: null,

// // //   login: async (email, password) => {
// // //     set({ isLoading: true, error: null });
// // //     try {
// // //       const response = await authAPI.login({ email, password });
// // //       const { token, user } = response.data;
      
// // //       localStorage.setItem('token', token);
// // //       localStorage.setItem('user', JSON.stringify(user));
      
// // //       set({ token, user, isAuthenticated: true, isLoading: false });
// // //       return { success: true };
// // //     } catch (error) {
// // //       const message = error.response?.data?.error || 'Login failed';
// // //       set({ error: message, isLoading: false });
// // //       return { success: false, error: message };
// // //     }
// // //   },

// // //   register: async (userData) => {
// // //     set({ isLoading: true, error: null });
// // //     try {
// // //       const response = await authAPI.register(userData);
// // //       const { token, user } = response.data;
      
// // //       localStorage.setItem('token', token);
// // //       localStorage.setItem('user', JSON.stringify(user));
      
// // //       set({ token, user, isAuthenticated: true, isLoading: false });
// // //       return { success: true };
// // //     } catch (error) {
// // //       const message = error.response?.data?.error || 'Registration failed';
// // //       set({ error: message, isLoading: false });
// // //       return { success: false, error: message };
// // //     }
// // //   },

// // //   logout: () => {
// // //     localStorage.removeItem('token');
// // //     localStorage.removeItem('user');
// // //     set({ token: null, user: null, isAuthenticated: false });
// // //   },

// // //   updateUser: async (userData) => {
// // //     try {
// // //       const response = await authAPI.updateProfile(userData);
// // //       const updatedUser = response.data;
// // //       localStorage.setItem('user', JSON.stringify(updatedUser));
// // //       set({ user: updatedUser });
// // //       return { success: true };
// // //     } catch (error) {
// // //       return { success: false, error: error.response?.data?.error };
// // //     }
// // //   },

// // //   clearError: () => set({ error: null })
// // // }));

// // import { create } from "zustand";
// // import { authAPI } from "../services/api";

// // export const useAuthStore = create((set) => ({
// //   user: JSON.parse(localStorage.getItem("user") || "null"),
// //   token: localStorage.getItem("token"),
// //   isAuthenticated: !!localStorage.getItem("token"),
// //   isLoading: false,
// //   error: null,

// //   register: async (userData) => {
// //     set({ isLoading: true, error: null });
// //     try {
// //       const response = await authAPI.register(userData);

// //       const token =
// //         response.data.token || response.data.data?.token;
// //       const user =
// //         response.data.user || response.data.data?.user;

// //       if (!token || !user) {
// //         throw new Error("Invalid register response");
// //       }

// //       localStorage.setItem("token", token);
// //       localStorage.setItem("user", JSON.stringify(user));

// //       set({
// //         token,
// //         user,
// //         isAuthenticated: true,
// //         isLoading: false,
// //       });

// //       return { success: true };
// //     } catch (error) {
// //       const message =
// //         error.response?.data?.message ||
// //         error.response?.data?.error ||
// //         error.message ||
// //         "Registration failed";

// //       set({ error: message, isLoading: false });
// //       return { success: false };
// //     }
// //   },

// //   clearError: () => set({ error: null }),
// // }));

// import { create } from "zustand";
// import axios from "axios";

// // const API_URL = "https://ai-interview-prep-a5xy.onrender.com/api/auth";
// const API_URL = `${import.meta.env.VITE_API_URL}/auth`;


// export const useAuthStore = create((set) => ({
//   user: null,
//   token: localStorage.getItem("token"),
//   isLoading: false,
//   error: null,

//   clearError: () => set({ error: null }),

//   register: async (data) => {
//     set({ isLoading: true, error: null });
//     try {
//       const res = await axios.post(`${API_URL}/register`, data, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       localStorage.setItem("token", res.data.token);

//       set({
//         user: res.data.user,
//         token: res.data.token,
//         isLoading: false,
//       });

//       return { success: true };
//     } catch (err) {
//       console.error("Register error:", err.response?.data || err.message);
//       set({
//         error:
//           err.response?.data?.error ||
//           err.response?.data?.errors?.[0]?.msg ||
//           "Network Error",
//         isLoading: false,
//       });
//       return { success: false };
//     }
//   },

//   login: async (data) => {
//     set({ isLoading: true, error: null });
//     try {
//       const res = await axios.post(`${API_URL}/login`, data);

//       localStorage.setItem("token", res.data.token);

//       set({
//         user: res.data.user,
//         token: res.data.token,
//         isLoading: false,
//       });

//       return { success: true };
//     } catch (err) {
//       set({
//         error: err.response?.data?.error || "Login failed",
//         isLoading: false,
//       });
//       return { success: false };
//     }
//   },
// }));
import { create } from "zustand";
import { authAPI } from "../services/api";

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user") || "null"),
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  register: async (data) => {
    try {
      set({ isLoading: true, error: null });

      const res = await authAPI.register(data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      set({
        user: res.data.user,
        token: res.data.token,
        isAuthenticated: true,
        isLoading: false,
      });

      return { success: true };
    } catch (err) {
      set({
        error:
          err.response?.data?.error ||
          err.response?.data?.errors?.[0]?.msg ||
          "Network Error",
        isLoading: false,
      });
      return { success: false };
    }
  },

  login: async (data) => {
    try {
      set({ isLoading: true, error: null });

      const res = await authAPI.login(data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      set({
        user: res.data.user,
        token: res.data.token,
        isAuthenticated: true,
        isLoading: false,
      });

      return { success: true };
    } catch (err) {
      set({
        error: err.response?.data?.error || "Login failed",
        isLoading: false,
      });
      return { success: false };
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
