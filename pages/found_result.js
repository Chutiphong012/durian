"use client";
import { useState,useEffect } from "react";
import Head from "next/head";
import authurize from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
// import { UploadButton } from "@/components/ui/uploadButton";

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
  const [isSubmit, setIsSubmit] = useState(false);
  const [treatment, setTreatment] = useState("");
  const [selectedStage, setSelectedStage] = useState("");
  const { toast } = useToast();
  const [imagePreview, setImage] = useState();

  useEffect(() => {
    const savedImage = localStorage.getItem("image");
    if (savedImage) {
      setImage(savedImage);
    }
  }, []);

  const disease_record = async (e) => {
    e.preventDefault();
    const treatmentText = treatmentMethods[selectedStage];
    try {
      const res = await fetch("http://localhost/durian/database/detect.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: localStorage.getItem("userId"),
          severity_lvl: selectedStage,
          treatment: treatmentText,
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
    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmit(true);
    }
  };

  const handleChange = (value) => {
    setSelectedStage(value);
    console.log(value);
    const treatmentText = treatmentMethods[value];
    setTreatment(treatmentText);
  };

  return (
    <>
      <Head>
        <title>วิเคราะห์โรค</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="min-h-screen">
        <form onSubmit={disease_record}>
          <div className="mb-10">
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
                
              
              </div>

              {/* ////////////////////////////////////////////////////////////////// */}
              {/* ปุ่มเลือกผลการวิเคราะห์ */}
              <div className="bg-red-200 text-xl p-5 text-center">
                <h1>ผลการวิเคราะห์พบโรครากเน่า</h1>
              </div>
              {/* ////////////////////////////////////////////////////////////////// */}
              {/* แสดงผลการวิเคราะห์ */}
              <div className="mt-4 mb-2">
                <h1 className="text-lg">กรุณาระบุอาการ</h1>
              </div>

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

              <div className="flex flex-col justify-center items-center mt-4">
                <Button
                  type="submit"
                  className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-700 px-8"
                >
                  บันทึก
                </Button>
              </div>

              {/* เพิ่ม Radio Button ในส่วนนี้ */}
            </div>
          </div>
        </form>
        {isSubmit && (
          <Card className="max-w-xl mx-auto text-lg">
            <div className="mt-5 ml-4">
              <CardTitle className="">คำแนะนำวิธีการรักษา</CardTitle>
              <CardDescription className="flex">
                เป็นโรครากเน่าในระดับ :{" "}
                <p className="text-red-500">{selectedStage}</p>
              </CardDescription>
            </div>
            <CardContent className="mt-4">
              <div className=" bg-gray-100 rounded-md">{treatment}</div>
            </CardContent>
          </Card>
        )}
      </div>
      <Toaster />
    </>
  );
}

export default authurize(Analyze);
