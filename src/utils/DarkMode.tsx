import { Moon, Sun1 } from 'iconsax-reactjs';
import React, { useState } from 'react';

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark', !darkMode);
  };

  return (
    <button className="cursor-pointer" onClick={toggleTheme}>
      {darkMode ? <Moon size="24" color="#2ccce4" /> : <Sun1 size="24" color="#2ccce4" />}
    </button>
  );
}
