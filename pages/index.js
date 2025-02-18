import { useState, useEffect } from "react";
import Head from 'next/head';

const Home = () => {
  const [province, setProvince] = useState("กรุงเทพมหานคร");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingCurrent, setLoadingCurrent] = useState(false);
  const [provinces, setProvinces] = useState([
    "กรุงเทพมหานคร", "กระบี่", "กาญจนบุรี", "กาฬสินธุ์", "กำแพงเพชร", "ขอนแก่น", "จันทบุรี",
    "ฉะเชิงเทรา", "ชัยนาท", "ชัยภูมิ", "ชุมพร", "ชลบุรี", "เชียงใหม่", "เชียงราย", "นครนายก", 
    "นครปฐม", "นครพนม", "นครราชสีมา", "นครศรีธรรมราช", "นนทบุรี", "นราธิวาส", "หนองคาย", 
    "หนองบัวลำภู", "อยุธยา", "อุดรธานี", "อุตรดิตถ์", "อุบลราชธานี", "ประจวบคีรีขันธ์", 
    "ปราจีนบุรี", "ปัตตานี", "พระนครศรีอยุธยา", "พะเยา", "เพชรบุรี", "เพชรบูรณ์", "แม่ฮ่องสอน", 
    "ยะลา", "ยโสธร", "ระนอง", "ระยอง", "ราชบุรี", "ลพบุรี", "ลำปาง", "ลำพูน", "เลย", "ศรีสะเกษ", 
    "สกลนคร", "สงขลา", "สมุทรปราการ", "สมุทรสงคราม", "สมุทรสาคร", "สระแก้ว", "สระบุรี", 
    "สิงห์บุรี", "สุโขทัย", "สุพรรณบุรี", "สุราษฎร์ธานี", "สุรินทร์", "สตูล", "สงขลา", "สุราษฎร์ธานี", 
    "อำนาจเจริญ", "อุดรธานี", "อุบลราชธานี", "พัทลุง"
  ]);

  useEffect(() => {
    setLoadingCurrent(true);
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${province}&units=metric&lang=th&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        setCurrentWeather(data);
        setLoadingCurrent(false);
      })
      .catch(() => setLoadingCurrent(false));
  }, [province]);

  useEffect(() => {
    setLoading(true);
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${province}&units=metric&lang=th&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`)
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
    return new Date(dateString).toLocaleDateString("th-TH", options);
  };

  return (
    <>
      <Head>
        <title>หน้าหลัก</title>
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
                <p className="text-center text-lg md:text-xl">กำลังโหลดข้อมูลสภาพอากาศขณะนี้...</p>
              ) : currentWeather && currentWeather.main ? (
                <div className="mb-6 text-black">
                  <h1 className="text-6xl text-white">อากาศ{province}วันนี้ ➣ </h1>
                </div>
              ) : (
                <p className="text-center text-lg md:text-xl">ไม่พบข้อมูลสภาพอากาศขณะนี้</p>
              )}
            </div>

            {/* สภาพอากาศขณะนี้ */}
            <div className="flex-1 text-center md:text-start">
              {loadingCurrent ? (
                <p className="text-center text-lg md:text-xl">กำลังโหลดข้อมูลสภาพอากาศขณะนี้...</p>
              ) : currentWeather && currentWeather.main ? (
                <div className="mb-6 border rounded-lg p-4 shadow-md text-black bg1 max-w-md mx-auto">
                  <h2 className="text-xl font-bold mb-2">สภาพอากาศขณะนี้</h2>
                  <p className="text-lg md:text-xl">🚩 จังหวัด: {province}</p>
                  <p className="text-lg md:text-xl">🌡️ อุณหภูมิ: {currentWeather.main.temp} °C</p>
                  <p className="text-lg md:text-xl">💧 ความชื้น: {currentWeather.main.humidity}%</p>
                  <p className="text-lg md:text-xl">🌥️ สภาพอากาศ: {currentWeather.weather[0].description}</p>
                  <div className="flex justify-center items-center">
                    <img
                      src={`http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
                      alt={currentWeather.weather[0].description}
                      className="w-12 h-12"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-center text-lg md:text-xl">ไม่พบข้อมูลสภาพอากาศขณะนี้</p>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-lg md:text-xl">กำลังโหลดข้อมูลพยากรณ์อากาศ...</p>
        ) : Object.keys(forecast).length === 0 ? (
          <p className="text-center text-lg md:text-xl">ไม่พบข้อมูลพยากรณ์อากาศ</p>
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
                          <p className="text-lg md:text-xl">⏰ เวลา: {item.dt_txt.split(" ")[1]}</p>
                          <p className="text-lg md:text-xl">🌡️ อุณหภูมิ: {item.main.temp} °C</p>
                          <p className="text-lg md:text-xl">💧 ความชื้น: {item.main.humidity}%</p>
                          <p className="text-lg md:text-xl">🌥️ สภาพอากาศ: {item.weather[0].description}</p>
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
