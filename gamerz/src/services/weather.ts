export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  rainProbability: number;
  condition: 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy' | 'stormy' | 'foggy';
  conditionText: string;
  isRaining: boolean;
  uvIndex: number;
  dailyRainMm: number;
}

export interface DayForecast {
  date: string;
  dateLabel: string;
  dayName: string;
  tempMax: number;
  tempMin: number;
  condition: WeatherData['condition'];
  conditionText: string;
  rainProbability: number;
  rainMm: number;
  windSpeed: number;
  uvIndex: number;
  farmAdvice: string;
}

export interface HourlyPoint {
  hour: string;
  temperature: number;
  rainProbability: number;
  condition: WeatherData['condition'];
  conditionText: string;
}

function wmoToCondition(code: number): { condition: WeatherData['condition']; text: string } {
  if (code === 0) return { condition: 'sunny', text: 'Clear Sky' };
  if (code <= 2) return { condition: 'partly-cloudy', text: 'Partly Cloudy' };
  if (code === 3) return { condition: 'cloudy', text: 'Overcast' };
  if (code <= 49) return { condition: 'foggy', text: 'Foggy' };
  if (code <= 82) return { condition: 'rainy', text: 'Rainy' };
  return { condition: 'stormy', text: 'Thunderstorm' };
}

export async function getWeather(lat = 12.9716, lon = 77.5946): Promise<WeatherData> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,uv_index&hourly=precipitation_probability&daily=precipitation_sum&timezone=Asia%2FKolkata&forecast_days=1`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather API failed');
    const data = await res.json();
    const cur = data.current;
    const w = wmoToCondition(cur.weather_code ?? 0);
    const probs: number[] = data.hourly?.precipitation_probability?.slice(0, 6) ?? [];
    return {
      temperature: Math.round(cur.temperature_2m ?? 28),
      feelsLike: Math.round(cur.apparent_temperature ?? 30),
      humidity: Math.round(cur.relative_humidity_2m ?? 65),
      windSpeed: Math.round(cur.wind_speed_10m ?? 10),
      rainProbability: probs.length ? Math.round(Math.max(...probs)) : 0,
      condition: w.condition,
      conditionText: w.text,
      isRaining: (cur.precipitation ?? 0) > 0,
      uvIndex: Math.round(cur.uv_index ?? 5),
      dailyRainMm: Math.round((data.daily?.precipitation_sum?.[0] ?? 0) * 10) / 10,
    };
  } catch {
    return { temperature: 28, feelsLike: 31, humidity: 68, windSpeed: 12, rainProbability: 35, condition: 'partly-cloudy', conditionText: 'Partly Cloudy', isRaining: false, uvIndex: 6, dailyRainMm: 0 };
  }
}

export function getWateringAdvice(w: WeatherData, lang: string): string {
  const { rainProbability, isRaining, humidity, temperature } = w;
  const t: Record<string, [string, string, string, string]> = {
    en: [
      `☔ Skip watering — rain expected (${rainProbability}% chance). Let nature water your crops!`,
      `🌤️ Reduce watering by 50% — humidity is high (${humidity}%). Water early morning only.`,
      `☀️ Increase watering — high temperature (${temperature}°C) causes fast evaporation. Water twice daily.`,
      `🌱 Normal watering schedule recommended. Best time: 6–8 AM to minimize evaporation.`,
    ],
    kn: [
      `☔ ನೀರು ಹಾಕಬೇಡಿ — ಮಳೆ ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ (${rainProbability}%).`,
      `🌤️ ನೀರಾವರಿ 50% ಕಡಿಮೆ ಮಾಡಿ — ತೇವಾಂಶ (${humidity}%). ಬೆಳಿಗ್ಗೆ ಮಾತ್ರ.`,
      `☀️ ಹೆಚ್ಚು ನೀರು — ಹೆಚ್ಚಿನ ತಾಪಮಾನ (${temperature}°C). ದಿನಕ್ಕೆ ಎರಡು ಬಾರಿ.`,
      `🌱 ಸಾಮಾನ್ಯ ನೀರಾವರಿ ಸೂಕ್ತ. ಬೆಳಿಗ್ಗೆ 6–8 ಗಂಟೆ ಉತ್ತಮ.`,
    ],
    hi: [
      `☔ पानी न दें — बारिश की संभावना (${rainProbability}%). प्रकृति को काम करने दें!`,
      `🌤️ पानी 50% कम करें — नमी अधिक (${humidity}%). केवल सुबह पानी दें.`,
      `☀️ अधिक पानी दें — उच्च तापमान (${temperature}°C). दिन में दो बार सिंचाई.`,
      `🌱 सामान्य सिंचाई अनुसूची। सुबह 6–8 बजे पानी दें.`,
    ],
    ta: [
      `☔ நீர் பாய்ச்சல் வேண்டாம் — மழை எதிர்பார்க்கப்படுகிறது (${rainProbability}%).`,
      `🌤️ நீர்ப்பாசனம் 50% குறைக்கவும் — ஈரப்பதம் (${humidity}%). காலையில் மட்டும்.`,
      `☀️ அதிக நீர் பாய்ச்சவும் — வெப்பநிலை (${temperature}°C). நாளில் இரு முறை.`,
      `🌱 சாதாரண நீர்ப்பாசன அட்டவணை. காலை 6–8 மணி சிறந்தது.`,
    ],
  };
  const msgs = t[lang] ?? t.en;
  if (isRaining || rainProbability >= 70) return msgs[0];
  if (humidity >= 75 || rainProbability >= 40) return msgs[1];
  if (temperature >= 35) return msgs[2];
  return msgs[3];
}

function farmAdviceForDay(rain: number, rainMm: number, tempMax: number): string {
  if (rain >= 70 || rainMm > 5) return '☔ Heavy rain expected — skip irrigation, ensure field drainage, delay fertilizer application.';
  if (rain >= 40) return '🌧️ Light rain likely — reduce watering, good day to apply foliar fertilizers.';
  if (tempMax >= 38) return '🌡️ Very hot day — water crops twice (early AM & evening), apply mulch to conserve moisture.';
  if (tempMax >= 33) return '☀️ Warm and dry — maintain normal irrigation, monitor for heat stress on young plants.';
  return '🌱 Favorable conditions — ideal for field work, sowing, or pesticide application.';
}

export async function getFullForecast(lat = 12.9716, lon = 77.5946): Promise<{
  current: WeatherData;
  daily: DayForecast[];
  hourly: HourlyPoint[];
}> {
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,uv_index` +
      `&hourly=temperature_2m,precipitation_probability,weather_code` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max` +
      `&timezone=Asia%2FKolkata&forecast_days=7`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Forecast API failed');
    const data = await res.json();
    const cur = data.current;
    const curW = wmoToCondition(cur.weather_code ?? 0);
    const hProbs: number[] = data.hourly?.precipitation_probability ?? [];

    const current: WeatherData = {
      temperature: Math.round(cur.temperature_2m ?? 28),
      feelsLike: Math.round(cur.apparent_temperature ?? 30),
      humidity: Math.round(cur.relative_humidity_2m ?? 65),
      windSpeed: Math.round(cur.wind_speed_10m ?? 10),
      rainProbability: hProbs.length ? Math.round(Math.max(...hProbs.slice(0, 6))) : 0,
      condition: curW.condition,
      conditionText: curW.text,
      isRaining: (cur.precipitation ?? 0) > 0,
      uvIndex: Math.round(cur.uv_index ?? 5),
      dailyRainMm: Math.round((data.daily?.precipitation_sum?.[0] ?? 0) * 10) / 10,
    };

    const daily: DayForecast[] = (data.daily?.time ?? []).map((date: string, i: number) => {
      const w = wmoToCondition(data.daily.weather_code[i] ?? 0);
      const rain = data.daily.precipitation_probability_max[i] ?? 0;
      const rainMm = Math.round((data.daily.precipitation_sum[i] ?? 0) * 10) / 10;
      const tempMax = Math.round(data.daily.temperature_2m_max[i] ?? 28);
      const tempMin = Math.round(data.daily.temperature_2m_min[i] ?? 22);
      const d = new Date(date);
      return {
        date,
        dateLabel: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
        dayName: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-IN', { weekday: 'short' }),
        tempMax,
        tempMin,
        condition: w.condition,
        conditionText: w.text,
        rainProbability: rain,
        rainMm,
        windSpeed: Math.round(data.daily.wind_speed_10m_max[i] ?? 10),
        uvIndex: Math.round(data.daily.uv_index_max[i] ?? 5),
        farmAdvice: farmAdviceForDay(rain, rainMm, tempMax),
      };
    });

    // Hourly for today only (24 points)
    const hourlyTemps: number[] = data.hourly?.temperature_2m ?? [];
    const hourlyCodes: number[] = data.hourly?.weather_code ?? [];
    const hourlyProbs: number[] = data.hourly?.precipitation_probability ?? [];
    const now = new Date();
    const hourly: HourlyPoint[] = Array.from({ length: 24 }, (_, i) => {
      const h = new Date(now);
      h.setHours(i, 0, 0, 0);
      const w = wmoToCondition(hourlyCodes[i] ?? 0);
      return {
        hour: h.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
        temperature: Math.round(hourlyTemps[i] ?? 28),
        rainProbability: hourlyProbs[i] ?? 0,
        condition: w.condition,
        conditionText: w.text,
      };
    });

    return { current, daily, hourly };
  } catch {
    // Sensible fallback
    const fallbackCurrent: WeatherData = { temperature: 28, feelsLike: 31, humidity: 68, windSpeed: 12, rainProbability: 35, condition: 'partly-cloudy', conditionText: 'Partly Cloudy', isRaining: false, uvIndex: 6, dailyRainMm: 0 };
    const days = ['Today', 'Tomorrow', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const fallbackDaily: DayForecast[] = days.map((day, i) => ({
      date: new Date(Date.now() + i * 86400000).toISOString().slice(0, 10),
      dateLabel: new Date(Date.now() + i * 86400000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      dayName: day, tempMax: 30 + i, tempMin: 22 + i, condition: i % 3 === 0 ? 'rainy' : 'partly-cloudy',
      conditionText: i % 3 === 0 ? 'Rainy' : 'Partly Cloudy', rainProbability: i % 3 === 0 ? 70 : 25,
      rainMm: i % 3 === 0 ? 4 : 0, windSpeed: 12, uvIndex: 6,
      farmAdvice: i % 3 === 0 ? '☔ Rain expected — skip irrigation.' : '🌱 Good conditions for field work.',
    }));
    const fallbackHourly: HourlyPoint[] = Array.from({ length: 24 }, (_, i) => ({
      hour: `${String(i).padStart(2, '0')}:00`, temperature: 24 + Math.round(8 * Math.sin(((i - 6) * Math.PI) / 12)),
      rainProbability: i >= 14 && i <= 18 ? 60 : 20, condition: 'partly-cloudy', conditionText: 'Partly Cloudy',
    }));
    return { current: fallbackCurrent, daily: fallbackDaily, hourly: fallbackHourly };
  }
}
