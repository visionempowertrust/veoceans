"use client";

import { useEffect } from "react";

const publicSite = "https://visionempowertrust.github.io/veoceans/";

export default function Home() {
  useEffect(() => {
    window.location.replace(publicSite);
  }, []);

  return (
    <main style={{ maxWidth: 720, margin: "10vh auto", padding: "2rem" }}>
      <h1>Ocean Learner</h1>
      <p>The open-access lesson is hosted on GitHub Pages. No sign-in is required.</p>
      <p><a href={publicSite}>Continue to the eight-level lesson</a></p>
    </main>
  );
}
