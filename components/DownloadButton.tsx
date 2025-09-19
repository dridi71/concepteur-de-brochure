import React, { useState } from 'react';

// Make html2canvas available from the global scope (window)
declare const html2canvas: any;

interface DownloadButtonProps {
    elementIdToCapture: string;
    fileName?: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ elementIdToCapture, fileName = 'غلاف-كراس.png' }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    const element = document.getElementById(elementIdToCapture);
    if (!element) {
      console.error('Element to capture not found!');
      alert('حدث خطأ أثناء محاولة تحميل الصورة.');
      return;
    }

    setIsDownloading(true);

    try {
      const canvas = await html2canvas(element, {
          useCORS: true, // Important for external images
          allowTaint: true,
          scale: 2, // Higher scale for better quality
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to download image:', error);
      alert('حدث خطأ أثناء تحميل الصورة.');
    } finally {
        setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-purple-700 active:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-transform transform hover:scale-105 disabled:bg-purple-400 disabled:scale-100 disabled:cursor-wait"
      aria-label="تحميل الغلاف كصورة"
    >
      {isDownloading ? (
        <>
            <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>جاري التحميل...</span>
        </>
      ) : (
        <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>تحميل صورة</span>
        </>
      )}
    </button>
  );
};

export default DownloadButton;
