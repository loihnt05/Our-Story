import { useState, useEffect } from "react";

export function useAnniversaryTimer(mounted: boolean) {
  const [anniversaryDate, setAnniversaryDate] = useState("2026-01-27");
  const [customTitle, setCustomTitle] = useState("Our Story");
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0
  });

  // Load from local storage
  useEffect(() => {
    if (!mounted) return;
    const savedAnniversary = localStorage.getItem("loved_anniversary");
    const savedTitle = localStorage.getItem("loved_title");
    if (savedAnniversary) setAnniversaryDate(savedAnniversary);
    if (savedTitle) setCustomTitle(savedTitle);
  }, [mounted]);

  // Sync to local storage
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("loved_anniversary", anniversaryDate);
    localStorage.setItem("loved_title", customTitle);
  }, [anniversaryDate, customTitle, mounted]);

  // Live Timer logic
  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(anniversaryDate);
      const now = new Date();
      
      let difference = now.getTime() - start.getTime();
      
      if (difference < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, totalDays: 0 });
        return;
      }

      const totalDays = Math.floor(difference / (1000 * 60 * 60 * 24));
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      difference -= days * (1000 * 60 * 60 * 24);
      
      const hours = Math.floor(difference / (1000 * 60 * 60));
      difference -= hours * (1000 * 60 * 60);
      
      const minutes = Math.floor(difference / (1000 * 60));
      difference -= minutes * (1000 * 60);
      
      const seconds = Math.floor(difference / 1000);

      setTimeLeft({ days, hours, minutes, seconds, totalDays });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [anniversaryDate]);

  return {
    anniversaryDate,
    setAnniversaryDate,
    customTitle,
    setCustomTitle,
    timeLeft
  };
}
