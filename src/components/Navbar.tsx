import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Wordmark from "@/components/brand/Wordmark";

interface NavbarProps {
  categories?: string[];
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

const Navbar = ({ categories = [], selectedCategory, onCategoryChange }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
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

  const categoryClass = (active: boolean) =>
    `px-4 min-h-11 flex items-center font-heading font-semibold text-[12px] uppercase tracking-[0.08em] rounded-[3px] border transition-colors focus-ring ${
      active
        ? "bg-ink text-cream-card border-ink"
        : "bg-transparent text-ink border-border hover:border-lavender"
    }`;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          isScrolled ? "bg-background border-b border-border" : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-[1180px] px-6">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="focus-ring" aria-label="Oksana — 3D Creator, home">
              <Wordmark size={36} heartSize={15} />
            </Link>

            {isHomePage && onCategoryChange && visibleCategories.length > 0 && (
              <div className="hidden md:flex items-center gap-3">
                {visibleCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={categoryClass(selectedCategory === category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile: scrollable categories below header */}
      {isHomePage && onCategoryChange && visibleCategories.length > 0 && (
        <div className="fixed top-20 left-0 right-0 z-40 bg-background border-b border-border md:hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-3 px-6 py-3 w-max">
              {visibleCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => onCategoryChange(category)}
                  className={`${categoryClass(selectedCategory === category)} whitespace-nowrap`}
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
