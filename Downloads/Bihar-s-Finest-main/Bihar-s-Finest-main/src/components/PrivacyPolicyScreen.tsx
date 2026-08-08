import { ScreenType } from '../types';

interface LegalPageProps {
  setScreen?: (screen: ScreenType) => void;
}

export default function PrivacyPolicyScreen({ setScreen }: LegalPageProps) {
  return (
    <div id="hero" className="max-w-4xl mx-auto px-6 pt-[140px] sm:pt-[148px] md:pt-[152px] pb-24 font-sans min-h-screen">
      <h1 className="font-serif text-3xl md:text-5xl text-stone-900 leading-tight font-light mb-3">
        Privacy Policy
      </h1>
      <p className="text-stone-700">
        This is a placeholder for the Privacy Policy.
      </p>
    </div>
  );
}
