import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Mail } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const FloatingNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [contactOpen, setContactOpen] = useState(false);

  const navItems = [
    { name: "Gallery", path: "/" },
    { name: "About", path: "/about" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const itemClass = (active: boolean) =>
    `px-5 min-h-11 flex items-center font-heading font-semibold text-[12px] uppercase tracking-[0.08em] rounded-[3px] transition-colors focus-ring ${
      active ? "bg-ink text-cream-card" : "text-ink hover:bg-cream"
    }`;

  return (
    <nav className="nav-safe-area fixed left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 rounded-[3px] border border-border bg-cream-card p-1.5">
        {navItems.map((item) => (
          <Link key={item.name} to={item.path} className={itemClass(isActive(item.path))}>
            {item.name}
          </Link>
        ))}

        <Popover open={contactOpen} onOpenChange={setContactOpen}>
          <PopoverTrigger asChild>
            <button className={itemClass(contactOpen)}>Contact</button>
          </PopoverTrigger>
          <PopoverContent
            className="w-64 p-4 rounded-[3px] border border-border bg-white"
            side="top"
            sideOffset={12}
          >
            <p className="eyebrow mb-1">Say hi</p>
            <span className="accent-bar mb-3" />
            <a
              href="mailto:goraad.dk@gmail.com"
              className="flex items-center gap-2 text-sm text-lavender-deep transition-colors hover:text-ink focus-ring"
            >
              <Mail size={14} />
              goraad.dk@gmail.com
            </a>
          </PopoverContent>
        </Popover>
      </div>
    </nav>
  );
};

export default FloatingNav;
