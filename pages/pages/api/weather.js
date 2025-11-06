// --- pages/api/weather.js ---

// Баян-Өлгий координаталары
const LAT = 48.97; 
const LON = 89.97;

export default async function handler(req, res) {
  // API кілттерін Netlify Environment Variables-дан аламыз
  const OWM_API_KEY = process.env.OWM_API_KEY;
  const WB_API_KEY = process.env.WB_API_KEY;

  let finalData = null;

  // --- 1-Әдіс: OpenWeatherMap ---
  if (OWM_API_KEY) {
    const owm_url = `https://api.openweathermap.org/data/2.5/onecall?lat=${LAT}&lon=${LON}&exclude=minutely,alerts&units=metric&appid=${OWM_API_KEY}&lang=kz`;
    try {
      const owm_response = await fetch(owm_url);
      const owm_data = await owm_response.json();

      if (owm_response.ok && owm_data.current) {
        finalData = { source: 'OWM', data: owm_data };
      }
    } catch (error) {
      console.error("OWM API шақыруы сәтсіз аяқталды.");
    }
  }

  // --- 2-Әдіс: Weatherbit (Егер OWM істемесе) ---
  if (!finalData && WB_API_KEY) {
    const wb_url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${LAT}&lon=${LON}&units=M&key=${WB_API_KEY}&days=7`;
    
    try {
      const wb_response = await fetch(wb_url);
      const wb_data = await wb_response.json();

      if (wb_response.ok && wb_data.data) {
        finalData = { source: 'WB', data: wb_data };
      }
    } catch (error) {
      console.error("Weatherbit API шақыруы сәтсіз аяқталды.");
    }
  }

  // --- Нәтижені Жіберу ---
  if (finalData) {
    res.status(200).json(finalData);
  } else {
    res.status(503).json({ 
      error: 'Quantum Error: Екі дерек көзінен де деректерді алу мүмкін емес.', 
      status: 503 
    });
  }
}
