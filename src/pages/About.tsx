import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FloatingNav from "@/components/FloatingNav";
import SiteFooter from "@/components/SiteFooter";
import ScrollRevealText from "@/components/ScrollRevealText";
import { Mail, MapPin } from "lucide-react";

const About = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#contact") {
      const element = document.getElementById("contact");
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  const printers = ["Prusa MK4", "Prusa MK4S"];

  const materials = ["PLA", "PETG", "PET"];

  return (
    <>
      <main className="min-h-screen bg-background page-transition">
        <Navbar />

        {/* Hero Bio Section */}
        <section className="min-h-[60vh] max-h-[70vh] flex flex-col justify-center px-6 pt-24 pb-8">
          <div className="max-w-[95%]">
            <ScrollRevealText
              text="Hi, I'm Oksana. This is a gallery of the things I've printed — models I found, models I designed, and everything in between."
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] font-display"
            />
          </div>
        </section>

        {/* Bottom Info Section */}
        <section className="px-6 pb-32" id="contact">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 fade-in-up">
            {/* Printers */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4 border-b border-border pb-2">
                Printers
              </h3>
              <ul className="space-y-1">
                {printers.map((printer) => (
                  <li key={printer} className="text-sm">
                    {printer}
                  </li>
                ))}
              </ul>
            </div>

            {/* Materials */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4 border-b border-border pb-2">
                Materials
              </h3>
              <ul className="space-y-1">
                {materials.map((material) => (
                  <li key={material} className="text-sm">
                    {material}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4 border-b border-border pb-2">
                Say Hi!
              </h3>
              <div className="space-y-2">
                <a
                  href="mailto:goraad.dk@gmail.com"
                  className="text-sm hover:opacity-70 transition-opacity flex items-center gap-2"
                >
                  <Mail size={14} />
                  goraad.dk@gmail.com
                </a>
                <p className="text-sm flex items-center gap-2 text-muted-foreground">
                  <MapPin size={14} />
                  Copenhagen, Denmark
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>
      <SiteFooter />
      <FloatingNav />
    </>
  );
};

export default About;
