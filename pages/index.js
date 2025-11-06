// --- pages/index.js ---

import { useState, useEffect } from 'react';
import Head from 'next/head';

// API-дан алынған деректерді интерфейске ыңғайлы форматқа ауыстыратын функция
const normalizeData = (apiData) => {
    if (apiData.source === 'OWM') {
        const current = apiData.data.current;
        return {
            temp: Math.round(current.temp),
            wind: Math.round(current.wind_speed),
            humidity: current.humidity,
            pressure: current.pressure,
            source: 'OWM'
        };
    } else if (apiData.source === 'WB') {
        const current = apiData.data.data[0]; // Бірінші элемент - ағымдағы күн
        return {
            temp: Math.round(current.temp),
            wind: Math.round(current.wind_spd),
            humidity: current.rh,
            pressure: current.pres,
            source: 'WB'
        };
    }
    return null;
};

export default function QuantumWeather() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // API Route арқылы деректерді fetch ету
    fetch('/api/weather')
      .then(res => res.json())
      .then(apiData => {
        if (!apiData.error) {
            setData(normalizeData(apiData));
        } else {
            console.error(apiData.error);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch қатесі:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-gray-900 text-white text-3xl font-mono">Quantum...</div>;
  }

  if (!data) {
    return <div className="flex justify-center items-center h-screen bg-red-900 text-white text-3xl font-mono">Quantum Error</div>;
  }
  
  const { temp, wind, humidity, pressure, source } = data;

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      <Head>
        <title>Quantum Weather</title>
      </Head>
      
      {/* Ғарыштық Фон Placeholder */}
      <div className="absolute inset-0 bg-cover bg-center opacity-75" style={{backgroundImage: 'url(/starry_night_placeholder.jpg)'}}></div>
      <div className="relative z-10 p-8 pt-16">
        
        {/* Quantum Тақырыбы */}
        <h1 className="text-8xl font-extrabold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 tracking-wider font-mono">
          Quantum
        </h1>

        {/* Негізгі Температура */}
        <div className="text-center bg-black bg-opacity-60 p-8 rounded-3xl max-w-lg mx-auto backdrop-blur-sm shadow-2xl border border-blue-500/50">
          
          <p className="text-9xl font-extralight mb-4">
            {temp}<span className="text-5xl align-top">°C</span>
          </p>
          
          {/* Қосымша Параметрлер (Иконкалар) */}
          <div className="mt-8 grid grid-cols-3 gap-6 text-2xl font-mono">
            <div>
                <p>🌬️</p>
                <p className="mt-1">{wind} m/s</p>
            </div>
            <div>
                <p>💧</p>
                <p className="mt-1">{humidity}%</p>
            </div>
            <div>
                <p>⬇️</p>
                <p className="mt-1">{pressure} hPa</p>
            </div>
          </div>
          
          {/* Дерек Көзі */}
          <p className="mt-6 text-xs opacity-50">Source: {source}</p>
        </div>

        {/* 7 Күндік Болжам Түймесі */}
        <div className="text-center mt-12">
            <button className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-full text-xl font-bold transition duration-300 shadow-lg shadow-purple-500/50">
                D+7
            </button>
        </div>
        
        {/* Quantum Audio Player Placeholder */}
        <div className="mt-16 text-center">
            <p className="text-lg opacity-80">
                🎶 Quantum Player is here.
            </p>
        </div>
        
      </div>
    </div>
  );
}
