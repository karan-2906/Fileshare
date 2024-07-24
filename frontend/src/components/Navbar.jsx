import React, { useState, useEffect } from 'react'
import { FaRegSun } from "react-icons/fa6";
import { MdOutlineDarkMode } from "react-icons/md";
import logo from "./logo.png"
const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handlelogout = () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('username');
    window.location.href = '/';
  }

  const toggleVisibility = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className='w-screen fixed flex justify-between items-center bg-gray-300  py-2 px-20'>

      <div className='flex  justify-center items-center text-3xl font-bold text-blue-400'>
        <img src={logo} alt="" className='h-10 w-10' />FILESHARE
      </div>
      <div>
        <h1 className="text-4xl font-bold text-black">Welcome to the Fileshare</h1>
      </div>
      <div className='flex items-center'>
        <button
          onClick={toggleDarkMode}
          className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded mr-3"
        >
          {/* {darkMode ? 'Light Mode' : 'Dark Mode'} */}

          <input
            type="checkbox"
            id="toggle"
            checked={darkMode === false}
            onChange={toggleVisibility}
            className="peer sr-only [&:checked_+_span_svg[data-checked-icon]]:block [&:checked_+_span_svg[data-unchecked-icon]]:hidden"
          />

          <span
            className="flex items-center justify-center p-2 rounded-full text-xl"
            onClick={toggleVisibility}
          >
            {darkMode === false ? <MdOutlineDarkMode className='text-blue-500 ' /> : <FaRegSun className='text-red-500' />}

          </span>
        </button>
        <button className='bg-red-700 px-4 p-3  rounded-xl m-2' onClick={handlelogout}>
          LogOut
        </button>
      </div>
    </div>
  )
}

export default Navbar