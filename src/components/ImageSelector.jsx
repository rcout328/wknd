import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from 'next/image';

const ImageSelector = ({ onImageSelect, initialImage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(initialImage || null);
  const [previewImage, setPreviewImage] = useState(initialImage || null);

  useEffect(() => {
    setSelectedImage(initialImage);
    setPreviewImage(initialImage);
  }, [initialImage]);

  // This is a mock gallery. In a real application, you'd fetch these from your server or a CDN
  const galleryImages = [
    '/images/cake1.jpg',
    '/images/cake2.jpg',
    '/images/cake3.jpg',
    // Add more image paths as needed
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = e.target.result;
        setSelectedImage(newImage);
        setPreviewImage(newImage);
        onImageSelect(newImage);
        setIsOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGallerySelect = (imagePath) => {
    setSelectedImage(imagePath);
    setPreviewImage(imagePath);
    onImageSelect(imagePath);
    setIsOpen(false);
  };

  const handleOpenDialog = () => {
    setIsOpen(true);
    setPreviewImage(selectedImage);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setPreviewImage(selectedImage);
  };

  return (
    <div>
      <Button onClick={handleOpenDialog}>
        {selectedImage ? 'Change Image' : 'Select Image'}
      </Button>
      {selectedImage && (
        <div className="mt-2">
          <Image src={selectedImage} alt="Selected" width={100} height={100} className="rounded-md object-cover" />
        </div>
      )}
      <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select an Image</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4">
            {galleryImages.map((img, index) => (
              <div key={index} className="relative w-24 h-24">
                <Image
                  src={img}
                  alt={`Gallery image ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="cursor-pointer rounded-md hover:opacity-80"
                  onClick={() => handleGallerySelect(img)}
                />
              </div>
            ))}
          </div>
          <div className="mt-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              Upload from Device
            </label>
          </div>
          {previewImage && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Preview:</h3>
              <div className="relative w-full h-48">
                <Image
                  src={previewImage}
                  alt="Preview"
                  layout="fill"
                  objectFit="contain"
                  className="rounded-md"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageSelector;