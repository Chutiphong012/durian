import { useEffect, useState } from "react";
import Head from "next/head";
import authurize from "@/lib/auth";
import { Button } from "@/components/ui/button";
import axios from "axios"; 
import { useRouter } from "next/router";

function Analyze() {
  const [imagePreview, setImage] = useState(null); 
  const [prediction, setPrediction] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const router = useRouter();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const image = reader.result;
        setImage(image);
        localStorage.setItem("image", image);
      };
      reader.readAsDataURL(file);
    }
  };

  const predictImage = async (image) => {
    if (!image) return;

    setLoading(true); 
    try {
      const base64Data = image.split(",")[1];

      const response = await axios({
        method: "POST",
        url: "https://classify.roboflow.com/durian-vit/1",
        params: { api_key: "IHcTEO7m5F6EcTmXZlOD" },
        data: base64Data,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const predictions = response.data.predictions;
      console.log("Predictions:", predictions);
      
      setLoading(false); 
      if (predictions.length > 0) {
        handleResultRedirect(predictions);
      } else {
        console.error("No predictions found.");
      }
    } catch (error) {
      console.error("Error predicting image:", error);
      setLoading(false); 
    }
  };

  const handleResultRedirect = (predictions) => {
    const highestPrediction = predictions.reduce((prev, current) =>
      prev.confidence > current.confidence ? prev : current
    );

    if (highestPrediction.class === "Healthy") {
      router.push("/notfound_result");
    } else if (highestPrediction.class === "Diseased") {
      router.push("/found_result");
    }
  };

  const handleAnalyzeClick = (e) => {
    e.preventDefault();
    if (imagePreview) {
      predictImage(imagePreview);
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
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Uploaded"
                    className="max-w-[300px] max-h-[300px] mx-auto rounded-lg shadow-md"
                  />
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mb-4 w-full py-2 px-4 border rounded-lg"
              />

              <div className="flex flex-col justify-center items-center">
                <Button onClick={handleAnalyzeClick} disabled={loading}>
                  {loading ? "Loading..." : "Analyze"}
                </Button>
              </div>

              {prediction && (
                <div className="mt-4">
                  <h3 className="text-xl font-bold">Prediction Result</h3>
                  {prediction.map((pred, index) => (
                    <div key={index}>
                      {pred.class}: {pred.confidence.toFixed(2)}
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
