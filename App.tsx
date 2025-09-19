
import React, { useState } from 'react';
import type { CoverData, Theme, FontFamily, LayoutOrder } from './types';
import { INITIAL_COVER_DATA, THEMES } from './constants';
import ControlPanel from './components/ControlPanel';
import CoverPreview from './components/CoverPreview';

function App() {
  const [coverData, setCoverData] = useState<CoverData>(INITIAL_COVER_DATA);
  const [availableThemes, setAvailableThemes] = useState<Theme[]>(THEMES);
  const [selectedTheme, setSelectedTheme] = useState<Theme>(THEMES[0]);
  const [selectedFont, setSelectedFont] = useState<FontFamily>('Cairo');
  const [showSubject, setShowSubject] = useState<boolean>(true);
  const [layoutOrder, setLayoutOrder] = useState<LayoutOrder>('default');

  const handleCustomImageUpload = (dataUrl: string) => {
    const customTheme: Theme = { id: 'custom', name: 'مخصص', imageUrl: dataUrl };

    setAvailableThemes(prevThemes => {
        const customThemeExists = prevThemes.some(theme => theme.id === 'custom');
        if (customThemeExists) {
            return prevThemes.map(theme => theme.id === 'custom' ? customTheme : theme);
        }
        return [customTheme, ...prevThemes.filter(t => t.id !== 'custom')];
    });

    setSelectedTheme(customTheme);
  };

  const handleRemoveCustomTheme = () => {
    if (window.confirm("هل أنت متأكد أنك تريد إزالة التصميم المخصص؟ لا يمكن التراجع عن هذا الإجراء.")) {
        setAvailableThemes(prevThemes => prevThemes.filter(theme => theme.id !== 'custom'));
        if (selectedTheme.id === 'custom') {
            setSelectedTheme(THEMES[0]);
        }
        alert('تمت إزالة التصميم المخصص.');
    }
  };

  const handleSaveDesign = () => {
    try {
      const designToSave = {
        coverData,
        selectedTheme,
        selectedFont,
        showSubject,
        layoutOrder,
      };
      localStorage.setItem('notebookCoverDesign', JSON.stringify(designToSave));
      alert('تم حفظ التصميم بنجاح!');
    } catch (error) {
      console.error("Failed to save design:", error);
      alert('حدث خطأ أثناء حفظ التصميم.');
    }
  };

  const handleLoadDesign = () => {
    try {
      const savedDesignJSON = localStorage.getItem('notebookCoverDesign');
      if (!savedDesignJSON) {
        alert('لم يتم العثور على تصميم محفوظ.');
        return;
      }

      const savedDesign = JSON.parse(savedDesignJSON);
      const { coverData: loadedCoverData, selectedTheme: loadedTheme, selectedFont: loadedFont, showSubject: loadedShowSubject, layoutOrder: loadedLayoutOrder } = savedDesign;

      if (!loadedCoverData || !loadedTheme || !loadedTheme.id) {
        throw new Error('Invalid design data in localStorage.');
      }

      setCoverData(loadedCoverData);
      setSelectedFont(loadedFont || 'Cairo');
      setShowSubject(loadedShowSubject ?? true);
      setLayoutOrder(loadedLayoutOrder || 'default');

      if (loadedTheme.id === 'custom') {
        handleCustomImageUpload(loadedTheme.imageUrl);
      } else {
        const themeFromConstants = THEMES.find(t => t.id === loadedTheme.id);
        setSelectedTheme(themeFromConstants || THEMES[0]);
      }
      
      alert('تم تحميل التصميم بنجاح!');
    } catch (error) {
      console.error('Failed to load design:', error);
      alert('حدث خطأ أثناء تحميل التصميم. قد تكون البيانات محفوظة بشكل غير صحيح.');
    }
  };

  const handleResetDesign = () => {
    setCoverData(INITIAL_COVER_DATA);
    setSelectedTheme(THEMES[0]);
    setSelectedFont('Cairo');
    setShowSubject(true);
    setLayoutOrder('default');
    setAvailableThemes(THEMES);
  };

  return (
    <div className="bg-slate-100 min-h-screen">
      <header className="bg-white shadow-md print:hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-center text-blue-600">مصمم غلاف الكراس</h1>
          <p className="text-center text-gray-600 mt-1">
            صمم غلاف كراسك بنفسك ببضع نقرات!
          </p>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 print:hidden">
            <ControlPanel
              coverData={coverData}
              setCoverData={setCoverData}
              themes={availableThemes}
              baseThemes={THEMES}
              selectedTheme={selectedTheme}
              setSelectedTheme={setSelectedTheme}
              selectedFont={selectedFont}
              setSelectedFont={setSelectedFont}
              showSubject={showSubject}
              setShowSubject={setShowSubject}
              layoutOrder={layoutOrder}
              setLayoutOrder={setLayoutOrder}
              onCustomImageUpload={handleCustomImageUpload}
              onRemoveCustomTheme={handleRemoveCustomTheme}
              onSaveDesign={handleSaveDesign}
              onLoadDesign={handleLoadDesign}
              onResetDesign={handleResetDesign}
            />
          </div>
          <div className="lg:col-span-2">
            <CoverPreview 
              coverData={coverData} 
              selectedTheme={selectedTheme} 
              selectedFont={selectedFont}
              showSubject={showSubject}
              layoutOrder={layoutOrder}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
