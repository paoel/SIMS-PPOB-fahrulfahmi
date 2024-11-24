import React, { useState, useEffect } from "react";

const TopUp = () => {
  const [profile, setProfile] = useState(null); 
  const [saldo, setSaldo] = useState(0); 
  const [nominal, setNominal] = useState(""); 
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); 
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(null); 
  const [successMessage, setSuccessMessage] = useState(null); 
  const [showBalance, setShowBalance] = useState(false); 
  const [loadingProfile, setLoadingProfile] = useState(true); 

  const PROFILE_API_URL = "https://take-home-test-api.nutech-integrasi.com/profile";
  const BALANCE_API_URL = "https://take-home-test-api.nutech-integrasi.com/balance";
  const TOPUP_API_URL = "https://take-home-test-api.nutech-integrasi.com/topup";

  useEffect(() => {
    const fetchProfileAndSaldo = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          alert("Token tidak ditemukan. Silakan login kembali.");
          window.location.href = "/login";
          return;
        }

        const profileResponse = await fetch(PROFILE_API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!profileResponse.ok) {
          if (profileResponse.status === 401) {
            localStorage.removeItem("jwtToken");
            alert("Sesi Anda telah berakhir. Silakan login kembali.");
            window.location.href = "/login";
            return;
          }
          throw new Error("Gagal mengambil data profil.");
        }

        const profileData = await profileResponse.json();
        setProfile(profileData.data);

        const saldoResponse = await fetch(BALANCE_API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!saldoResponse.ok) {
          throw new Error("Gagal mengambil data saldo.");
        }

        const saldoData = await saldoResponse.json();
        setSaldo(saldoData.data.balance);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfileAndSaldo();
  }, []); 
  const handleNominalChange = (value) => {
    const parsedValue = parseInt(value.replace(/\D/g, "")); 
    if (!parsedValue || parsedValue <= 0) {
      setIsButtonDisabled(true);
      setError("Nominal harus angka positif.");
    } else {
      setIsButtonDisabled(false);
      setError(null); 
    }
    setNominal(parsedValue || "");
  };


  const handleShortcutClick = (value) => {
    setNominal(value);
    setIsButtonDisabled(false);
    setError(null);
  };


  const handleTopUp = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        alert("Token tidak ditemukan. Silakan login kembali.");
        window.location.href = "/login";
        return;
      }

      if (!nominal || nominal <= 0) {
        setError("Nominal harus angka positif.");
        return;
      }

      const response = await fetch(TOPUP_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ top_up_amount: nominal }), 
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("jwtToken");
          alert("Sesi Anda telah berakhir. Silakan login kembali.");
          window.location.href = "/login";
          return;
        }
        throw new Error(data.message || "Terjadi kesalahan saat top up.");
      }

      setSuccessMessage("Top Up berhasil! Saldo Anda telah diperbarui.");
      setTimeout(() => setSuccessMessage(null), 5000); 
      const updatedSaldo = data.data.balance; 
      setSaldo(updatedSaldo); 
      setNominal("");
      setIsButtonDisabled(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBalance = () => {
    setShowBalance(!showBalance);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-md">
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
        <div className="flex justify-between items-center mb-6">
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

          <div
            className="bg-red-500 text-white rounded-lg shadow-md p-10 w-1/2 relative"
            style={{
              backgroundImage: "url('/assets/Background Saldo.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
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
                className="text-sm underline ml-2 hover:text-gray-300 flex items-center">
                {showBalance ? "Sembunyikan Saldo" : "Lihat Saldo"}
              </button>
            </div>
          </div>
        </div>
        <h3 className="text-lg font-bold mb-4">Nominal Top Up</h3>
        <div className="mb-6">
          <input
            type="text"
            value={nominal ? `Rp ${nominal.toLocaleString("id-ID")}` : ""}
            onChange={(e) => handleNominalChange(e.target.value)}
            placeholder="Masukkan nominal Top Up"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-4 mb-4">
          {[10000, 20000, 50000, 100000, 250000, 500000].map((value) => (
            <button
              key={value}
              onClick={() => handleShortcutClick(value)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              Rp {value.toLocaleString("id-ID")}
            </button>
          ))}
        </div>
        <button
          onClick={handleTopUp}
          disabled={isButtonDisabled || isLoading}
          className={`w-full px-4 py-2 text-white rounded-lg ${isButtonDisabled || isLoading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
            }`}
        >
          {isLoading ? "Memproses..." : "Top Up"}
        </button>
      </div>
    </div>
  );
};

export default TopUp;
