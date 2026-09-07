import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AppDrop — Mobile App Showcase',
  description: 'Extracted landing page from appdrop.framer.website',
};

export default function Web1Page() {
  return (
    <div className="w-full h-screen min-h-screen bg-black overflow-hidden m-0 p-0">
      <iframe
        src="/web1/index.html"
        title="AppDrop Landing Page"
        className="w-full h-full min-h-screen border-0 m-0 p-0 block"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
