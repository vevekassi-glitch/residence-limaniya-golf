import { useCallback, useState } from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import type { Prefill } from "./components/Hero";
import Ticker from "./components/Ticker";
import About from "./components/About";
import Rooms from "./components/Rooms";
import Halls from "./components/Halls";
import Amenities from "./components/Amenities";
import Payments from "./components/Payments";
import Testimonials from "./components/Testimonials";
import Faq from "./components/Faq";
import Footer from "./components/Footer";
import Booking from "./components/Booking";
import ApiPanel from "./components/ApiPanel";
import { ToastProvider } from "./components/ui";
import { addDaysIso, todayIso } from "./lib/api";

export default function App() {
  const [booking, setBooking] = useState<Prefill | null>(null);
  const [apiOpen, setApiOpen] = useState(false);

  const openBooking = useCallback((p?: Prefill) => {
    setBooking(
      p ?? { kind: "room", from: todayIso(), to: addDaysIso(todayIso(), 2), guests: 2 }
    );
  }, []);

  return (
    <ToastProvider>
      <Nav onBook={() => openBooking()} />
      <main>
        <Hero onBook={openBooking} />
        <Ticker />
        <About />
        <Rooms onBook={openBooking} />
        <Halls onBook={openBooking} />
        <Amenities />
        <Payments onBook={openBooking} />
        <Testimonials />
        <Faq />
      </main>
      <Footer onApi={() => setApiOpen(true)} />
      {booking && <Booking prefill={booking} onClose={() => setBooking(null)} />}
      {apiOpen && <ApiPanel onClose={() => setApiOpen(false)} />}
    </ToastProvider>
  );
}
