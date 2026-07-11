import Hero from "../components/Hero";
import Features from "../components/Features";
import Services from "../components/Services";
import WhyChoose from "../components/WhyChoose";
import Therapists from "../components/Therapists";
import BookingCTA from "../components/BookingCTA";

const Home = () => {
  return (
    <div className="bg-[#FAF9F6] text-stone-800 antialiased min-h-screen">
      {/* Hero Intro Block */}
      <Hero />

      {/* Primary Value Propositions & Core Offerings */}
      <main className="space-y-24 pb-24">
        <Features />

        <Services />

        <WhyChoose />

        <Therapists />

        <BookingCTA />
      </main>
    </div>
  );
};

export default Home;