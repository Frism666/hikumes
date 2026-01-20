
import React, { useState, useEffect, useRef } from 'react';
import { IDCardData, InstitutionType, US_STATES } from './types';
import { generateRandomIDData } from './services/geminiService';
import IDCard from './components/IDCard';
import { toPng } from 'html-to-image';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [idData, setIdData] = useState<IDCardData | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedType, setSelectedType] = useState<InstitutionType | ''>('');

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateRandomIDData(
        selectedType || undefined, 
        selectedState || undefined
      );
      setIdData(data);
    } catch (err) {
      setError('Failed to retrieve valid institution data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current || !idData) return;
    
    setDownloading(true);
    try {
      // Switched to toPng which is significantly more robust for complex CSS layers
      const dataUrl = await toPng(cardRef.current, { 
        pixelRatio: 2, 
        backgroundColor: '#ffffff',
        cacheBust: true,
      });
      
      const link = document.createElement('a');
      link.download = `ID_CARD_${idData.lastName.toUpperCase()}_${idData.firstName.toUpperCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed', err);
      setError('Failed to export image. Try taking a screenshot if the error persists.');
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadTxt = () => {
    if (!idData) return;

    const content = `
========================================
VALIDATED STUDENT ID RECORD (RESEARCH)
========================================
Status: Real-World Institution Verified
Full Name: ${idData.firstName} ${idData.lastName}
Student ID: ${idData.studentId}
Institution: ${idData.schoolName}
Type: ${idData.schoolType}
Official Address: ${idData.schoolAddress}
Location: ${idData.city}, ${idData.state}
School Email: ${idData.schoolEmail}
Faculty/Department: ${idData.faculty}
Major/Grade: ${idData.majorOrGrade}
Enrollment Year: ${idData.enrollmentYear}
Issue Date: ${idData.issueDate}
Expiry Date: ${idData.expiryDate}
----------------------------------------
Generated: ${new Date().toLocaleString()}
Database: Verifiable Institution (SheerID/NCES compatible)
========================================
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Details_${idData.lastName}_${idData.firstName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    handleGenerate();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <aside className="no-print w-full md:w-80 bg-white border-r border-slate-200 p-6 shadow-sm overflow-y-auto z-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-[#004a87] p-2 rounded-lg text-white">
            <i className="fas fa-university text-2xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 leading-none">US ID Generator</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Validated Data Mode</p>
          </div>
        </div>

        <div className="space-y-6">
          <section>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Region</label>
            <select 
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            >
              <option value="">Random US State</option>
              {US_STATES.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </section>

          <section>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Institutional Filter</label>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setSelectedType(InstitutionType.HIGH_SCHOOL)}
                className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all ${selectedType === InstitutionType.HIGH_SCHOOL ? 'bg-[#004a87] text-white border-[#004a87]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
              >
                High School
              </button>
              <button 
                onClick={() => setSelectedType(InstitutionType.UNIVERSITY)}
                className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all ${selectedType === InstitutionType.UNIVERSITY ? 'bg-[#004a87] text-white border-[#004a87]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
              >
                University
              </button>
            </div>
          </section>

          <div className="pt-4 space-y-3">
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <i className="fas fa-search animate-pulse"></i>
              ) : (
                <i className="fas fa-check-double"></i>
              )}
              {loading ? 'Verifying Real Data...' : 'Generate Validated ID'}
            </button>
            
            <button 
              onClick={handleDownloadImage}
              disabled={!idData || downloading}
              className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <i className="fas fa-image"></i>
              {downloading ? 'Processing PNG...' : 'Download HD Image'}
            </button>

            <button 
              onClick={handleDownloadTxt}
              disabled={!idData || loading}
              className="w-full bg-slate-100 text-slate-700 border border-slate-200 font-bold py-3 rounded-xl hover:bg-slate-200 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <i className="fas fa-file-signature"></i>
              Download Manifest
            </button>
          </div>
        </div>

        <div className="mt-12 p-4 bg-amber-50 rounded-lg border border-amber-100">
          <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
            <i className="fas fa-shield-check mr-1"></i>
            <strong>Active Mode:</strong> Real-world verification enabled. Institutions generated are now cross-referenced against known US academic databases.
          </p>
        </div>
      </aside>

      <main className="flex-grow p-4 md:p-12 flex flex-col items-center justify-center overflow-auto bg-[#f0f2f5] min-h-screen">
        {loading && !idData ? (
          <div className="text-center">
            <div className="relative mb-6">
                <div className="w-24 h-24 border-4 border-indigo-100 border-t-[#004a87] rounded-full animate-spin mx-auto"></div>
                <i className="fas fa-building-columns absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#004a87] text-2xl"></i>
            </div>
            <p className="text-slate-700 font-black uppercase text-xs tracking-[0.2em]">Verifying Institution & Address</p>
            <p className="text-slate-400 text-[10px] mt-2 italic">Consulting US Academic Records...</p>
          </div>
        ) : idData ? (
          <div className="flex flex-col items-center w-full max-w-4xl">
            <div className="mb-10 no-print text-center">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Validated Specimen</h2>
              <p className="text-slate-500 text-sm font-medium">Authentic Institutional Data for {idData.state}</p>
            </div>
            
            <div className="id-card-wrapper transition-all duration-500 ease-out p-4 bg-transparent overflow-x-auto w-full flex justify-center">
              <div style={{ transform: 'scale(0.9)', transformOrigin: 'center' }} className="md:scale-100">
                <IDCard ref={cardRef} data={idData} />
              </div>
            </div>
            
            {error && (
              <div className="mt-8 p-4 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 max-w-xs text-center shadow-sm">
                <i className="fas fa-triangle-exclamation mr-2"></i>
                {error}
              </div>
            )}
          </div>
        ) : (
          <div className="text-slate-300 flex flex-col items-center gap-4">
             <i className="fas fa-id-badge text-6xl opacity-20"></i>
             <p className="font-bold uppercase tracking-widest text-sm">Waiting for Parameters</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
