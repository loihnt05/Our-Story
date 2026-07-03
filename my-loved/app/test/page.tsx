'use client';

import { FireworksBackground } from '@/components/animate-ui/components/backgrounds/fireworks';

type FireworksBackgroundDemoProps = {
  population: number;
};

export default function FireworksBackgroundDemo({
  population,
}: FireworksBackgroundDemoProps) {

  return (
          <FireworksBackground 
            population={population}
            color={["#db2777", "#7c3aed", "#2563eb", "#059669"]}
            fireworkSpeed={{ min: 3, max: 7 }}
            particleSize={{ min: 1.5, max: 4.5 }}
            className="w-full h-full bg-transparent"
          />
  );
}