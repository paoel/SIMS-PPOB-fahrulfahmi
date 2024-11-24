import React, { useState, useEffect } from "react";
import { FaUserEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState({
    email: "",
    firstName: "",
    lastName: "",
    profilePicture: "/assets/Profile Photo.png", 
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(""); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) throw new Error("Token tidak ditemukan. Silakan login kembali.");

        const response = await fetch(
          "https://take-home-test-api.nutech-integrasi.com/profile",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Gagal mengambil data profil.");
        const data = await response.json();

        setProfile({
          email: data.data.email,
          firstName: data.data.first_name,
          lastName: data.data.last_name,
          profilePicture: data.data.profile_picture || "/assets/Profile Photo.png",
        });
      } catch (error) {
        alert(error.message);
        navigate("/"); 
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 100 * 1024 && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setNotification(""); 
    } else {
      setNotification("Ukuran file maksimum adalah 100 KB dan harus berupa gambar.");
    }
  };

  const handlePictureUpload = async () => {
    if (!selectedFile) {
      setNotification("Harap pilih file gambar terlebih dahulu.");
      return;
    }

    const formData = new FormData();
    formData.append("profile_picture", selectedFile);

    try {
      setIsLoading(true);
      const token = localStorage.getItem("jwtToken");
      if (!token) throw new Error("Token tidak ditemukan. Silakan login kembali.");

      const response = await fetch(
        "https://take-home-test-api.nutech-integrasi.com/profile/image",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        setProfile((prev) => ({
          ...prev,
          profilePicture: `${data.data.profile_image}?timestamp=${new Date().getTime()}`, 
        }));
        setNotification("Gambar berhasil diunggah.");
      } else {
        setNotification(data.message || "Gagal mengunggah gambar.");
      }
    } catch (error) {
      setNotification(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile.firstName || !profile.lastName) {
      setNotification("Nama depan dan nama belakang tidak boleh kosong.");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("jwtToken");
      if (!token) throw new Error("Token tidak ditemukan. Silakan login kembali.");

      const response = await fetch(
        "https://take-home-test-api.nutech-integrasi.com/profile/update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            first_name: profile.firstName,
            last_name: profile.lastName,
          }),
        }
      );

      if (!response.ok) throw new Error("Gagal mengupdate profil.");
      setNotification("Profil berhasil diperbarui.");
      setIsEditing(false);
    } catch (error) {
      setNotification(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedFile(null); 
    setNotification("");
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center">
      <div className="max-w-xl w-full bg-white p-8 rounded-lg shadow-md">
        {/* Gambar Profil */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={profile.profilePicture}
              alt="Profile"
              className="w-24 h-24 rounded-full border-2 border-gray-300 shadow-md"
            />
            {isEditing && (
              <>
                <label
                  htmlFor="profilePicture"
                  className="absolute bottom-0 right-0 bg-red-500 text-white p-2 rounded-full cursor-pointer"
                >
                  <FaUserEdit />
                </label>
                <input
                  type="file"
                  id="profilePicture"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </>
            )}
          </div>
          <h2 className="mt-4 text-xl font-semibold">
            {profile.firstName} {profile.lastName}
          </h2>
          {selectedFile && isEditing && (
            <p className="text-gray-500 mt-2">File dipilih: {selectedFile.name}</p>
          )}
        </div>

        {notification && (
          <div
            className={`mt-4 p-2 rounded-lg ${
              notification.includes("berhasil")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {notification}
          </div>
        )}

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <input
              type="text"
              value={profile.email}
              disabled
              className="w-full bg-gray-100 px-4 py-2 rounded-lg border"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Nama Depan</label>
            <input
              type="text"
              value={profile.firstName}
              disabled={!isEditing}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  firstName: e.target.value,
                }))
              }
              className={`w-full px-4 py-2 rounded-lg border ${isEditing ? "bg-white" : "bg-gray-100"}`}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Nama Belakang</label>
            <input
              type="text"
              value={profile.lastName}
              disabled={!isEditing}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  lastName: e.target.value,
                }))
              }
              className={`w-full px-4 py-2 rounded-lg border ${isEditing ? "bg-white" : "bg-gray-100"}`}
            />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                disabled={isLoading}
              >
                {isLoading ? "Menyimpan..." : "Simpan"}
              </button>
              <button
                onClick={handleCancel}
                className="w-full py-2 border border-gray-300 text-gray-500 rounded-lg hover:bg-gray-100"
              >
                Batalkan
              </button>
              <button
                onClick={handlePictureUpload}
                className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                disabled={isLoading || !selectedFile}
              >
                {isLoading ? "Mengunggah..." : "Unggah Gambar"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="w-full py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-100"
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
