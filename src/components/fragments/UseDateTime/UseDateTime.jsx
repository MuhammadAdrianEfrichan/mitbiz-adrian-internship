// src/hooks/useDateTime.js
import { useState, useEffect } from "react";

const UseDateTime= ()=> {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000); // update tiap 1 detik

    return () => clearInterval(interval); // cleanup saat unmount
  }, []);

  return dateTime;
}

export default UseDateTime;