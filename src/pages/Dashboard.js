import React, { useState, useEffect } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [saldo, setSaldo] = useState(null);
  const [error, setError] = useState(null);
  const [showBalance, setShowBalance] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const services = [
    { name: "PBB", icon: "/assets/PBB.png" },
    { name: "Listrik", icon: "/assets/Listrik.png" },
    { name: "Pulsa", icon: "/assets/Pulsa.png" },
    { name: "PDAM", icon: "/assets/PDAM.png" },
    { name: "PGN", icon: "/assets/PGN.png" },
    { name: "TV Langganan", icon: "/assets/Televisi.png" },
    { name: "Musik", icon: "/assets/Musik.png" },
    { name: "Voucher Game", icon: "/assets/Game.png" },
    { name: "Voucher Makanan", icon: "/assets/VoucherMakanan.png" },
    { name: "Kurban", icon: "/assets/Kurban.png" },
    { name: "Zakat", icon: "/assets/Zakat.png" },
    { name: "Paket Data", icon: "/assets/PaketData.png" },
  ];

  const promos = [
    "/assets/banner 1.png",
    "/assets/banner 2.png",
    "/assets/banner 3.png",
    "/assets/banner 4.png",
    "/assets/banner 5.png",
  ];

  // Navigasi slider promo
  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? promos.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex === promos.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  // Tampilkan atau sembunyikan saldo
  const toggleBalance = () => {
    setShowBalance(!showBalance);
  };

  // Fetch data profil dan saldo
  useEffect(() => {
    const fetchProfileAndBalance = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) throw new Error("Token tidak ditemukan. Silakan login kembali.");

        // Fetch profil
        const profileResponse = await fetch(
          "https://take-home-test-api.nutech-integrasi.com/profile",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!profileResponse.ok) throw new Error("Gagal mengambil data profil.");

        const profileData = await profileResponse.json();
        if (profileData.status === 0 && profileData.data) {
          setProfile(profileData.data);
          localStorage.setItem("profile", JSON.stringify(profileData.data));
        } else {
          throw new Error(profileData.message || "Gagal memuat profil.");
        }

        // Fetch saldo
        const balanceResponse = await fetch(
          "https://take-home-test-api.nutech-integrasi.com/balance",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!balanceResponse.ok) throw new Error("Gagal mengambil data saldo.");

        const balanceData = await balanceResponse.json();
        if (balanceData.status === 0 && balanceData.data) {
          setSaldo(balanceData.data.balance);
        } else {
          throw new Error(balanceData.message || "Gagal memuat saldo.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfileAndBalance();
  }, []);

  // Error handling
  if (error) {
    return (
      <div className="p-6 bg-red-100 text-red-500 rounded-lg">
        <p>{error}</p>
        <a href="/login" className="text-red-600 underline hover:text-red-800">
          Login kembali
        </a>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto mt-10">
        {/* Header Profil */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col items-left space-y-2">
            <img
              src={profile?.profile_image || "/assets/Profile Photo.png"}
              alt="Avatar"
              className="w-16 h-16 rounded-full shadow-md"
            />
            <div className="text-left">
              <p className="text-sm text-gray-500">Selamat datang,</p>
              <h2 className="text-xl font-bold text-gray-800">
                {profile ? `${profile.first_name} ${profile.last_name}` : "Loading..."}
              </h2>
            </div>
          </div>
          {/* Saldo */}
          <div
            className="bg-red-500 text-white rounded-lg shadow-md p-10 w-1/2 relative"
            style={{
              backgroundImage: "url('/assets/Background Saldo.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div>
              <p className="text-sm">Saldo Anda</p>
              <h2 className="text-2xl font-bold">
                {loadingProfile
                  ? "Loading..."
                  : showBalance
                  ? `Rp ${saldo?.toLocaleString("id-ID")}`
                  : "Rp ●●●●●●●"}
              </h2>
              <button
                onClick={toggleBalance}
                className="text-sm underline ml-2 hover:text-gray-300 flex items-center"
              >
                {showBalance ? "Sembunyikan Saldo" : "Lihat Saldo"}
              </button>
            </div>
          </div>
        </div>

        {/* Layanan */}
        <h2 className="text-xl font-semibold mt-8">Layanan Kami</h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-12 gap-5 mt-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="flex flex-col items-center space-y-2 p-4 bg-white shadow-md rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <img src={service.icon} alt={service.name} className="w-12 h-12" />
              <p className="text-center text-sm font-medium text-gray-700">{service.name}</p>
            </div>
          ))}
        </div>

        {/* Promo */}
        <h2 className="text-xl font-semibold mt-8">Temukan Promo Menarik</h2>
        <div className="relative mt-4">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {promos.map((promo, index) => (
              <img
                key={index}
                src={promo}
                alt={`Promo ${index + 1}`}
                className="w-full h-30 object-cover rounded-lg shadow-md px-4 py-2"
              />
            ))}
          </div>
          <button
            onClick={goToPrevious}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 px-4 py-2 bg-transparent text-white rounded-full z-10 border border-white"
          >
            <MdKeyboardArrowLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 px-4 py-2 bg-transparent text-white rounded-full z-10 border border-white"
          >
            <MdKeyboardArrowRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
