import * as ort from "onnxruntime-web";

export async function loadModel() {
    try {
        const session = await ort.InferenceSession.create("/model/densenet_model.onnx");
        console.log("✅ ONNX model loaded in browser.");
        return session;
    } catch (error) {
        console.error("❌ Failed to load model:", error);
    }
}

export async function runModel(session, inputData) {
    try {
      if (!inputData || !Array.isArray(inputData)) {
        throw new Error("Invalid input data: inputData must be a valid array");
      }
  
      // ✅ ใช้ 3 channels (RGB) และตรวจสอบ shape
      if (inputData.length !== 3 * 224 * 224) {
        throw new Error("❌ Invalid input shape: Expected [1, 3, 224, 224]");
      }
  
      const tensorInput = new ort.Tensor("float32", new Float32Array(inputData), [1, 3, 224, 224]);
  
      // ✅ เปลี่ยน input name ตามที่โมเดลกำหนด (เช่น input_1)
      const feeds = { input_1: tensorInput };
  
      // ✅ รันโมเดล
      const results = await session.run(feeds);
      console.log("✅ Model output keys:", Object.keys(results)); // 🔍 Debug
  
      // ✅ ตรวจสอบว่า output key ตรงกับที่โมเดลให้มา
      const outputKey = Object.keys(results)[0]; // ดึง key แรกของโมเดล
      console.log("Output key:", outputKey);
      console.log("Model output data:", results[outputKey].data);
      if (!results[outputKey]) {
        throw new Error("❌ Model did not return expected output");
      }
  
      return results[outputKey].data; // ✅ Return output data ที่ถูกต้อง
    } catch (error) {
      console.error("❌ Error running model:", error);
      return null;
    }
  }
  