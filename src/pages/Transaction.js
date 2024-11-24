import React, { useState, useEffect } from "react";

const Transaction = () => {
  const [profile, setProfile] = useState(null); // Data profil pengguna
  const [saldo, setSaldo] = useState(null); // Data saldo pengguna
  const [transactions, setTransactions] = useState([]); // Data transaksi pengguna
  const [showBalance, setShowBalance] = useState(false); // Toggle saldo
  const [loadingProfile, setLoadingProfile] = useState(true); // Loading state untuk profil
  const [loadingTransactions, setLoadingTransactions] = useState(false); // Loading state untuk transaksi
  const [error, setError] = useState(null); // Error state
  const [offset, setOffset] = useState(0); // Offset untuk pagination transaksi
  const limit = 5; // Jumlah transaksi per halaman

  const PROFILE_API_URL = "https://take-home-test-api.nutech-integrasi.com/profile";
  const BALANCE_API_URL = "https://take-home-test-api.nutech-integrasi.com/balance";
  const TRANSACTION_API_URL = "https://take-home-test-api.nutech-integrasi.com/transaction/history";

  // Fetch Profil dan Saldo
  useEffect(() => {
    const fetchProfileAndBalance = async () => {
      try {
        const token = localStorage.getItem("jwtToken"); // Ambil token dari localStorage
        if (!token) throw new Error("Token tidak ditemukan. Silakan login kembali.");

        // Fetch profil pengguna
        const profileResponse = await fetch(PROFILE_API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!profileResponse.ok) throw new Error("Gagal mengambil data profil.");
        const profileData = await profileResponse.json();
        setProfile(profileData.data);

        // Fetch saldo pengguna
        const balanceResponse = await fetch(BALANCE_API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!balanceResponse.ok) throw new Error("Gagal mengambil data saldo.");
        const balanceData = await balanceResponse.json();
        setSaldo(balanceData.data.balance);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfileAndBalance();
  }, []);

  // Fetch Transaksi
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoadingTransactions(true);

        const token = localStorage.getItem("jwtToken");
        if (!token) throw new Error("Token tidak ditemukan. Silakan login kembali.");

        const response = await fetch(
          `${TRANSACTION_API_URL}?offset=${offset}&limit=${limit}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Gagal mengambil data transaksi.");
        const transactionData = await response.json();

        // Gabungkan transaksi baru dan yang sudah ada, pastikan tidak ada duplikasi berdasarkan invoice_number
        setTransactions((prevTransactions) => {
          const newTransactions = transactionData.data.records;

          // Gabungkan dan hilangkan duplikasi berdasarkan invoice_number
          const allTransactions = [...prevTransactions, ...newTransactions];
          const uniqueTransactions = Array.from(
            new Map(allTransactions.map((item) => [item.invoice_number, item])).values()
          );

          return uniqueTransactions; // Set transaksi yang sudah unik
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingTransactions(false);
      }
    };

    fetchTransactions();
  }, [offset]); // Memuat ulang data transaksi saat offset berubah

  const handleShowMore = () => {
    setOffset((prevOffset) => prevOffset + limit); // Pagination transaksi
  };

  const toggleBalance = () => {
    setShowBalance(!showBalance);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50">
      <div className="max-w-7xl w-full p-6 bg-white shadow-md rounded-lg">
        {/* Header */}
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
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div>
              <p className="text-sm">Saldo anda</p>
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

        {/* Daftar Transaksi */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Semua Transaksi</h3>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <ul className="space-y-4">
              {loadingTransactions ? (
                <p className="text-center text-gray-500">Memuat data transaksi...</p>
              ) : (
                transactions.map((transaction, index) => (
                  <li
                    key={transaction.invoice_number || index}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow"
                  >
                    <div>
                      <p
                        className={`font-bold ${transaction.transaction_type === "TOPUP"
                            ? "text-green-500"
                            : "text-red-500"
                          }`}
                      >
                        {transaction.transaction_type === "TOPUP" ? "+" : "-"} Rp{" "}
                        {transaction.total_amount.toLocaleString("id-ID")}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.created_on).toLocaleString("id-ID", {
                          dateStyle: "long",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">{transaction.description}</p>
                  </li>
                ))
              )}
            </ul>
          )}

          {/* Tombol Show More */}
          {!loadingTransactions && transactions.length > 0 && (
            <button
              onClick={handleShowMore}
              className="mt-6 text-red-500 font-medium hover:underline block mx-auto"
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transaction;
