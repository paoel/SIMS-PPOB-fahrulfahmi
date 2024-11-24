import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fungsi untuk toggle password visibility
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Fungsi validasi email
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  // Fungsi untuk menangani login
  const handleLogin = async (e) => {
    e.preventDefault();

    // Validasi input
    if (!validateEmail(email)) {
      setErrorMessage("Format email tidak valid.");
      return;
    }
    if (password.length < 8) {
      setErrorMessage("Password harus memiliki minimal 8 karakter.");
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    try {
      // Kirim request ke API login
      const response = await fetch(
        "https://take-home-test-api.nutech-integrasi.com/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.status === 0) {
        const token = data.data?.token; // Ambil token dari respons API

        if (token) {
          // Simpan token JWT di localStorage
          localStorage.setItem("jwtToken", token);
          console.log("Token berhasil disimpan:", token);

          // Arahkan ke halaman dashboard setelah login berhasil
          navigate("/dashboard");
        } else {
          throw new Error("Token tidak ditemukan di respons API.");
        }
      } else {
        // Tampilkan pesan error dari API jika login gagal
        setErrorMessage(data.message || "Login gagal. Periksa email dan password Anda.");
      }
    } catch (error) {
      setErrorMessage("Terjadi kesalahan. Silakan coba lagi.");
      console.error("Error saat login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Kiri: Form Login */}
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center px-8 md:px-12">
        <div className="max-w-md mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold text-gray-800">SIMS PPOB</h1>
            <p className="text-gray-600">Masuk atau buat akun untuk memulai</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Masukkan email Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div className="mb-4 relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password Anda"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              <span
                onClick={togglePassword}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? (
                  <FaRegEye className="w-6 h-6 text-gray-500" />
                ) : (
                  <FaRegEyeSlash className="w-6 h-6 text-gray-500" />
                )}
              </span>
            </div>

            {/* Menampilkan error message jika ada */}
            {errorMessage && (
              <p className="text-red-500 text-center mb-4">{errorMessage}</p>
            )}

            <button
              type="submit"
              className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
              disabled={isLoading}
            >
              {isLoading ? "Memproses..." : "Masuk"}
            </button>
          </form>
          <p className="mt-4 text-center text-gray-600">
            Belum punya akun?{" "}
            <a href="/register" className="text-red-500 hover:underline">
              Registrasi di sini
            </a>
          </p>
        </div>
      </div>

      {/* Kanan: Gambar */}
      <div className="hidden md:flex w-full md:w-1/2 bg-gray-50 items-center justify-center">
        <img
          src="/assets/Illustrasi.png"
          alt="Illustration"
          className="w-auto h-auto"
        />
      </div>
    </div>
  );
};

export default Login;
