import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Pieces from "@/components/Pieces";
import About from "@/components/About";
import Store from "@/components/Store";
import Instagram from "@/components/Instagram";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Interactions from "@/components/Interactions";

export default function Home() {
  return (
    <>
      <a href="#pecas" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-gold-light focus:px-5 focus:py-3 focus:text-ink">Ir para o conteúdo</a>
      <Header />
      <main>
        <Hero />
        <Pieces />
        <About />
        <Store />
        <Instagram />
        <Contact />
      </main>
      <Footer />
      <Interactions />
    </>
  );
}
