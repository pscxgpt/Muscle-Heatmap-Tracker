import React from 'react';
import { Muscle } from '../types';

interface BodyMapProps {
  muscleIntensities: Record<string, number>; // muscleId -> intensity (0-10)
}

// Helper to interpolate color from Green -> Yellow -> Red
const getColor = (intensity: number = 0) => {
  if (isNaN(intensity) || intensity === 0) return '#374151'; // Neutral gray-700
  
  // Normalize 0-10 to 0-1
  const t = Math.min(Math.max(intensity / 10, 0), 1);
  
  // Green (#22c55e) to Yellow (#eab308) to Red (#ef4444)
  if (t < 0.5) {
    // Green to Yellow
    const p = t * 2;
    const r = Math.round(34 + (234 - 34) * p);
    const g = Math.round(197 + (179 - 197) * p);
    const b = Math.round(94 + (8 - 94) * p);
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    // Yellow to Red
    const p = (t - 0.5) * 2;
    const r = Math.round(234 + (239 - 234) * p);
    const g = Math.round(179 + (68 - 179) * p);
    const b = Math.round(8 + (68 - 8) * p);
    return `rgb(${r}, ${g}, ${b})`;
  }
};

export const BodyMap: React.FC<BodyMapProps> = ({ muscleIntensities }) => {
  
  // Improved SVG Paths for a more realistic muscle map
  // Coordinate system: 0 0 240 480
  
  return (
    <div className="flex flex-col md:flex-row gap-12 justify-center items-center p-4">
      {/* FRONT VIEW */}
      <div className="relative group">
        <h3 className="text-center text-white/30 mb-4 font-mono text-xs uppercase tracking-[0.2em]">Front</h3>
        <svg width="240" height="480" viewBox="0 0 240 480" className="drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Silhouette / Base Layer */}
          <g className="opacity-5 fill-white pointer-events-none">
             {/* Head */}
             <path d="M120,20 C105,20 95,35 95,55 C95,75 105,85 120,85 C135,85 145,75 145,55 C145,35 135,20 120,20 Z" />
             {/* Neck */}
             <path d="M108,80 L105,95 L135,95 L132,80 Z" />
          </g>

          {/* Traps (Front) */}
          <path
            d="M105,95 L80,105 L95,100 L108,95 Z"
            fill={getColor(muscleIntensities['traps'])}
            className="transition-all duration-500 hover:opacity-80 cursor-pointer"
            stroke="black" strokeWidth="0.5"
          ><title>Right Trap</title></path>
          <path
            d="M135,95 L160,105 L145,100 L132,95 Z"
            fill={getColor(muscleIntensities['traps'])}
            className="transition-all duration-500 hover:opacity-80 cursor-pointer"
            stroke="black" strokeWidth="0.5"
          ><title>Left Trap</title></path>

          {/* Shoulders (Front Delts) */}
          <path
            d="M80,105 L60,115 L65,145 L85,125 Z"
            fill={getColor(muscleIntensities['delts_front'])}
            stroke="black" strokeWidth="0.5"
            className="transition-all duration-500 hover:opacity-80 cursor-pointer"
          ><title>Right Front Delt</title></path>
          <path
            d="M160,105 L180,115 L175,145 L155,125 Z"
            fill={getColor(muscleIntensities['delts_front'])}
            stroke="black" strokeWidth="0.5"
            className="transition-all duration-500 hover:opacity-80 cursor-pointer"
          ><title>Left Front Delt</title></path>

          {/* Chest (Pecs) */}
          <path
            d="M120,100 L85,125 L85,155 L120,165 L120,100 Z"
            fill={getColor(muscleIntensities['pec_major'])}
            stroke="black" strokeWidth="0.5"
            className="transition-all duration-500 hover:opacity-80 cursor-pointer"
          ><title>Right Pec</title></path>
          <path
            d="M120,100 L155,125 L155,155 L120,165 L120,100 Z"
            fill={getColor(muscleIntensities['pec_major'])}
            stroke="black" strokeWidth="0.5"
            className="transition-all duration-500 hover:opacity-80 cursor-pointer"
          ><title>Left Pec</title></path>
          
          {/* Upper Chest (Clavicular Head) - mapped to pec_minor for now */}
          <path
            d="M120,100 L85,125 L120,115 Z"
            fill={getColor(muscleIntensities['pec_minor'])}
            stroke="black" strokeWidth="0.5"
            className="transition-all duration-500 hover:opacity-80 cursor-pointer opacity-50"
          ><title>Right Upper Chest</title></path>
          <path
            d="M120,100 L155,125 L120,115 Z"
            fill={getColor(muscleIntensities['pec_minor'])}
            stroke="black" strokeWidth="0.5"
            className="transition-all duration-500 hover:opacity-80 cursor-pointer opacity-50"
          ><title>Left Upper Chest</title></path>

          {/* Biceps */}
          <path
            d="M65,145 L60,180 L80,175 L85,145 Z"
            fill={getColor(muscleIntensities['biceps'])}
            stroke="black" strokeWidth="0.5"
            className="transition-all duration-500 hover:opacity-80 cursor-pointer"
          ><title>Right Bicep</title></path>
          <path
            d="M175,145 L180,180 L160,175 L155,145 Z"
            fill={getColor(muscleIntensities['biceps'])}
            stroke="black" strokeWidth="0.5"
            className="transition-all duration-500 hover:opacity-80 cursor-pointer"
          ><title>Left Bicep</title></path>

          {/* Forearms */}
          <path
            d="M60,180 L50,220 L70,225 L80,185 Z"
            fill={getColor(muscleIntensities['forearms'])}
            stroke="black" strokeWidth="0.5"
            className="transition-all duration-500 hover:opacity-80 cursor-pointer"
          ><title>Right Forearm</title></path>
          <path
            d="M180,180 L190,220 L170,225 L160,185 Z"
            fill={getColor(muscleIntensities['forearms'])}
            stroke="black" strokeWidth="0.5"
            className="transition-all duration-500 hover:opacity-80 cursor-pointer"
          ><title>Left Forearm</title></path>

          {/* Abs (Rectus Abdominis) */}
          <path
            d="M100,165 L140,165 L135,230 L105,230 Z"
            fill={getColor(muscleIntensities['abs'])}
            stroke="black" strokeWidth="0.5"
            className="transition-all duration-500 hover:opacity-80 cursor-pointer"
          ><title>Abs</title></path>
          
          {/* Obliques */}
          <path
            d="M85,155 L100,165 L105,230 L85,215 Z"
            fill={getColor(muscleIntensities['obliques'])}
            stroke="black" strokeWidth="0.5"
            className="transition-all duration-500 hover:opacity-80 cursor-pointer"
          ><title>Right Oblique</title></path>
          <path
            d="M155,155 L140,165 L135,230 L155,215 Z"
            fill={getColor(muscleIntensities['obliques'])}
            stroke="black" strokeWidth="0.5"
            className="transition-all duration-500 hover:opacity-80 cursor-pointer"
          ><title>Left Oblique</title></path>

          {/* Quads */}
          <path
            d="M85,230 L115,230 L110,320 L80,300 Z"
            fill={getColor(muscleIntensities['quads'])}
            stroke="black" strokeWidth="0.5"
            className="transition-all duration-500 hover:opacity-80 cursor-pointer"
          ><title>Right Quad</title></path>
          <path
            d="M155,230 L125,230 L130,320 L160,300 Z"
            fill={getColor(muscleIntensities['quads'])}
            stroke="black" strokeWidth="0.5"
            className="transition-all duration-500 hover:opacity-80 cursor-pointer"
          ><title>Left Quad</title></path>

          {/* Adductors */}
          <path
            d="M115,230 L110,320 L120,280 Z"
            fill={getColor(muscleIntensities['adductors'])}
            stroke="black" strokeWidth="0.5"
            className="transition-all duration-500 hover:opacity-80 cursor-pointer"
          ><title>Right Adductor</title></path>
           <path
            d="M125,230 L130,320 L120,280 Z"
            fill={getColor(muscleIntensities['adductors'])}
            stroke="black" strokeWidth="0.5"
            className="transition-all duration-500 hover:opacity-80 cursor-pointer"
          ><title>Left Adductor</title></path>

          {/* Calves (Front/Tibialis) */}
          <path
            d="M80,320 L110,320 L105,400 L85,400 Z"
            fill={getColor(muscleIntensities['calves'])} 
            stroke="black" strokeWidth="0.5"
            className="transition-all duration-500 hover:opacity-80 cursor-pointer"
            opacity="0.8"
          ><title>Right Shin/Calf</title></path>
          <path
            d="M160,320 L130,320 L135,400 L155,400 Z"
            fill={getColor(muscleIntensities['calves'])}
            stroke="black" strokeWidth="0.5"
            className="transition-all duration-500 hover:opacity-80 cursor-pointer"
            opacity="0.8"
          ><title>Left Shin/Calf</title></path>
        </svg>
      </div>

      {/* BACK VIEW */}
      <div className="relative group">
        <h3 className="text-center text-white/30 mb-4 font-mono text-xs uppercase tracking-[0.2em]">Back</h3>
        <svg width="240" height="480" viewBox="0 0 240 480" className="drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
           <g className="opacity-5 fill-white pointer-events-none">
             <path d="M120,20 C105,20 95,35 95,55 C95,75 105,85 120,85 C135,85 145,75 145,55 C145,35 135,20 120,20 Z" />
             <path d="M108,80 L105,95 L135,95 L132,80 Z" />
          </g>

          {/* Traps (Back) */}
          <path
            d="M105,95 L135,95 L120,140 Z"
            fill={getColor(muscleIntensities['traps'])}
            stroke="black" strokeWidth="0.5"
            className="transition-all duration-500 hover:opacity-80 cursor-pointer"
          ><title>Traps (Mid/Lower)</title></path>
          <path
            d="M80,105 L105,95 L120,140 L90,125 Z"
            fill={getColor(muscleIntensities['traps'])}
            stroke="black" strokeWidth="0.5"
            className="transition-all duration-500 hover:opacity-80 cursor-pointer"
          ><title>Left Trap</title></path>
           <path
            d="M160,105 L135,95 L120,140 L150,125 Z"
            fill={getColor(muscleIntensities['traps'])}
            stroke="black" strokeWidth="0.5"
            className="transition-all duration-500 hover:opacity-80 cursor-pointer"
          ><title>Right Trap</title></path>

          {/* Rear Delts */}
          <path
            d="M80,105 L60,115 L65,135 L90,125 Z"
            fill={getColor(muscleIntensities['delts_rear'])}
            stroke="black" strokeWidth="0.5"
            className="transition-all duration-500 hover:opacity-80 cursor-pointer"
          ><title>Left Rear Delt</title></path>
          <path
            d="M160,105 L180,115 L175,135 L150,125 Z"
            fill={getColor(muscleIntensities['delts_rear'])}
            stroke="black" strokeWidth="0.5"
            className="transition-all duration-500 hover:opacity-80 cursor-pointer"
          ><title>Right Rear Delt</title></path>

          {/* Lats */}
          <path
            d="M90,125 L120,140 L120,190 L95,170 Z"
            fill={getColor(muscleIntensities['lats'])}
            stroke="black" strokeWidth="0.5"
            className="transition-all duration-500 hover:opacity-80 cursor-pointer"
          ><title>Left Lat</title></path>
          <path
            d="M150,125 L120,140 L120,190 L145,170 Z"
            fill={getColor(muscleIntensities['lats'])}
            stroke="black" strokeWidth="0.5"
            className="transition-all duration-500 hover:opacity-80 cursor-pointer"
          ><title>Right Lat</title></path>

          {/* Lower Back (Erector Spinae) */}
          <path
            d="M105,190 L135,190 L130,215 L110,215 Z"
            fill={getColor(muscleIntensities['lower_back'])}
            stroke="black" strokeWidth="0.5"
            className="transition-all duration-500 hover:opacity-80 cursor-pointer"
          ><title>Lower Back</title></path>

          {/* Triceps */}
          <path
            d="M65,135 L60,175 L80,170 L90,135 Z"
            fill={getColor(muscleIntensities['triceps'])}
            stroke="black" strokeWidth="0.5"
            className="transition-all duration-500 hover:opacity-80 cursor-pointer"
          ><title>Left Tricep</title></path>
          <path
            d="M175,135 L180,175 L160,170 L150,135 Z"
            fill={getColor(muscleIntensities['triceps'])}
            stroke="black" strokeWidth="0.5"
            className="transition-all duration-500 hover:opacity-80 cursor-pointer"
          ><title>Right Tricep</title></path>

          {/* Forearms (Back) */}
          <path
            d="M60,175 L50,215 L70,220 L80,180 Z"
            fill={getColor(muscleIntensities['forearms'])}
            stroke="black" strokeWidth="0.5"
            className="transition-all duration-500 hover:opacity-80 cursor-pointer"
          ><title>Left Forearm</title></path>
          <path
            d="M180,175 L190,215 L170,220 L160,180 Z"
            fill={getColor(muscleIntensities['forearms'])}
            stroke="black" strokeWidth="0.5"
            className="transition-all duration-500 hover:opacity-80 cursor-pointer"
          ><title>Right Forearm</title></path>

          {/* Glutes */}
          <path
            d="M95,215 L120,215 L120,260 L85,250 Z"
            fill={getColor(muscleIntensities['glutes'])}
            stroke="black" strokeWidth="0.5"
            className="transition-all duration-500 hover:opacity-80 cursor-pointer"
          ><title>Left Glute</title></path>
          <path
            d="M145,215 L120,215 L120,260 L155,250 Z"
            fill={getColor(muscleIntensities['glutes'])}
            stroke="black" strokeWidth="0.5"
            className="transition-all duration-500 hover:opacity-80 cursor-pointer"
          ><title>Right Glute</title></path>

          {/* Hamstrings */}
          <path
            d="M85,250 L115,260 L110,320 L85,320 Z"
            fill={getColor(muscleIntensities['hamstrings'])}
            stroke="black" strokeWidth="0.5"
            className="transition-all duration-500 hover:opacity-80 cursor-pointer"
          ><title>Left Hamstring</title></path>
          <path
            d="M155,250 L125,260 L130,320 L155,320 Z"
            fill={getColor(muscleIntensities['hamstrings'])}
            stroke="black" strokeWidth="0.5"
            className="transition-all duration-500 hover:opacity-80 cursor-pointer"
          ><title>Right Hamstring</title></path>

          {/* Calves */}
          <path
            d="M85,320 L110,320 L105,390 L90,390 Z"
            fill={getColor(muscleIntensities['calves'])}
            stroke="black" strokeWidth="0.5"
            className="transition-all duration-500 hover:opacity-80 cursor-pointer"
          ><title>Left Calf</title></path>
          <path
            d="M155,320 L130,320 L135,390 L150,390 Z"
            fill={getColor(muscleIntensities['calves'])}
            stroke="black" strokeWidth="0.5"
            className="transition-all duration-500 hover:opacity-80 cursor-pointer"
          ><title>Right Calf</title></path>
        </svg>
      </div>
    </div>
  );
};
