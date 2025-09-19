import React, { useState } from 'react';
import type { CoverData, Theme, FontFamily, LayoutOrder, TextStyles } from '../types';
import { FONTS } from '../constants';
import ThemeSelector from './ThemeSelector';
import PrintButton from './PrintButton';
import DownloadButton from './DownloadButton';
import Modal from './Modal';
import PrintPreviewModal from './PrintPreviewModal';
import StyleControl from './StyleControl';

interface ControlPanelProps {
  coverData: CoverData;
  setCoverData: React.Dispatch<React.SetStateAction<CoverData>>;
  themes: Theme[];
  baseThemes: Theme[];
  selectedTheme: Theme;
  setSelectedTheme: React.Dispatch<React.SetStateAction<Theme>>;
  selectedFont: FontFamily;
  setSelectedFont: React.Dispatch<React.SetStateAction<FontFamily>>;
  showSubject: boolean;
  setShowSubject: React.Dispatch<React.SetStateAction<boolean>>;
  layoutOrder: LayoutOrder;
  setLayoutOrder: React.Dispatch<React.SetStateAction<LayoutOrder>>;
  textStyles: TextStyles;
  setTextStyles: React.Dispatch<React.SetStateAction<TextStyles>>;
  onCustomImageUpload: (dataUrl: string) => void;
  onRemoveCustomTheme: () => void;
  onSaveDesign: () => void;
  onLoadDesign: () => void;
  onResetDesign: () => void;
}

interface LoadedDesignData {
  coverData: CoverData;
  selectedTheme: Theme;
  selectedFont: FontFamily;
  showSubject: boolean;
  layoutOrder: LayoutOrder;
  textStyles: TextStyles;
}

const InputField: React.FC<{
  label: string;
  value: string;
  name: keyof CoverData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}> = ({ label, value, name, onChange, error }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type="text"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full p-2 border rounded-lg shadow-sm focus:ring-2 focus:border-transparent transition ${
        error 
        ? 'border-red-500 focus:ring-red-500' 
        : 'border-gray-300 focus:ring-blue-500'
      }`}
      aria-invalid={!!error}
      aria-describedby={error ? `${name}-error` : undefined}
    />
    {error && <p id={`${name}-error`} className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);


const ControlPanel: React.FC<ControlPanelProps> = ({
  coverData,
  setCoverData,
  themes,
  baseThemes,
  selectedTheme,
  setSelectedTheme,
  selectedFont,
  setSelectedFont,
  showSubject,
  setShowSubject,
  layoutOrder,
  setLayoutOrder,
  textStyles,
  setTextStyles,
  onCustomImageUpload,
  onRemoveCustomTheme,
  onSaveDesign,
  onLoadDesign,
  onResetDesign,
}) => {
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);
  const [isStylingOpen, setIsStylingOpen] = useState(false);
  const [loadedDesignPreview, setLoadedDesignPreview] = useState<LoadedDesignData | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof CoverData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CoverData, string>> = {};
    if (!coverData.name.trim()) newErrors.name = "اسم التلميذ/ة مطلوب.";
    if (!coverData.subject.trim()) newErrors.subject = "المادة مطلوبة.";
    if (!coverData.className.trim()) newErrors.className = "القسم مطلوب.";
    if (!coverData.schoolName.trim()) newErrors.schoolName = "اسم المدرسة مطلوب.";
    if (!coverData.schoolYear.trim()) newErrors.schoolYear = "السنة الدراسية مطلوبة.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as { name: keyof CoverData; value: string };
    setCoverData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (errors[name] && value.trim()) {
      setErrors(prevErrors => {
          const newErrors = { ...prevErrors };
          delete newErrors[name];
          return newErrors;
      });
    }
  };

  const handleAttemptSave = () => {
    if (validate()) {
      setIsSaveModalOpen(true);
    }
  };

  const handleConfirmSave = () => {
    if (validate()) {
        onSaveDesign();
        setIsSaveModalOpen(false);
    }
  };

  const handleAttemptLoad = () => {
    try {
      const savedDesignJSON = localStorage.getItem('notebookCoverDesign');
      if (!savedDesignJSON) {
        alert('لم يتم العثور على تصميم محفوظ.');
        return;
      }

      const savedDesign = JSON.parse(savedDesignJSON);
      const { coverData: loadedCoverData, selectedTheme: savedThemeStub, selectedFont: loadedFont, showSubject: loadedShowSubject, layoutOrder: loadedLayoutOrder, textStyles: loadedTextStyles } = savedDesign;

      if (!loadedCoverData || !savedThemeStub || !savedThemeStub.id) {
        throw new Error('Invalid design data in localStorage.');
      }
      
      let themeForPreview: Theme;
      if (savedThemeStub.id === 'custom') {
        themeForPreview = savedThemeStub;
      } else {
        const foundTheme = baseThemes.find(t => t.id === savedThemeStub.id);
        if (!foundTheme) {
            console.warn(`Saved theme with id "${savedThemeStub.id}" not found. Falling back to default.`);
            themeForPreview = baseThemes[0];
        } else {
            themeForPreview = foundTheme;
        }
      }

      setLoadedDesignPreview({ 
          coverData: loadedCoverData, 
          selectedTheme: themeForPreview, 
          selectedFont: loadedFont || 'Cairo',
          showSubject: loadedShowSubject ?? true,
          layoutOrder: loadedLayoutOrder || 'default',
          textStyles: loadedTextStyles,
      });
      setIsLoadModalOpen(true);

    } catch (error) {
      console.error('Failed to parse or prepare saved design for preview:', error);
      alert('لا يمكن تحميل التصميم. قد تكون البيانات المحفوظة تالفة.');
    }
  };

  const handleConfirmLoad = () => {
    onLoadDesign();
    setIsLoadModalOpen(false);
    setLoadedDesignPreview(null);
  };
  
  const handleCloseLoadModal = () => {
    setIsLoadModalOpen(false);
    setLoadedDesignPreview(null);
  }

  const handleConfirmReset = () => {
    onResetDesign();
    setIsResetModalOpen(false);
  };

  return (
    <>
      <div className="bg-white p-6 rounded-xl shadow-lg space-y-6 sticky top-8">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">إعدادات الغلاف</h2>
        
        <div className="space-y-4">
          <InputField label="اسم التلميذ/ة" name="name" value={coverData.name} onChange={handleChange} error={errors.name} />
          <InputField label="المادة" name="subject" value={coverData.subject} onChange={handleChange} error={errors.subject} />
          <InputField label="القسم" name="className" value={coverData.className} onChange={handleChange} error={errors.className} />
          <InputField label="المدرسة" name="schoolName" value={coverData.schoolName} onChange={handleChange} error={errors.schoolName} />
          <InputField label="السنة الدراسية" name="schoolYear" value={coverData.schoolYear} onChange={handleChange} error={errors.schoolYear} />
        </div>

        <div>
          <label htmlFor="font-select" className="block text-lg font-medium text-gray-700 mb-3">
            اختر الخط
          </label>
          <select
            id="font-select"
            value={selectedFont}
            onChange={(e) => setSelectedFont(e.target.value as FontFamily)}
            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          >
            {FONTS.map((font) => (
              <option key={font.id} value={font.id} style={{ fontFamily: `'${font.id}', sans-serif`, fontSize: '1.2rem' }}>
                {font.name}
              </option>
            ))}
          </select>
        </div>

        <ThemeSelector
          themes={themes}
          selectedTheme={selectedTheme}
          setSelectedTheme={setSelectedTheme}
          onCustomImageUpload={onCustomImageUpload}
          onRemoveCustomTheme={onRemoveCustomTheme}
        />
        
        <div className="pt-4 mt-4 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-700 mb-3">تخصيص التخطيط</h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                    <label htmlFor="show-subject-toggle" className="text-sm font-medium text-gray-700">إظهار المادة</label>
                    <button
                        type="button"
                        id="show-subject-toggle"
                        onClick={() => setShowSubject(!showSubject)}
                        className={`${showSubject ? 'bg-blue-600' : 'bg-gray-300'} relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        role="switch"
                        aria-checked={showSubject}
                    >
                        <span className={`${showSubject ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}/>
                    </button>
                </div>
                <fieldset>
                    <legend className="block text-sm font-medium text-gray-700 mb-2">ترتيب العناصر</legend>
                    <div className="grid grid-cols-2 gap-2">
                        <label htmlFor="order-default" className={`cursor-pointer p-2 text-center rounded-lg border-2 ${layoutOrder === 'default' ? 'bg-blue-100 border-blue-500 text-blue-800 font-bold' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                            <input id="order-default" name="layout-order" type="radio" value="default" checked={layoutOrder === 'default'} onChange={() => setLayoutOrder('default')} className="sr-only"/>
                            <span>افتراضي</span>
                        </label>
                        <label htmlFor="order-reversed" className={`cursor-pointer p-2 text-center rounded-lg border-2 ${layoutOrder === 'schoolNameFirst' ? 'bg-blue-100 border-blue-500 text-blue-800 font-bold' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                            <input id="order-reversed" name="layout-order" type="radio" value="schoolNameFirst" checked={layoutOrder === 'schoolNameFirst'} onChange={() => setLayoutOrder('schoolNameFirst')} className="sr-only"/>
                            <span>تبديل</span>
                        </label>
                    </div>
                </fieldset>
            </div>
        </div>

        <div className="pt-4 mt-4 border-t border-gray-200">
          <button
            onClick={() => setIsStylingOpen(!isStylingOpen)}
            className="w-full flex justify-between items-center text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors"
            aria-expanded={isStylingOpen}
          >
            <span>تخصيص النصوص</span>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform ${isStylingOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isStylingOpen && (
            <div className="mt-4 space-y-4 animate-fade-in">
              <StyleControl label="العنوان (كراس القسم)" previewText="كراس القسم" fontFamily={selectedFont} style={textStyles.title} onStyleChange={(newStyle) => setTextStyles(s => ({...s, title: newStyle}))} />
              <StyleControl label="اسم التلميذ/ة" previewText={coverData.name} fontFamily={selectedFont} style={textStyles.name} onStyleChange={(newStyle) => setTextStyles(s => ({...s, name: newStyle}))} />
              <StyleControl label="المادة" previewText={coverData.subject} fontFamily={selectedFont} style={textStyles.subject} onStyleChange={(newStyle) => setTextStyles(s => ({...s, subject: newStyle}))} />
              <StyleControl label="اسم المدرسة" previewText={coverData.schoolName} fontFamily={selectedFont} style={textStyles.schoolName} onStyleChange={(newStyle) => setTextStyles(s => ({...s, schoolName: newStyle}))} />
              <StyleControl label="معلومات أخرى" previewText={`${coverData.className} | ${coverData.schoolYear}`} fontFamily={selectedFont} style={textStyles.otherInfo} onStyleChange={(newStyle) => setTextStyles(s => ({...s, otherInfo: newStyle}))} />
            </div>
          )}
        </div>


        <div className="space-y-3 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-700 text-center">الإجراءات</h3>
          <button
              onClick={() => setIsPrintPreviewOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-transform transform hover:scale-105"
              aria-label="فتح معاينة الطباعة"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0118 13.414V19a2 2 0 01-2 2z" />
              </svg>
              <span>معاينة الطباعة</span>
            </button>
          <div className="grid grid-cols-2 gap-3">
            <DownloadButton elementIdToCapture="printable-area" />
            <PrintButton />
          </div>
          <div className="grid grid-cols-2 gap-3">
             <button
              onClick={handleAttemptSave}
              className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-2.5 px-4 rounded-lg shadow-md hover:bg-green-700 active:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-transform transform hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              <span>حفظ</span>
            </button>
            <button
              onClick={handleAttemptLoad}
              className="w-full flex items-center justify-center gap-2 bg-yellow-500 text-white font-bold py-2.5 px-4 rounded-lg shadow-md hover:bg-yellow-600 active:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-transform transform hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>تحميل</span>
            </button>
          </div>
          <button
            onClick={() => setIsResetModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-bold py-2.5 px-4 rounded-lg shadow-md hover:bg-red-700 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-transform transform hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>إعادة تعيين</span>
          </button>
        </div>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.3s ease-out forwards;
          }
        `}</style>
      </div>

      <PrintPreviewModal
        isOpen={isPrintPreviewOpen}
        onClose={() => setIsPrintPreviewOpen(false)}
        coverData={coverData}
        selectedTheme={selectedTheme}
        selectedFont={selectedFont}
        showSubject={showSubject}
        layoutOrder={layoutOrder}
        textStyles={textStyles}
      />
      
      <Modal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onConfirm={handleConfirmSave}
        title="تأكيد الحفظ"
      >
        <p>هل أنت متأكد أنك تريد حفظ التصميم الحالي؟ سيتم الكتابة فوق أي تصميم محفوظ مسبقًا.</p>
      </Modal>

      <Modal
        isOpen={isLoadModalOpen}
        onClose={handleCloseLoadModal}
        onConfirm={handleConfirmLoad}
        title="تأكيد التحميل"
      >
        {loadedDesignPreview ? (
          <div>
              <p className="mb-4">هل أنت متأكد أنك تريد تحميل هذا التصميم؟ سيتم فقدان التغييرات الحالية غير المحفوظة.</p>
              <div className="border-2 border-gray-300 rounded-lg p-2 bg-gray-50 max-h-64 overflow-y-auto text-sm">
                  <p><strong>الاسم:</strong> {loadedDesignPreview.coverData.name}</p>
                  <p><strong>المادة:</strong> {loadedDesignPreview.coverData.subject}</p>
                  <p><strong>التصميم:</strong> {loadedDesignPreview.selectedTheme.name}</p>
                  <p><strong>الخط:</strong> {loadedDesignPreview.selectedFont}</p>
                  {loadedDesignPreview.textStyles && (
                    <div className="mt-2 pt-2 border-t">
                      <p><strong>مقاسات الخطوط:</strong></p>
                      <ul className="list-disc list-inside text-xs">
                          <li>العنوان: {loadedDesignPreview.textStyles.title.fontSize}px</li>
                          <li>الاسم: {loadedDesignPreview.textStyles.name.fontSize}px</li>
                          <li>المادة: {loadedDesignPreview.textStyles.subject.fontSize}px</li>
                          <li>المدرسة: {loadedDesignPreview.textStyles.schoolName.fontSize}px</li>
                          <li>أخرى: {loadedDesignPreview.textStyles.otherInfo.fontSize}px</li>
                      </ul>
                    </div>
                  )}
              </div>
          </div>
        ) : (
          <p>جاري تحميل معاينة التصميم...</p>
        )}
      </Modal>

      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
        title="تأكيد إعادة التعيين"
      >
        <p>هل أنت متأكد أنك تريد إعادة تعيين جميع الإعدادات إلى الوضع الافتراضي؟ سيتم فقدان جميع التغييرات الحالية.</p>
      </Modal>
    </>
  );
};

export default ControlPanel;
