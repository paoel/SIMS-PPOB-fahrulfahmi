import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Import Link dan useLocation

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State untuk menu responsif
  const location = useLocation(); // Untuk mengetahui rute aktif

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
      {/* Logo Section */}
      <div className="flex items-center space-x-2">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <img
            src="/assets/logo.png" // Pastikan file logo ada di path ini
            alt="Logo"
            className="h-8 w-8 cursor-pointer"
          />
          <span className="text-lg font-bold text-gray-800">SIMS PPOB</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center space-x-6">
        <Link
          to="/topup"
          className={`${
            location.pathname === "/topup" ? "text-red-500 font-bold" : "text-gray-600"
          } hover:text-gray-800 transition duration-300`}
        >
          Top Up
        </Link>
        <Link
          to="/transaction"
          className={`${
            location.pathname === "/transaction" ? "text-red-500 font-bold" : "text-gray-600"
          } hover:text-gray-800 transition duration-300`}
        >
          Transaction
        </Link>
        <Link
          to="/akun"
          className={`${
            location.pathname === "/akun" ? "text-red-500 font-bold" : "text-gray-600"
          } hover:text-gray-800 transition duration-300`}
        >
          Akun
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="block md:hidden text-gray-800 focus:outline-none"
      >
        ☰
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-14 left-0 w-full bg-white shadow-md md:hidden">
          <Link
            to="/topup"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            Top Up
          </Link>
          <Link
            to="/transaction"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            Transaction
          </Link>
          <Link
            to="/akun"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            Akun
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
