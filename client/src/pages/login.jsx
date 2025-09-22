import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../components/logo.png"; // logo import

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Login successful!");
        // persist simple auth flag and basic user (optional)
        try {
          localStorage.setItem("auth", "true");
          if (data?.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
          }
        } catch (_) {}
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setMessage(`❌ ${data.message || "Login failed"}`);
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setMessage("❌ Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#CDE1E6] overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/95 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md mx-4 border-t-4 border-[#07485E]"
      >
        {/* Title with Logo */}
        <h2 className="flex items-center justify-center text-2xl sm:text-3xl font-bold text-[#07485E] mb-6 space-x-2">
          <img src={Logo} alt="CCTV Logo" className="w-8 h-8 sm:w-10 sm:h-10" />
          <span>CCTV Manage</span>
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4"> 
          <motion.input
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg text-sm sm:text-base focus:border-[#07485E] focus:ring-2 focus:ring-[#07485E] focus:outline-none"
          />

          <motion.input
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg text-sm sm:text-base focus:border-[#07485E] focus:ring-2 focus:ring-[#07485E] focus:outline-none"
          />

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-[#07485E] hover:bg-[#063646] text-white py-3 rounded-lg font-semibold text-sm sm:text-base transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        {/* Message */}
        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="mt-4 text-center text-sm sm:text-base font-medium text-[#07485E]"
          >
            {message}
          </motion.p>
        )}

        {/* Footer link */}
        <p className="mt-4 text-sm sm:text-base text-gray-600 text-center">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-[#07485E] font-medium hover:underline"
          >
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;
