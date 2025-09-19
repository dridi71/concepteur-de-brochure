import React, { useState } from 'react';
import type { PaperSize } from '../types';

// Declare global variables from CDN scripts
declare const html2canvas: any;
declare const docx: any;
declare const saveAs: any;

interface ExportWordButtonProps {
    elementIdToCapture: string;
    paperSize: PaperSize;
    fileName?: string;
}

const ExportWordButton: React.FC<ExportWordButtonProps> = ({ elementIdToCapture, paperSize, fileName = 'غلاف-كراس.docx' }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    const element = document.getElementById(elementIdToCapture);
    if (!element) {
      console.error('Element to capture not found!');
      alert('حدث خطأ أثناء محاولة تصدير الملف.');
      return;
    }

    setIsExporting(true);

    try {
      const canvas = await html2canvas(element, {
          useCORS: true,
          allowTaint: true,
          scale: 3, // High scale for good quality
      });
      
      const imageBuffer = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      if (!imageBuffer) {
        throw new Error("Could not convert canvas to blob.");
      }

      const { Document, Packer, ImageRun, Paragraph } = docx;

      // Dimensions in twips (1/20th of a point). 1mm ≈ 56.7 twips.
      const pageDimensions = paperSize === 'A4' 
        ? { width: 11906, height: 16838 } // A4: 210mm x 297mm
        : { width: 9638, height: 12474 }; // Notebook: 170mm x 220mm

      const doc = new Document({
        sections: [{
          properties: {
            pageSize: {
              width: pageDimensions.width,
              height: pageDimensions.height,
            },
            margin: { // Zero margins to allow the image to fill the page
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
            },
          },
          children: [
            new Paragraph({
              children: [
                new ImageRun({
                  data: imageBuffer,
                  transformation: {
                    width: pageDimensions.width,
                    height: pageDimensions.height,
                  },
                }),
              ],
            }),
          ],
        }],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, fileName);

    } catch (error) {
      console.error('Failed to export Word document:', error);
      alert('حدث خطأ أثناء تصدير ملف Word.');
    } finally {
        setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="w-full flex items-center justify-center gap-2 bg-blue-700 text-white font-bold py-2.5 px-3 rounded-lg shadow-md hover:bg-blue-800 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-transform transform hover:scale-105 disabled:bg-blue-400 disabled:scale-100 disabled:cursor-wait"
      aria-label="تصدير الغلاف كملف Word"
    >
      {isExporting ? (
        <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>جاري التصدير...</span>
        </>
      ) : (
        <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2-2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            <span>Word ملف</span>
        </>
      )}
    </button>
  );
};

export default ExportWordButton;
