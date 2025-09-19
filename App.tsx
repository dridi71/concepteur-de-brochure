
import React, { useState, useEffect } from 'react';
import type { CoverData, Theme, FontFamily, LayoutOrder, TextStyles, PaperSize } from './types';
import { INITIAL_COVER_DATA, THEMES, INITIAL_TEXT_STYLES } from './constants';
import ControlPanel from './components/ControlPanel';
import CoverPreview from './components/CoverPreview';

function App() {
  const [coverData, setCoverData] = useState<CoverData>(INITIAL_COVER_DATA);
  const [availableThemes, setAvailableThemes] = useState<Theme[]>(THEMES);
  const [selectedTheme, setSelectedTheme] = useState<Theme>(THEMES[0]);
  const [selectedFont, setSelectedFont] = useState<FontFamily>('Cairo');
  const [showSubject, setShowSubject] = useState<boolean>(true);
  const [layoutOrder, setLayoutOrder] = useState<LayoutOrder>('default');
  const [textStyles, setTextStyles] = useState<TextStyles>(INITIAL_TEXT_STYLES);
  const [paperSize, setPaperSize] = useState<PaperSize>('A4');

  useEffect(() => {
    document.documentElement.setAttribute('data-papersize', paperSize);
  }, [paperSize]);

  const handleCustomImageUpload = (dataUrl: string) => {
    const customTheme: Theme = { 
        id: 'custom', 
        name: 'مخصص', 
        imageUrl: dataUrl,
        opacity: 1,
        blendMode: 'normal',
    };

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
        textStyles,
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
      const { 
        coverData: loadedCoverData, 
        selectedTheme: loadedTheme, 
        selectedFont: loadedFont, 
        showSubject: loadedShowSubject, 
        layoutOrder: loadedLayoutOrder,
        textStyles: loadedTextStyles
      } = savedDesign;

      if (!loadedCoverData || !loadedTheme || !loadedTheme.id) {
        throw new Error('Invalid design data in localStorage.');
      }

      setCoverData(loadedCoverData);
      setSelectedFont(loadedFont || 'Cairo');
      setShowSubject(loadedShowSubject ?? true);
      setLayoutOrder(loadedLayoutOrder || 'default');
      setTextStyles(loadedTextStyles || INITIAL_TEXT_STYLES);
      
      // Add default opacity and blendMode if they are missing from saved data for backward compatibility
      const themeWithDefaults: Theme = {
        ...loadedTheme,
        opacity: loadedTheme.opacity ?? 1,
        blendMode: loadedTheme.blendMode ?? 'normal',
      };

      if (loadedTheme.id === 'custom') {
        // Create the custom theme first
        const customTheme: Theme = { 
            id: 'custom', 
            name: 'مخصص', 
            imageUrl: loadedTheme.imageUrl,
            opacity: themeWithDefaults.opacity,
            blendMode: themeWithDefaults.blendMode,
        };
        setAvailableThemes(prevThemes => {
            const customThemeExists = prevThemes.some(theme => theme.id === 'custom');
            if (customThemeExists) {
                return prevThemes.map(theme => theme.id === 'custom' ? customTheme : theme);
            }
            return [customTheme, ...prevThemes.filter(t => t.id !== 'custom')];
        });
        setSelectedTheme(customTheme);
      } else {
        const themeFromConstants = THEMES.find(t => t.id === loadedTheme.id);
        setSelectedTheme(themeFromConstants ? { ...themeFromConstants, ...themeWithDefaults } : THEMES[0]);
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
    setTextStyles(INITIAL_TEXT_STYLES);
    setAvailableThemes(THEMES);
    setPaperSize('A4');
  };

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col">
      <header className="bg-white shadow-md print:hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-center text-blue-600">مصمم غلاف الكراس</h1>
          <p className="text-center text-gray-600 mt-1">
            صمم غلاف كراسك بنفسك ببضع نقرات!
          </p>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
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
              textStyles={textStyles}
              setTextStyles={setTextStyles}
              paperSize={paperSize}
              setPaperSize={setPaperSize}
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
              textStyles={textStyles}
              paperSize={paperSize}
            />
          </div>
        </div>
      </main>
      <footer className="text-center py-4 bg-slate-200 print:hidden">
        <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} Licence au nom de Mohamed Dridi.</p>
      </footer>
    </div>
  );
}

export default App;