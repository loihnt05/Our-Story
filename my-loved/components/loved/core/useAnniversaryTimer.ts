import { useState, useEffect, useRef } from "react";

export function useAnniversaryTimer(mounted: boolean) {
  const [anniversaryDate, setAnniversaryDateState] = useState("2026-01-27");
  const [customTitle, setCustomTitleState] = useState("Our Story");
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0
  });

  const isInitialLoadRef = useRef(true);

  // Load from database / local storage
  useEffect(() => {
    if (!mounted) return;
    
    // Initial sync from DB
    fetch("/api/couple")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.couple) {
          if (data.couple.anniversaryDate) {
            const dateStr = new Date(data.couple.anniversaryDate).toISOString().split("T")[0];
            setAnniversaryDateState(dateStr);
            localStorage.setItem("loved_anniversary", dateStr);
          }
          if (data.couple.customTitle) {
            setCustomTitleState(data.couple.customTitle);
            localStorage.setItem("loved_title", data.couple.customTitle);
          }
        }
      })
      .catch((err) => console.error("[useAnniversaryTimer] DB load failed:", err))
      .finally(() => {
        isInitialLoadRef.current = false;
      });

    const savedAnniversary = localStorage.getItem("loved_anniversary");
    const savedTitle = localStorage.getItem("loved_title");
    if (savedAnniversary) setAnniversaryDateState(savedAnniversary);
    if (savedTitle) setCustomTitleState(savedTitle);
  }, [mounted]);

  const setAnniversaryDate = (date: string) => {
    setAnniversaryDateState(date);
    localStorage.setItem("loved_anniversary", date);
    fetch("/api/couple", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ anniversaryDate: date }),
    }).catch((err) => console.error("Failed to sync anniversaryDate to DB:", err));
  };

  const setCustomTitle = (title: string) => {
    setCustomTitleState(title);
    localStorage.setItem("loved_title", title);
    fetch("/api/couple", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customTitle: title }),
    }).catch((err) => console.error("Failed to sync customTitle to DB:", err));
  };

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
