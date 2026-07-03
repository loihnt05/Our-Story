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
            className="w-full h-full bg-transparent"
          />
  );
}