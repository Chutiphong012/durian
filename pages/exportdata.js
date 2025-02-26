import { useState, useEffect } from "react";
import { utils, writeFile } from "xlsx";
import Head from "next/head";

function ExportDetection() {
  const [detectionData, setDetectionData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    fetch("http://localhost/durian/database/getDetection.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setDetectionData(data.data);
          setFilteredData(data.data);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  const filterData = (month, year) => {
    let filtered = detectionData;

    if (month) {
      filtered = filtered.filter((item) => {
        const itemMonth = new Date(item.date).getMonth() + 1;
        return itemMonth === parseInt(month);
      });
    }

    if (year) {
      filtered = filtered.filter((item) => {
        const itemYear = new Date(item.date).getFullYear();
        return itemYear === parseInt(year);
      });
    }

    setFilteredData(filtered);
  };

  const filterByMonth = (month) => {
    setSelectedMonth(month);
    filterData(month, selectedYear);
  };

  const filterByYear = (year) => {
    setSelectedYear(year);
    filterData(selectedMonth, year);
  };

  const exportToCSV = () => {
    if (filteredData.length === 0) {
      alert("No data to export!");
      return;
    }

    const ws = utils.json_to_sheet(filteredData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, `Detections_${selectedMonth || "All"}_${selectedYear || "All"}`);
    writeFile(wb, `detection_data_${selectedMonth || "All"}_${selectedYear || "All"}.xlsx`);
  };

  return (
    <>
      <Head>
        <title>Show disease location</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="min-h-screen flex flex-col justify-start items-center py-4">
        <h1 className="text-center text-3xl md:text-5xl font-bold py-4 px-4 text-white">
          Durian Epidemic Geospatial Report System
        </h1>
        <h1 className="text-center text-2xl md:text-4xl font-bold py-4 px-4 text-white">
          Export Detection Data
        </h1>

        <div className="mt-6 flex flex-col items-center">
          <label className="mb-4 font-semibold text-white">
            Select Month:
            <select
              value={selectedMonth}
              onChange={(e) => filterByMonth(e.target.value)}
              className="ml-2 p-2 border rounded-md text-black"
            >
              <option value="">All</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("en", { month: "long" })}
                </option>
              ))}
            </select>
          </label>

          <label className="mb-4 font-semibold text-white">
            Select Year:
            <select
              value={selectedYear}
              onChange={(e) => filterByYear(e.target.value)}
              className="ml-2 p-2 border rounded-md text-black"
            >
              <option value="">All</option>
              {[...Array(11)].map((_, i) => {
                const year = 2020 + i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </label>

          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-[#859F3D] text-white rounded-md hover:bg-yellow-600"
          >
            Export to Excel
          </button>
        </div>

        <div className="mt-6 w-full max-w-4xl">
          <h2 className="text-xl font-semibold mb-2 text-white">Detection Data</h2>
          <table className="border-collapse border border-gray-500 w-full text-center">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Username</th>
                <th className="border px-4 py-2">Severity Level</th>
                <th className="border px-4 py-2">Latitude</th>
                <th className="border px-4 py-2">Longitude</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={index} className="text-center text-white">
                    <td className="border px-4 py-2">{item.date}</td>
                    <td className="border px-4 py-2">{item.username}</td>
                    <td className="border px-4 py-2">{item.svt_lvl}</td>
                    <td className="border px-4 py-2">{item.latitude_detec}</td>
                    <td className="border px-4 py-2">{item.longitude_detec}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="border px-4 py-2 text-white">
                    No data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default ExportDetection;
