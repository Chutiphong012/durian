import { useEffect, useState } from "react";
import Head from "next/head";
import authurize from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
// import { UploadButton } from "@/components/ui/uploadButton";


function Analyze() {
const [imagePreview, setImage] = useState();

const handleFileChange = (e) => {
  const file = e.target.files[0]; // Get the selected file

  if (file) {
    const reader = new FileReader();

    // Set up the file reader to load the file and set the preview
    reader.onloadend = () => {
      const image = reader.result;
      setImage(image); // Set the result as the image preview

      // Save the base64 image in localStorage
      localStorage.setItem("image", image);
    };

    reader.readAsDataURL(file);
  }
};
  // ฟังก์ชันจัดการเมื่อกดปุ่ม
 
  useEffect(()=>{
    const savedImage = localStorage.getItem("image");
    if(savedImage){
      setImage(savedImage);
    }
  },[])
 
  return (
    <>
      <Head>
        <title>วิเคราะห์โรค</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
<form>
      <div className="min-h-screen">
      <h1 className="text-center text-3xl md:text-5xl font-bold py-4 px-4 text-white">
        Durian Epidemic Geospatial Report System
      </h1>
        <h1 className="text-center text-2xl md:text-4xl font-bold py-4 px-4 text-white">
          วิเคราะห์โรค
        </h1>

        <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
          <div className="mb-6">
            
              <div className="mt-4 text-center">
                {/* <h3>ตัวอย่างรูปภาพ:</h3> */}
                <img src={imagePreview} alt="Uploaded" className="w-full h-auto" />
              </div>
            
              <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mb-4 w-full py-2 px-4 border rounded-lg"
                />
           <div className="flex flex-col justify-center items-center"><Button >วิเคราะห์โรค</Button>
           </div>
            
          </div>
          {/* ปุ่มเลือกผลการวิเคราะห์ */}
          <div className="flex justify-center space-x-4 mb-6">
            <a href="/notfound_result">
            <button
             type="button"
             
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              ไม่เป็นโรครากเน่า
            </button>
            </a>
            
            <a href="/found_result">
            <button
            type="button"
             
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              เป็นโรครากเน่า
            </button>
            </a>
            
          </div>

         
         
        </div>
        
      </div>
      </form>
      <Toaster />
    </>
  );
}

export default authurize(Analyze);
