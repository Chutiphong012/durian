"use client";
import { useState, useEffect } from "react";

function ImageUpload() {
  const [imagePreview, setImagePreview] = useState(null);

  // On component mount, check if there is an image preview saved in localStorage
  useEffect(() => {
    const savedImage = localStorage.getItem("image");
    if (savedImage) {
      setImagePreview(savedImage); // If it exists, set it to state
    }
  }, []);

  // Handle file change event
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file

    if (file) {
      const reader = new FileReader();

      // Set up the file reader to load the file and set the preview
      reader.onloadend = () => {
        const base64Image = reader.result;
        setImagePreview(base64Image); // Set the result as the image preview

        // Save the base64 image in localStorage
        localStorage.setItem("image", base64Image);
      };

      // Read the file as a data URL (base64 encoded image)
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="text-center">
      <input
        type="file"
        accept="image/*" // Only allow image files
        onChange={handleFileChange} // Trigger the file input change event
        className="py-2 px-4 border border-gray-300 rounded-md"
      />

      {/* Display image preview */}
      {imagePreview && (
        <div className="mt-4">
          <img
            src={imagePreview}
            alt="Image Preview"
            className="w-full max-w-md mx-auto rounded-md shadow-lg"
          />
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
