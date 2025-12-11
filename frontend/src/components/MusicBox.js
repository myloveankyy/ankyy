import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- ICONS ---
const Icons = {
  Bolt: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  Link: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>,
  Download: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
  Trash: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Music: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>,
  Video: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
  Check: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  SelectAll: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
  Zip: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>,
  Disk: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
};

const MusicBox = () => {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState('mp3');
  const [quality, setQuality] = useState('max');
  const [effect, setEffect] = useState('none');
  
  const [activeDownloads, setActiveDownloads] = useState([]);
  const [history, setHistory] = useState([]);
  const [storageUsed, setStorageUsed] = useState('0.0');
  const [isProcessingPlaylist, setIsProcessingPlaylist] = useState(false);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const MAX_CONCURRENT_REQUESTS = 2;

  useEffect(() => { fetchHistory(); }, []);

  // --- QUEUE SYSTEM ---
  useEffect(() => {
      const running = activeDownloads.filter(item => item.status === 'Downloading...' || item.status === 'Processing...');
      const queued = activeDownloads.filter(item => item.status === 'Queued...');
      if (running.length < MAX_CONCURRENT_REQUESTS && queued.length > 0) {
          const nextItem = queued[0];
          processDownload(nextItem.url, nextItem.format, nextItem.quality, nextItem.effect, nextItem.id);
      }
  }, [activeDownloads]);

  // --- AUTO PASTE ---
  useEffect(() => {
    const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    if (ytRegex.test(url)) {
        const cleanLink = url;
        setUrl('');
        if (cleanLink.includes('list=')) handlePlaylist(cleanLink);
        else addSingleToQueue(cleanLink);
    }
  }, [url]);

  const fetchHistory = async () => {
    try {
        const res = await fetch('http://localhost:5000/api/history');
        const data = await res.json();
        if(data.success) {
            setHistory(data.data);
            setStorageUsed(data.storage || '0.0');
        }
    } catch (err) {}
  };

  const handlePlaylist = async (playlistUrl) => {
      setIsProcessingPlaylist(true);
      try {
          const res = await fetch('http://localhost:5000/api/playlist', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url: playlistUrl })
          });
          const data = await res.json();
          if (data.success && data.videos.length > 0) {
              const newItems = data.videos.map((vid, idx) => ({
                  id: Date.now() + idx, url: vid.url, title: vid.title, format: format, quality: quality, effect: effect, progress: 0, status: 'Queued...'
              }));
              setActiveDownloads(prev => [...newItems, ...prev]);
          } else { alert("Could not load playlist."); }
      } catch (e) { alert("Playlist Error"); }
      setIsProcessingPlaylist(false);
  };

  const addSingleToQueue = (targetUrl) => {
      const tempId = Date.now();
      const newDownload = { id: tempId, url: targetUrl, format: format, quality: quality, effect: effect, progress: 0, status: 'Queued...' };
      setActiveDownloads(prev => [newDownload, ...prev]);
  };

  const processDownload = async (targetUrl, targetFormat, targetQuality, targetEffect, tempId) => {
    setActiveDownloads(prev => prev.map(item => item.id === tempId ? { ...item, status: 'Downloading...' } : item));
    try {
        const interval = setInterval(() => {
            setActiveDownloads(prev => prev.map(item => {
                if(item.id === tempId && item.progress < 90) {
                    let increment = item.progress < 50 ? 0.5 : 0.1;
                    return { ...item, progress: item.progress + increment, status: item.progress > 50 ? 'Processing...' : 'Downloading...' };
                }
                return item;
            }));
        }, 100);

        const response = await fetch('http://localhost:5000/api/convert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: targetUrl, type: targetFormat, quality: targetQuality, effect: targetEffect }),
        });
        
        clearInterval(interval);
        const data = await response.json();

        if (data.success) {
            setActiveDownloads(prev => prev.map(item => item.id === tempId ? { ...item, progress: 100, status: 'Finalizing...' } : item));
            setTimeout(() => {
                setActiveDownloads(prev => prev.filter(item => item.id !== tempId));
                fetchHistory();
            }, 800); 
        } else { throw new Error("Failed"); }
    } catch (error) {
        setActiveDownloads(prev => prev.map(item => item.id === tempId ? { ...item, status: 'Failed', progress: 0 } : item));
    }
  };

  const handleDelete = async (id) => {
      if(!window.confirm("Delete file permanently?")) return;
      try {
          await fetch(`http://localhost:5000/api/files/${id}`, { method: 'DELETE' });
          setHistory(history.filter(item => item.id !== id));
          setSelectedIds(selectedIds.filter(sid => sid !== id));
      } catch (err) {}
  };

  const toggleSelection = (id) => {
      if(selectedIds.includes(id)) setSelectedIds(selectedIds.filter(sid => sid !== id));
      else setSelectedIds([...selectedIds, id]);
  };

  const handleBulkZip = async () => {
      if(selectedIds.length === 0) return;
      try {
          const response = await fetch('http://localhost:5000/api/zip', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({ fileIds: selectedIds })
          });
          if(!response.ok) throw new Error("Zip Failed");
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Ankyy_Bundle_${selectedIds.length}_files.zip`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          setSelectedIds([]);
          setIsSelectMode(false);
      } catch(e) { alert("Could not zip files."); }
  };

  const filteredHistory = history.filter(item => item.type === format);
  const filteredActive = activeDownloads.filter(item => item.format === format);
  const songCount = history.filter(i => i.type === 'mp3').length;
  const videoCount = history.filter(i => i.type === 'mp4').length;

  return (
    // MAIN WRAPPER: Fixed height on Desktop, Full Height on Mobile
    <div className="w-full md:h-[700px] h-[100dvh] relative font-sans overflow-hidden md:rounded-3xl rounded-none shadow-2xl bg-[#09090b] text-white border-0 md:border border-white/10 flex flex-col md:flex-row">
      
      {/* === NAVIGATION (SIDEBAR ON DESKTOP / TOP BAR ON MOBILE) === */}
      <div className="w-full md:w-24 h-auto md:h-full border-b md:border-b-0 md:border-r border-white/10 flex flex-row md:flex-col items-center py-4 md:py-8 z-20 bg-black/40 backdrop-blur-md px-4 md:px-0 gap-4 md:gap-0 justify-between md:justify-start">
          
          {/* Logo */}
          <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center md:mb-10 shadow-[0_0_15px_rgba(255,255,255,0.2)] shrink-0">
              <Icons.Bolt />
          </div>
          
          {/* Nav Controls */}
          <nav className="flex flex-row md:flex-col gap-4 md:gap-6 items-center flex-1 justify-center md:justify-start">
              <NavButton icon={<Icons.Music />} label="Music" active={format === 'mp3'} onClick={() => { setFormat('mp3'); setIsSelectMode(false); }} />
              <NavButton icon={<Icons.Video />} label="Video" active={format === 'mp4'} onClick={() => { setFormat('mp4'); setIsSelectMode(false); }} activeColor="bg-blue-500/20 text-blue-400" />
              
              {/* Desktop: Select Mode Button */}
              <div className="hidden md:flex mt-auto">
                 <NavButton icon={<Icons.SelectAll />} active={isSelectMode} onClick={() => { setIsSelectMode(!isSelectMode); setSelectedIds([]); }} />
              </div>
          </nav>

          {/* Mobile: Select Mode Button */}
          <div className="md:hidden">
              <NavButton icon={<Icons.SelectAll />} active={isSelectMode} onClick={() => { setIsSelectMode(!isSelectMode); setSelectedIds([]); }} />
          </div>
      </div>

      {/* === MAIN CONTENT === */}
      <div className="flex-1 flex flex-col relative z-10 h-full overflow-hidden">
          
          {/* SETTINGS BAR (Chips) - Shown Below Nav on Mobile, Inline/Hidden logic handled via flex */}
          <div className="w-full bg-[#111] border-b border-white/5 py-2 px-4 flex gap-2 overflow-x-auto no-scrollbar md:hidden">
                {format === 'mp3' && (
                    <>
                        <EffectChip label="Normal" active={effect === 'none'} onClick={() => setEffect('none')} />
                        <EffectChip label="Slowed" active={effect === 'slowed'} onClick={() => setEffect('slowed')} />
                        <EffectChip label="Bass" active={effect === 'bassboost'} onClick={() => setEffect('bassboost')} />
                        <EffectChip label="Nightcore" active={effect === 'nightcore'} onClick={() => setEffect('nightcore')} />
                    </>
                )}
                {format === 'mp4' && (
                    <>
                        <QualityChip label="MAX" active={quality === 'max'} onClick={() => setQuality('max')} />
                        <QualityChip label="1080" active={quality === '1080'} onClick={() => setQuality('1080')} />
                        <QualityChip label="720" active={quality === '720'} onClick={() => setQuality('720')} />
                        <QualityChip label="360" active={quality === '360'} onClick={() => setQuality('360')} />
                    </>
                )}
          </div>

          {/* DESKTOP SETTINGS (Integrated into Header or Sidebar - currently in Sidebar, keeping it there for desktop) */}
          <div className="hidden md:flex absolute left-[-90px] top-40 w-20 flex-col gap-2 items-center z-30 pointer-events-none opacity-0">
             {/* This ghost container is just to maintain structure if we wanted floating menus, but for now we keep desktop settings inside the Sidebar component logic below */}
          </div>


          {/* HEADER & DASHBOARD */}
          <div className="px-4 md:px-8 py-6 md:py-8 flex-shrink-0">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
                  <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                      {format === 'mp3' ? 'Music Library' : 'Video Library'}
                  </h1>
                  
                  {/* DASHBOARD STATS */}
                  <div className="flex bg-white/5 border border-white/10 rounded-xl p-1.5 backdrop-blur-sm w-full md:w-auto overflow-x-auto">
                      <div className="flex w-full md:w-auto justify-between md:justify-start gap-0 md:gap-0 min-w-max">
                        <DashboardCard icon={<Icons.Music />} label="Songs" value={songCount} color="text-emerald-400" />
                        <div className="w-[1px] bg-white/10 mx-1"></div>
                        <DashboardCard icon={<Icons.Video />} label="Videos" value={videoCount} color="text-blue-400" />
                        <div className="w-[1px] bg-white/10 mx-1"></div>
                        <DashboardCard icon={<Icons.Disk />} label="Disk" value={`${storageUsed} MB`} color="text-purple-400" />
                      </div>
                  </div>
              </div>

              {/* INPUT BAR */}
              <div className="relative group w-full">
                  <div className="absolute inset-0 bg-white/5 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative flex items-center bg-[#111] border border-white/10 rounded-xl px-4 py-3 md:py-4 focus-within:border-white/30 transition-colors shadow-lg">
                      <div className={`mr-3 md:mr-4 ${format === 'mp4' ? 'text-blue-400' : 'text-emerald-400'}`}><Icons.Link /></div>
                      <input 
                          type="text" 
                          placeholder={isProcessingPlaylist ? "Scanning..." : `Paste Link (${format.toUpperCase()})...`}
                          className="w-full bg-transparent border-none outline-none text-white placeholder-white/20 text-sm font-medium"
                          value={url} onChange={(e) => setUrl(e.target.value)} autoFocus disabled={isProcessingPlaylist}
                      />
                      {isProcessingPlaylist && <div className="text-[10px] md:text-xs text-blue-400 animate-pulse font-mono mr-2">FETCHING...</div>}
                  </div>
              </div>
          </div>
          
          {/* DESKTOP-ONLY SETTINGS PANEL (Injecting into Main View for Desktop since we removed it from Sidebar to make it responsive) */}
          <div className="hidden md:flex px-8 pb-4 gap-2">
             {format === 'mp3' && (
                <>
                    <EffectChip label="Normal" active={effect === 'none'} onClick={() => setEffect('none')} />
                    <EffectChip label="Slowed+Rvrb" active={effect === 'slowed'} onClick={() => setEffect('slowed')} />
                    <EffectChip label="Bass Boost" active={effect === 'bassboost'} onClick={() => setEffect('bassboost')} />
                    <EffectChip label="Nightcore" active={effect === 'nightcore'} onClick={() => setEffect('nightcore')} />
                </>
             )}
             {format === 'mp4' && (
                <>
                    <QualityChip label="MAX" active={quality === 'max'} onClick={() => setQuality('max')} />
                    <QualityChip label="1080" active={quality === '1080'} onClick={() => setQuality('1080')} />
                    <QualityChip label="720" active={quality === '720'} onClick={() => setQuality('720')} />
                    <QualityChip label="360" active={quality === '360'} onClick={() => setQuality('360')} />
                </>
             )}
          </div>

          {/* LIST AREA */}
          <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-20 md:pb-8 space-y-3 custom-scrollbar relative">
              <AnimatePresence>
                  {filteredActive.map((item) => <ProcessingCard key={item.id} item={item} />)}
              </AnimatePresence>
              <AnimatePresence>
                  {filteredHistory.map((file) => (
                      <MinimalRow 
                        key={file.id} file={file} onDelete={() => handleDelete(file.id)}
                        isSelectMode={isSelectMode} isSelected={selectedIds.includes(file.id)} onToggle={() => toggleSelection(file.id)}
                      />
                  ))}
              </AnimatePresence>
              {filteredHistory.length === 0 && filteredActive.length === 0 && (
                  <div className="h-40 flex flex-col items-center justify-center text-white/20 text-xs tracking-widest uppercase">
                      <div className="mb-2 opacity-50">{format === 'mp3' ? <Icons.Music /> : <Icons.Video />}</div>
                      <span>No Files</span>
                  </div>
              )}
          </div>
          
          {/* BULK ACTION */}
          <AnimatePresence>
            {isSelectMode && selectedIds.length > 0 && (
                <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#222] border border-white/20 rounded-full px-6 py-3 flex items-center gap-4 shadow-2xl z-50 w-max max-w-[90%]">
                    <span className="text-xs font-mono text-white/70 whitespace-nowrap">{selectedIds.length} SELECTED</span>
                    <button onClick={handleBulkZip} className="bg-white text-black px-4 py-1.5 rounded-full text-xs font-bold hover:bg-gray-200 flex items-center gap-2 whitespace-nowrap"><Icons.Zip /> ZIP</button>
                </motion.div>
            )}
          </AnimatePresence>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS (Responsive Tweaks) ---

const NavButton = ({ icon, active, onClick, activeColor, label }) => (
    <button onClick={onClick} className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${active ? (activeColor || 'bg-white/10 text-white') + ' shadow-[0_0_10px_rgba(255,255,255,0.1)]' : 'text-white/30 hover:text-white'}`}>
        {icon}
    </button>
);

const QualityChip = ({ label, active, onClick }) => (
    <button onClick={onClick} className={`text-[10px] font-mono px-3 py-1.5 md:py-1 rounded-full md:rounded border transition-colors whitespace-nowrap ${active ? 'bg-blue-500 border-blue-500 text-white font-bold' : 'border-white/10 text-white/40 hover:text-white hover:bg-white/5'}`}>{label}</button>
);
const EffectChip = ({ label, active, onClick }) => (
    <button onClick={onClick} className={`text-[10px] font-mono px-3 py-1.5 md:py-1 rounded-full md:rounded border transition-colors whitespace-nowrap ${active ? 'bg-emerald-500 border-emerald-500 text-white font-bold' : 'border-white/10 text-white/40 hover:text-white hover:bg-white/5'}`}>{label}</button>
);

const DashboardCard = ({ icon, label, value, color }) => (
    <div className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 flex-1 md:flex-none justify-center md:justify-start">
        <div className={`text-white/20 scale-75 md:scale-100`}>{icon}</div>
        <div className="flex flex-col">
            <span className={`text-xs md:text-sm font-bold font-mono tracking-tight ${color}`}>{value}</span>
            <span className="text-[9px] md:text-[10px] text-white/40 uppercase tracking-wider font-semibold">{label}</span>
        </div>
    </div>
);

const ProcessingCard = ({ item }) => (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="w-full bg-[#161618] border border-white/5 rounded-xl p-3 md:p-4 mb-2 overflow-hidden">
        <div className="flex justify-between items-center mb-2 md:mb-3">
            <span className="text-xs font-medium text-white/80 truncate w-2/3">{item.title || item.url}</span>
            <span className="text-[10px] font-mono text-white/50">{Math.round(item.progress)}%</span>
        </div>
        <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
            <motion.div className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" initial={{ width: 0 }} animate={{ width: `${item.progress}%` }} />
        </div>
        <div className="mt-2 flex justify-between items-center">
             <span className="text-[10px] text-white/40 tracking-wide uppercase">{item.status}</span>
             {item.status !== 'Queued...' && item.status !== 'Failed' && <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-3 h-3 border border-white/20 border-t-white rounded-full"/>}
        </div>
    </motion.div>
);

const MinimalRow = ({ file, onDelete, isSelectMode, isSelected, onToggle }) => (
    <motion.div layout onClick={isSelectMode ? onToggle : undefined} className={`group w-full rounded-xl p-2 md:p-3 flex items-center gap-3 md:gap-4 transition-all duration-200 cursor-pointer ${isSelected ? 'bg-white/10 border border-white/20' : 'bg-transparent hover:bg-white/5 border border-transparent'}`}>
        {isSelectMode && <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-white border-white' : 'border-white/30'}`}>{isSelected && <div className="text-black"><Icons.Check /></div>}</div>}
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-white/5 overflow-hidden relative shrink-0">
            {file.thumbnail ? <img src={file.thumbnail} alt="cover" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" /> : null}
        </div>
        <div className="flex-1 min-w-0">
            <h4 className="text-xs md:text-sm font-medium text-white/90 truncate">{file.title}</h4>
            <div className="flex items-center gap-2 md:gap-3 mt-0.5 md:mt-1 text-[10px] text-white/40 font-mono uppercase truncate">
                <span className={file.type === 'mp4' ? 'text-blue-400' : 'text-emerald-400'}>{file.type.toUpperCase()}</span>
                {/* On mobile, hide extra details if text is too long, but flex usually handles it */}
                <span className="w-0.5 h-0.5 bg-white/40 rounded-full"></span>
                <span>{file.size ? `${file.size} MB` : '...'}</span>
            </div>
        </div>
        {!isSelectMode && (
            <div className="flex items-center gap-2 md:gap-3 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-white/20 hover:text-red-400 p-1"><Icons.Trash /></button>
                <a href={`http://localhost:5000/downloads/${file.filename}`} download target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-black hover:scale-110 transition-transform"><Icons.Download /></a>
            </div>
        )}
    </motion.div>
);

export default MusicBox;