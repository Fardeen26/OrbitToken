import { createContext, useEffect, useState } from "react";

export const DarkModeContext = createContext();

// eslint-disable-next-line react/prop-types
const DarkModeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Check localStorage for saved mode
        const storedPreference = localStorage.getItem("theme");
        return storedPreference ? storedPreference === "dark" : false;
    });

    const toggleDarkMode = () => {
        setIsDarkMode((prev) => !prev);
    };

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDarkMode]);

    return (
        <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
};

export default DarkModeProvider;
