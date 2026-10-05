
import CTA from "./components/landing/CTA";
import Features from "./components/landing/Features";
import Footer from "./components/landing/Footer";
import Hero from "./components/landing/Hero";
import Navbar from "./components/landing/Navbar";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </main>
  );

}
