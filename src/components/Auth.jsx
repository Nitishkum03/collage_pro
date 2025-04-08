import { useState } from "react";
import { toast } from "react-toastify";

export default function Auth({ setIsAuthenticated }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      toast.error("All fields are required!");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (isLogin) {
      const user = users.find(
        (u) => u.username === formData.username && u.password === formData.password
      );
      if (user) {
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        toast.success("Login successful!");
        setIsAuthenticated(true);
      } else {
        toast.error("Invalid credentials!");
      }
    } else {
      const exists = users.find((u) => u.username === formData.username);
      if (exists) {
        toast.error("User already exists!");
        return;
      }
      users.push(formData);
      localStorage.setItem("users", JSON.stringify(users));
      toast.success("Signup successful! You can now log in.");
      setIsLogin(true);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        <input
          type="text"
          placeholder="Enter your username"
          className="w-full p-2 border rounded mb-2"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-4"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>
        <p className="text-sm mt-3 text-center">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </form>
    </div>
  );
}
