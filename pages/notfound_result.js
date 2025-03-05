import { useState, useEffect } from "react";
import Head from "next/head";
import authurize from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const treatmentMethods = {
  ระยะเริ่มต้น:
    "ใช้สารฟอสโฟนิก แอซิด 40% เอสแอล ผสมน้ำสะอาด อัตรา 1:1 ฉีดเข้าลำต้น หรือราดดินด้วยสารฟอสอีทิล-อะลูมิเนียม 80% ดับเบิ้ลยูพี อัตรา 30-50 กรัมต่อน้ำ 20 ลิตร",
  ระยะกลาง:
    "ถากหรือขูดผิวเปลือกบริเวณที่เป็นโรคออก แล้วทาแผลด้วยฟอสอีทิล-อะลูมิเนียม 80% ดับเบิ้ลยูพี (80-100 กรัมต่อน้ำ 1 ลิตร) หรือเมทาแลกซิล 25% ดับเบิ้ลยูพี (50-60 กรัมต่อน้ำ 1 ลิตร)",
  ระยะรุนแรง:
    "ขุดต้นที่เป็นโรครุนแรงออกและเผาทำลายนอกแปลงปลูก ใส่ปูนขาวและตากดิน ก่อนปรับปรุงดินด้วยปุ๋ยคอกหรือปุ๋ยหมักเพื่อเตรียมปลูกใหม่",
};

const symtomMap = [
  {
    severity: "ระยะเริ่มต้น",
    symtom:
      "ใบเปลี่ยนเป็นสีเหลืองซีด ลำต้น กิ่ง รากมีสีของเปลือกที่เข้มเป็นจุดฉ่ำน้ำ",
  },
  {
    severity: "ระยะกลาง",
    symtom: "ใบของจะเริ่มร่วงแผลบริเวณราก ลำต้นและกิ่งมีขนาดใหญ่",
  },
  {
    severity: "ระยะรุนแรง",
    symtom: "ใบร่วงเยอะหรือร่วงจนหมดต้น รากเสียหายอย่างหนัก ลำต้นเน่ายืนต้นตาย",
  },
];

function Analyze() {
  const [result, setResult] = useState("");
  const [status, setStatus] = useState("");
  const [selectedStage, setSelectedStage] = useState("");
  const { toast } = useToast();
  const [image, setImage] = useState();

  useEffect(() => {
    const savedImage = localStorage.getItem("image");
    if (savedImage) {
      setImage(savedImage);
    }
  }, []);

  const disease_record = async (e) => {
    e.preventDefault();
    const treatment = treatmentMethods[selectedStage];
    const res = await fetch("http://localhost/durian/database/detect.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: localStorage.getItem("userId"),
        severity_lvl: selectedStage,
        treatment: treatment,
      }),
    });

    if (res.ok) {
      toast({
        title: "แจ้งเตือน",
        description: "เพิ่มสำเร็จ",
      });
    } else {
      toast({
        title: "แจ้งเตือน",
        description: "เพิ่มไม่สำเร็จ",
      });
      const data = await res.json();
      console.log(data.message);
    }
  };

  const handleChange = (value) => {
    setSelectedStage(value);
    console.log(value);
  };

  return (
    <>
      <Head>
        <title>Disease analysis</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <form onSubmit={disease_record}>
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
                {image && (
                  <img
                    src={image}
                    alt="Uploaded"
                    className="max-w-[300px] max-h-[300px] mx-auto rounded-lg shadow-md"
                  />
                )}
              </div>
            </div>

            {/* ปุ่มเลือกผลการวิเคราะห์ */}
            <div className="bg-green-200 text-xl p-5 text-center">
              <h1>The analysis results did not detect root rot disease.</h1>
            </div>

            {/* แสดงผลการวิเคราะห์ */}
            {result && (
              <div
                className={`mt-6 p-4 rounded-lg ${
                  result.includes("Not found")
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {result}
              </div>
            )}

            {status == "disease" && (
              <div>
                <RadioGroup
                  className="flex flex-col gap-4 mt-4"
                  value={selectedStage}
                  name="severity"
                  onValueChange={handleChange}
                >
                  {symtomMap.map((items, index) => {
                    return (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={items.severity}
                          name="severity"
                          id={`option-${index}`}
                        />
                        <Label
                          htmlFor={`option-${index}`}
                          style={{ fontSize: "17px" }}
                        >
                          {items.symtom}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            )}
          </div>
        </div>
      </form>
      <Toaster />
    </>
  );
}

export default authurize(Analyze);
