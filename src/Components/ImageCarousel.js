import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  
  const images = [
    '/invoice.png',
    '/invoice.png',
    '/invoice.png',
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); 
    
    return () => clearInterval(interval);
  }, [images.length]);
  
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };
  
  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };
  
  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96 bg-gray-100 dark:bg-white overflow-hidden">
      
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="w-full h-full flex items-center justify-center bg-transparent dark:bg-white rounded-lg border border-transparent dark:border-gray-200 overflow-hidden">
              <img
                src={image}
                alt={`Invoice ${index + 1}`}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        ))}
      </div>
      
     
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-10"
        aria-label="Previous image"
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-10"
        aria-label="Next image"
      >
        <ChevronRightIcon className="h-6 w-6" />
      </button>
      
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 w-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;

