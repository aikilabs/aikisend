"use client";
import Image from "next/image";
import Hero from "./components/hero";
import CustomCursorInDiv from "./smaller-components/customCursor";
import DarkModeToggle from "./smaller-components/darkModeToggle";
import Features from "./components/features";
import Lenis from "@studio-freight/lenis";
import Process from "./components/process";
import Footer from "./components/footer";

export default function Home() {
  const lenis = new Lenis();

  lenis.on("scroll", (e) => {
    console.log(e);
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
  return (
    <CustomCursorInDiv>
      <DarkModeToggle />
      <Hero />
      <Features />
      <Process />
      <Footer />
    </CustomCursorInDiv>
  );
}
