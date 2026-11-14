import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journeys — KS World Adventure",
  description: "Browse all India and Nepal tour packages with our interactive 3D journey explorer.",
};

export default function ExplorePage() {
  redirect("/journeys");
}
