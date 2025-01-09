import { useState } from "react";
import Head from 'next/head';

function Analyze() {
  const [result, setResult] = useState(null);

  // ฟังก์ชันจัดการเมื่อกดปุ่ม
  const handleAnalyze = (status) => {
    if (status === "healthy") {
      setResult("ผลการวิเคราะห์: ไม่พบโรค");
    } else if (status === "disease") {
      setResult("ผลการวิเคราะห์: พบโรค");
    }
  };

  return (
    <>
      <Head>
        <title>วิเคราะห์โรค</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="min-h-screen">
        <h1 className="text-center text-2xl md:text-4xl font-bold py-4 px-4 text-white">วิเคราะห์โรค</h1>

        <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
          {/* ปุ่มเลือกผลการวิเคราะห์ */}
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => handleAnalyze("healthy")}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              ไม่เป็นโรครากเน่า
            </button>
            <button
              onClick={() => handleAnalyze("disease")}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              เป็นโรครากเน่า
            </button>
          </div>

          {/* แสดงผลการวิเคราะห์ */}
          {result && (
            <div
              className={`mt-6 p-4 rounded-lg ${
                result.includes("ไม่พบ")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {result}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Analyze;
