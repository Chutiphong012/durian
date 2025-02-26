import { useState, useEffect } from "react";
import Head from 'next/head';

const Home = () => {
  const [province, setProvince] = useState("Bangkok");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingCurrent, setLoadingCurrent] = useState(false);
  const [provinces, setProvinces] = useState([
    "Bangkok", "Krabi", "Kanchanaburi", "Kalasin", "Kamphaeng Phet", "Khon Kaen", "Chanthaburi",
    "Chachoengsao", "Chai Nat", "Chaiyaphum", "Chumphon", "Chonburi", "Chiang Mai", "Chiang Rai", "Nakhon Nayok",
    "Nakhon Pathom", "Nakhon Phanom", "Nakhon Ratchasima", "Nakhon Si Thammarat", "Nonthaburi", "Narathiwat", "Nong Khai",
    "Nong Bua Lamphu", "Ayutthaya", "Udon Thani", "Uttaradit", "Ubon Ratchathani", "Prachuap Khiri Khan",
    "Prachin Buri", "Pattani", "Phra Nakhon Si Ayutthaya", "Phayao", "Phetchaburi", "Phetchabun", "Mae Hong Son",
    "Yala", "Yasothon", "Ranong", "Rayong", "Ratchaburi", "Lopburi", "Lampang", "Lamphun", "Loei", "Sisaket",
    "Sakon Nakhon", "Songkhla", "Samut Prakan", "Samut Songkhram", "Samut Sakhon", "Sa Kaeo", "Saraburi",
    "Singburi", "Sukhothai", "Suphan Buri", "Surat Thani", "Surin", "Satun", "Songkhla", "Surat Thani",
    "Amnat Charoen", "Udon Thani", "Ubon Ratchathani", "Phatthalung"
  ]);

  useEffect(() => {
    setLoadingCurrent(true);
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${province}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&lang=en`)
      .then((res) => res.json())
      .then((data) => {
        setCurrentWeather(data);
        setLoadingCurrent(false);
      })
      .catch(() => setLoadingCurrent(false));
  }, [province]);

  useEffect(() => {
    setLoading(true);
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${province}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&lang=en`)
      .then((res) => res.json())
      .then((data) => {
        const groupedForecast = data.list.reduce((acc, item) => {
          const date = item.dt_txt.split(" ")[0];
          if (!acc[date]) acc[date] = [];
          acc[date].push(item);
          return acc;
        }, {});
        setForecast(groupedForecast);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [province]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-EN", options);
  };

  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
        
      <h1 className="text-center text-3xl md:text-5xl font-bold py-4 px-4 text-white">
        Durian Epidemic Geospatial Report System
      </h1>

      <div className="py-5 px-2">
        <div className="mb-4 flex justify-between items-center flex-col md:flex-row gap-4 md:gap-8">
          <select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 text-lg md:text-xl text-black w-full md:w-auto"
          >
            {provinces.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>
        </div>

        <div className="py-5 px-2">
          <div className="mb-4 flex justify-center items-center flex-col md:flex-row gap-8">
            {/* อากาศวันนี้ */}
            <div className="flex-1 text-center md:text-end">
              {loadingCurrent ? (
                <p className="text-center text-lg md:text-xl">Loading current weather data...</p>
              ) : currentWeather && currentWeather.main ? (
                <div className="mb-6 text-black">
                  <h2 className="text-5xl text-white">Weather {province} to day ➣ </h2>
                </div>
              ) : (
                <p className="text-center text-lg md:text-xl">No weather information found at this time</p>
              )}
            </div>

            {/* สภาพอากาศขณะนี้ */}
            <div className="flex-1 text-center md:text-start">
              {loadingCurrent ? (
                <p className="text-center text-lg md:text-xl">Loading current weather data...</p>
              ) : currentWeather && currentWeather.main ? (
                <div className="mb-6 border rounded-lg p-4 shadow-md text-black bg1 max-w-md mx-auto">
                  <h2 className="text-xl font-bold mb-2">Current weather conditions</h2>
                  <p className="text-lg md:text-xl">🚩 Province: {province}</p>
                  <p className="text-lg md:text-xl">🌡️ Temperature: {currentWeather.main.temp} °C</p>
                  <p className="text-lg md:text-xl">💧 Humidity: {currentWeather.main.humidity}%</p>
                  <p className="text-lg md:text-xl">🌥️ Weather: {currentWeather.weather[0].description}</p>
                  <div className="flex justify-center items-center">
                    <img
                      src={`http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
                      alt={currentWeather.weather[0].description}
                      className="w-12 h-12"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-center text-lg md:text-xl">No weather information found at this time</p>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-lg md:text-xl">Loading current weather data...</p>
        ) : Object.keys(forecast).length === 0 ? (
          <p className="text-center text-lg md:text-xl">No weather forecast information found</p>
        ) : (
          <div>
            {Object.entries(forecast).map(([date, forecasts], index) => {
              // หาวันสุดท้ายและกรองออก
              const lastDate = Object.keys(forecast).length === index + 1;
              if (lastDate) return null; // ไม่แสดงข้อมูลวันสุดท้าย
              return (
                <div key={index} className="mb-6">
                  <h2 className="text-3xl font-bold mb-2 text-white">{formatDate(date)}</h2>
                  <div className="overflow-x-auto">
                    <div className="flex gap-4 w-max">
                      {forecasts.map((item, idx) => (
                        <div
                          key={idx}
                          className="border rounded-lg p-4 shadow-md text-black bg1 max-w-[500px] w-[600px]"
                        >
                          <p className="text-lg md:text-xl">⏰ Time: {item.dt_txt.split(" ")[1]}</p>
                          <p className="text-lg md:text-xl">🌡️ Temperature: {item.main.temp} °C</p>
                          <p className="text-lg md:text-xl">💧 Humidity: {item.main.humidity}%</p>
                          <p className="text-lg md:text-xl">🌥️ Weather: {item.weather[0].description}</p>
                          <div className="flex justify-center items-center">
                            <img
                              src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                              alt={item.weather[0].description}
                              className="w-12 h-12"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
