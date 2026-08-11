import { useEffect, useState } from 'react';

export default function GlobalBackground() {
  const [seeds, setSeeds] = useState<{ id: number; left: string; delay: string; duration: string; scale: number }[]>([]);
  
  useEffect(() => {
    // Generate only 4 extremely slow seeds globally
    const newSeeds = Array.from({ length: 4 }).map((_, i) => ({
      id: i,
      left: `${20 + Math.random() * 60}%`, // central focus
      delay: `${Math.random() * 8}s`,
      duration: `${30 + Math.random() * 15}s`, // extremely slow fall
      scale: 0.5 + Math.random() * 0.4
    }));
    setSeeds(newSeeds);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#FAF8F4] pointer-events-none">
       
       {/* High-frequency premium SVG grain texture */}
       <div 
         className="absolute inset-0 opacity-[0.04] mix-blend-multiply"
         style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
       />

       {/* Ambient Animated Blobs */}
       {/* Blob 1: Warm Cream Top Right */}
       <div className="absolute -top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,_#FDEBCC_0%,_transparent_70%)] blur-[120px] animate-blob-pulse" style={{ animationDelay: '0s' }} />
       
       {/* Blob 2: Soft Beige Bottom Left */}
       <div className="absolute top-[60%] -left-[20%] w-[70vw] h-[70vw] rounded-full bg-[radial-gradient(circle,_#EAE4D3_0%,_transparent_70%)] blur-[140px] animate-blob-pulse" style={{ animationDelay: '15s', animationDirection: 'reverse' }} />
       
       {/* Blob 3: Very Subtle Olive Center Right */}
       <div className="absolute top-[30%] right-[10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,_#E4E6D9_0%,_transparent_70%)] blur-[130px] animate-blob-pulse" style={{ animationDelay: '7s' }} />

       {/* Diagonal Sunlight Ray */}
       <div className="absolute -top-[50%] -left-[20%] w-[200%] h-[100%] origin-top-left -rotate-[35deg] bg-gradient-to-b from-white via-white/50 to-transparent animate-ray-shimmer pointer-events-none" />

       {/* Floating Makhana Seeds */}
       {seeds.map(seed => (
         <div 
           key={seed.id}
           className="absolute -top-10 animate-fall-seed"
           style={{ 
             left: seed.left, 
             animationDelay: seed.delay, 
             animationDuration: seed.duration,
           }}
         >
            <div style={{ transform: `scale(${seed.scale})` }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#D4A24A" fillOpacity="0.4" />
                <path d="M12 4C14.5 6 16 9 16 12C16 15 14.5 18 12 20C9.5 18 8 15 8 12C8 9 9.5 6 12 4Z" fill="#C28E63" fillOpacity="0.6" />
                <circle cx="10" cy="10" r="2" fill="#FAF8F4" fillOpacity="0.8" />
              </svg>
            </div>
         </div>
       ))}
    </div>
  );
}
