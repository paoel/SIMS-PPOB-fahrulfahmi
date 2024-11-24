import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Untuk navigasi setelah registrasi

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Untuk navigasi setelah registrasi

  // Fungsi untuk menangani perubahan input
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "confirmPassword" || name === "password") {
      setError(""); // Reset pesan error saat mengetik
    }
  };

  // Fungsi untuk memvalidasi email
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  // Fungsi untuk memvalidasi password
  const validatePasswords = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok!");
    } else {
      setError("");
    }
  };

  // Fungsi untuk menangani submit registrasi
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi input
    if (!validateEmail(formData.email)) {
      setError("Format email tidak valid.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password harus memiliki minimal 8 karakter.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok!");
      return;
    }

    // Reset error message dan tampilkan loading
    setError("");
    setIsLoading(true);

    try {
      // Kirim request registrasi ke API
      const registerResponse = await fetch(
        "https://take-home-test-api.nutech-integrasi.com/registration",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            first_name: formData.firstName, // Format sesuai API
            last_name: formData.lastName, // Format sesuai API
          }),
        }
      );

      const registerData = await registerResponse.json();

      if (registerResponse.ok) {
        // Tampilkan pesan sukses jika registrasi berhasil
        setSuccessMessage("Registrasi berhasil! Anda dapat login sekarang.");
        console.log("Data pendaftaran berhasil disimpan:", registerData);

        // Redirect ke halaman login setelah beberapa detik
        setTimeout(() => {
          navigate("/"); // Halaman login
        }, 2000);
      } else {
        // Tampilkan pesan error jika registrasi gagal
        setError(registerData.message || "Registrasi gagal. Silakan coba lagi.");
      }
    } catch (error) {
      // Tangani error jaringan atau error lainnya
      setError("Terjadi kesalahan. Silakan coba lagi nanti.");
      console.error("Error saat registrasi:", error);
    } finally {
      // Matikan loading setelah selesai
      setIsLoading(false);
    }
  };

  // Fungsi untuk toggle password visibility
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen flex">
      {/* Form Registrasi */}
      <div className="w-1/2 bg-white flex flex-col justify-center px-12">
        <div className="max-w-lg mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold text-gray-800">SIMS PPOB</h1>
            <p className="text-gray-600">Lengkapi data untuk membuat akun</p>
          </div>
          {successMessage && (
            <div className="text-green-500 text-center mb-4">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Masukkan email Anda"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Nama depan"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Nama belakang"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div className="mb-4 relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Buat password"
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
            <div className="mb-4 relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onBlur={validatePasswords}
                placeholder="Konfirmasi password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              <span
                onClick={toggleConfirmPassword}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
              >
                {showConfirmPassword ? (
                  <FaRegEye className="w-6 h-6 text-gray-500" />
                ) : (
                  <FaRegEyeSlash className="w-6 h-6 text-gray-500" />
                )}
              </span>
            </div>
            <button
              type="submit"
              className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
              disabled={isLoading || !!error}
            >
              {isLoading ? "Memproses..." : "Registrasi"}
            </button>
          </form>
          <p className="mt-4 text-center text-gray-600">
            Sudah punya akun?{" "}
            <a href="/" className="text-red-500 hover:underline">
              Login di sini
            </a>
          </p>
        </div>
      </div>

      {/* Ilustrasi Samping */}
      <div className="w-1/2 bg-gray-50 flex items-center justify-center">
        <img
          src="/assets/Illustrasi.png"
          alt="Illustration"
          className="w-3/4 h-auto"
        />
      </div>
    </div>
  );
};

export default Register;
