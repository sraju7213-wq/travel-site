"use client";

import React, { useState } from "react";
import HomeHero from "@/components/HomeHero";
import VideoTheaterModal from "@/components/VideoTheaterModal";

export default function HomeVideoExperience() {
  const [isTheaterOpen, setIsTheaterOpen] = useState(false);

  return (
    <>
      {/* Ambient Looping Hero with Watch Film CTA */}
      <HomeHero onOpenTheater={() => setIsTheaterOpen(true)} />

      {/* Full-Screen Cloudflare Stream 1080p Theater Modal */}
      <VideoTheaterModal
        isOpen={isTheaterOpen}
        onClose={() => setIsTheaterOpen(false)}
      />
    </>
  );
}
