export type DimitraVideo = {
  id: "dimitra1" | "dimitra2" | "dimitra3";
  src: string;
  poster: string;
};

/** Hosted locally — sourced from Instagram posts (see scripts/download-dimitra-videos.mjs). */
export const DIMITRA_VIDEOS: DimitraVideo[] = [
  {
    id: "dimitra1",
    src: "/dimitra1.mp4",
    poster: "/dimitra1.jpg",
  },
  {
    id: "dimitra2",
    src: "/dimitra2.mp4",
    poster: "/dimitra2.jpg",
  },
  {
    id: "dimitra3",
    src: "/dimitra3.mp4",
    poster: "/dimitra3.jpg",
  },
];
