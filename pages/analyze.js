import { useEffect, useState } from "react";
import Head from "next/head";
import authurize from "@/lib/auth";
import { Button } from "@/components/ui/button";
import * as tmImage from "@teachablemachine/image";
import { useRouter } from "next/router";  // นำเข้า useRouter

function Analyze() {
  const [imagePreview, setImage] = useState();    // เก็บรูปภาพที่เลือก
  const [prediction, setPrediction] = useState(null);  // เก็บผลการทำนาย
  const [model, setModel] = useState(null);  // เก็บโมเดล
  const [maxPredictions, setMaxPredictions] = useState(0);  // จำนวนคลาสที่โมเดลรองรับ
  const router = useRouter();  // ใช้ useRouter สำหรับการเปลี่ยนหน้า

  // ฟังก์ชันที่จัดการการเลือกไฟล์ภาพ
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const image = reader.result;
        setImage(image);   // แสดงภาพที่เลือก
        localStorage.setItem("image", image);
      };
      reader.readAsDataURL(file);
    }
  };

  // โหลดโมเดลจาก Teachable Machine
  useEffect(() => {
    const savedImage = localStorage.getItem("image");
    if (savedImage) {
      setImage(savedImage);
    }

    const loadModel = async () => {
      const URL = "./my_model/"; // ที่อยู่ของโมเดล
      const modelURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";

      const model = await tmImage.load(modelURL, metadataURL);
      setModel(model);
      setMaxPredictions(model.getTotalClasses());
    };

    loadModel();
  }, []);

  // ฟังก์ชันทำนายผล
  const predictImage = async (image) => {
    if (model && image) {
      const img = new Image();
      img.src = image;

      img.onload = async () => {
        const prediction = await model.predict(img);
        setPrediction(prediction);  // แสดงผลการทำนาย
        handleResultRedirect(prediction);  // ตรวจสอบผลและนำทาง
      };
    }
  };

  // ฟังก์ชันที่ตรวจสอบผลลัพธ์แล้วนำทางไปยังหน้าอื่นๆ
  const handleResultRedirect = (prediction) => {
    if (prediction) {
      // ค้นหาผลลัพธ์ที่มีความน่าจะเป็นสูงสุด
      const highestPrediction = prediction.reduce((prev, current) => (prev.probability > current.probability ? prev : current));
      
      if (highestPrediction.className === "Healthy") {
        router.push("/notfound_result");  // ส่งไปหน้าที่ไม่พบโรค
      } else if (highestPrediction.className === "Diseased") {
        router.push("/found_result");  // ส่งไปหน้าที่พบโรค
      }
    }
  };

  // ฟังก์ชันที่ป้องกันไม่ให้หน้ารีเฟรช
  const handleAnalyzeClick = (e) => {
    e.preventDefault();  // ป้องกันการรีเฟรชหน้า
    if (imagePreview) {
      predictImage(imagePreview);  // เรียกฟังก์ชันทำนาย
    }
  };

  return (
    <>
      <Head>
        <title>Disease analysis</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <form>
        <div className="min-h-screen">
          <h1 className="text-center text-3xl md:text-5xl font-bold py-4 px-4 text-white">
            Durian Epidemic Geospatial Report System
          </h1>
          <h1 className="text-center text-2xl md:text-4xl font-bold py-4 px-4 text-white">
            Disease analysis
          </h1>

          <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
            <div className="mb-6">
              <div className="mt-4 text-center">
                {imagePreview && <img src={imagePreview} alt="Uploaded" className="w-full h-auto" />}
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mb-4 w-full py-2 px-4 border rounded-lg"
              />
              <div className="flex flex-col justify-center items-center">
                <Button onClick={handleAnalyzeClick}>Analyze</Button>
              </div>

              {prediction && (
                <div className="mt-4">
                  <h3 className="text-xl font-bold">Prediction Result</h3>
                  {prediction.map((pred, index) => (
                    <div key={index}>
                      {pred.className}: {pred.probability.toFixed(2)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default authurize(Analyze);
