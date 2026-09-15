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
        <section className="px-6 pt-32 pb-14 md:pt-36 md:pb-24 max-w-[1180px] mx-auto w-full">
          <p className="eyebrow mb-3">About</p>
          <h1 className="text-headline">Oksana, 3D Creator</h1>
          <span className="accent-bar mt-4" />
          <div className="mt-8 max-w-2xl">
            <ScrollRevealText
              text="Hi, I'm Oksana. This is a gallery of the things I've printed — models I found, models I designed, and everything in between."
              className="text-subheadline font-sans text-foreground"
            />
          </div>
        </section>

        {/* Bottom Info Section */}
        <section className="px-6 page-bottom-safe max-w-[1180px] mx-auto w-full" id="contact">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 fade-in-up">
            {/* Printers */}
            <div className="rounded-[3px] border border-border bg-white p-6">
              <h2 className="eyebrow">Printers</h2>
              <span className="accent-bar mt-3 mb-4" />
              <ul className="space-y-1">
                {printers.map((printer) => (
                  <li key={printer} className="text-sm">
                    {printer}
                  </li>
                ))}
              </ul>
            </div>

            {/* Materials */}
            <div className="rounded-[3px] border border-border bg-white p-6">
              <h2 className="eyebrow">Materials</h2>
              <span className="accent-bar mt-3 mb-4" />
              <ul className="space-y-1">
                {materials.map((material) => (
                  <li key={material} className="text-sm">
                    {material}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="rounded-[3px] border border-border bg-white p-6">
              <h2 className="eyebrow">Say hi</h2>
              <span className="accent-bar mt-3 mb-4" />
              <div className="space-y-2">
                <a
                  href="mailto:goraad.dk@gmail.com"
                  className="text-sm text-lavender-deep hover:text-ink transition-colors flex items-center gap-2 focus-ring"
                >
                  <Mail size={14} />
                  goraad.dk@gmail.com
                </a>
                <p className="text-sm flex items-center gap-2 text-caption">
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
