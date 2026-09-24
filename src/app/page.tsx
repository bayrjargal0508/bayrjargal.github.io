import WhatIBuild from "@/components/with-3d";
import App from "../components/App";
import "../components/index.css";
import AboutMe from "@/components/with-3d/about-me";

export default function Home() {
  return (
    // <main>
    //   <ParticlesBackground />
    //   <Header />
    // </main>
    <>
      <App />
      <WhatIBuild />
      <AboutMe />
    </>
  );
}
