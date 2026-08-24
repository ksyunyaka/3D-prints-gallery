import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Moon, Sun } from "lucide-react";

interface NavbarProps {
  categories?: string[];
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

const Navbar = ({ categories = [], selectedCategory, onCategoryChange }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();

  const isHomePage = location.pathname === "/";
  const visibleCategories = categories.slice(0, 5);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle("dark", newIsDark);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? "bg-background/95 backdrop-blur-sm" : "bg-transparent"
        }`}
      >
        <div className="px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="text-lg font-medium tracking-tight hover:opacity-80 transition-opacity duration-300 focus-ring"
            >
              Oksana&nbsp;Prints
            </Link>

            {/* Center: Category Filters (Desktop only, only on Home page) */}
            {isHomePage && onCategoryChange && visibleCategories.length > 0 && (
              <div className="hidden md:flex items-center gap-2">
                {visibleCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={`px-4 py-1.5 text-sm rounded-full transition-all duration-300 ${
                      selectedCategory === category
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}

            {/* Right side: Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 min-h-11 min-w-11 flex items-center justify-center hover:opacity-80 transition-opacity duration-300 focus-ring"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile: Scrollable Categories below header (only on Home page) */}
      {isHomePage && onCategoryChange && visibleCategories.length > 0 && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm md:hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 px-6 py-3 w-max">
              {visibleCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => onCategoryChange(category)}
                  className={`px-4 py-2 text-sm rounded-full whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
