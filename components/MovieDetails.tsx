import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Play, Star, ShieldCheck, X, Download, Send, ExternalLink } from 'lucide-react';
import { Movie, Episode } from '../types';

interface MovieDetailsProps {
  movie: Movie;
  onClose: () => void;
  botUsername: string;
  channelLink: string;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie, onClose, botUsername, channelLink }) => {
  const [activeTab, setActiveTab] = useState<'episodes' | 'info'>('episodes');
  const [selectedSeason, setSelectedSeason] = useState<number>(1);

  // ✅ Watch হ্যান্ডলার - Stream/Watch এর জন্য
  const handleWatch = (code: string) => {
    const url = `https://t.me/${botUsername}?start=${code}`;
    
    // @ts-ignore
    if (window.Telegram?.WebApp) {
        // @ts-ignore
        window.Telegram.WebApp.openTelegramLink(url);
    } else {
        window.open(url, '_blank');
    }
  };

  // ✅ Download হ্যান্ডলার - Download এর জন্য
  const handleDownload = (downloadCode?: string, downloadLink?: string, fallbackCode?: string) => {
    if (downloadLink) {
      // যদি external link দেওয়া থাকে (Google Drive, Mega, etc)
      window.open(downloadLink, '_blank');
    } else if (downloadCode) {
      // যদি আলাদা download telegram code দেওয়া থাকে
      const url = `https://t.me/${botUsername}?start=${downloadCode}`;
      // @ts-ignore
      if (window.Telegram?.WebApp) {
          // @ts-ignore
          window.Telegram.WebApp.openTelegramLink(url);
      } else {
          window.open(url, '_blank');
      }
    } else if (fallbackCode) {
      // নাহলে watch code ই ব্যবহার করবে (backward compatibility)
      handleWatch(fallbackCode);
    }
  };

  const isSeries = movie.category === 'Series' || movie.category === 'Korean Drama' || (movie.episodes && movie.episodes.length > 0);

  // ✅ Group episodes by season - Fixed version
  const episodesBySeason = useMemo(() => {
      if (!movie.episodes) return {};
      const groups: Record<number, typeof movie.episodes> = {};
      movie.episodes.forEach(ep => {
          const s = ep.season || 1;
          if (!groups[s]) groups[s] = [];
          groups[s].push(ep);
      });
      // Sort episodes within each season by number
      Object.keys(groups).forEach(season => {
          groups[Number(season)].sort((a, b) => a.number - b.number);
      });
      return groups;
  }, [movie.episodes]);

  const availableSeasons = Object.keys(episodesBySeason).map(Number).sort((a,b) => a-b);
  const currentEpisodes = episodesBySeason[selectedSeason] || [];
  
  // ✅ Check if current season is locked
  const isSeasonLocked = movie.lockedSeasons?.includes(selectedSeason) || false;
  const seasonReleaseInfo = movie.seasonReleaseInfo?.[selectedSeason];

  return (
      <motion.div
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-0 z-[100] bg-[#000] flex flex-col h-full font-sans"
      >
        {/* ✅ Parallax Background - Optimized for 2:3 portrait or 16:9 landscape */}
        <div className="absolute top-0 left-0 w-full h-[55vh] z-0">
             <img
              src={movie.detailBanner || movie.thumbnail}
              alt={movie.title}
              className="w-full h-full object-cover object-top opacity-50 mask-image-gradient"
              style={{ objectPosition: movie.detailBanner ? 'center top' : 'center center' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#000] via-[#000]/85 to-transparent" />
        </div>

        {/* Fixed Header with Working Close Button */}
        <div className="absolute top-0 inset-x-0 z-[110] flex justify-between items-center p-4 pt-6 pointer-events-none">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
                className="pointer-events-auto w-10 h-10 rounded-full bg-black/50 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/10 active:scale-90 transition-all shadow-lg"
            >
                <X size={22} />
            </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 pt-[35vh]">
            <div className="px-6 pb-24 bg-gradient-to-t from-black via-black to-transparent min-h-[65vh]">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {/* Tags */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="bg-gold text-black px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-widest shadow-[0_0_10px_rgba(255,215,0,0.3)]">
                    {movie.category}
                  </span>
                  <span className="bg-white/10 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-gray-200 border border-white/10">
                      {movie.quality || 'HD'}
                  </span>
                  {movie.year && (
                     <span className="text-gray-400 text-xs font-bold pl-1">• {movie.year}</span>
                  )}
                  {/* Download Available Badge */}
                  {(movie.downloadCode || movie.downloadLink) && (
                    <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-[9px] font-bold border border-green-500/30">
                      ⬇ DOWNLOAD
                    </span>
                  )}
                </div>
                
                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-serif font-black text-white leading-[1.0] mb-4 drop-shadow-2xl">
                  {movie.title}
                </h1>

                {/* ✅ Professional Metadata Row - No "size", "length" etc */}
                {(movie.duration || movie.audioLanguage || movie.subtitles || movie.videoQuality) && (
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    {movie.duration && (
                      <div className="flex items-center gap-1.5 bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/20">
                        <span className="text-purple-400">⏱</span>
                        <span className="text-xs font-bold text-purple-300">{movie.duration}</span>
                      </div>
                    )}
                    {movie.videoQuality && (
                      <div className="flex items-center gap-1.5 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20">
                        <span className="text-blue-400">🎬</span>
                        <span className="text-xs font-bold text-blue-300">{movie.videoQuality}</span>
                      </div>
                    )}
                    {movie.audioLanguage && (
                      <div className="flex items-center gap-1.5 bg-orange-500/10 px-3 py-1.5 rounded-lg border border-orange-500/20">
                        <span className="text-orange-400">🔊</span>
                        <span className="text-xs font-bold text-orange-300">{movie.audioLanguage}</span>
                      </div>
                    )}
                    {movie.subtitles && (
                      <div className="flex items-center gap-1.5 bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20">
                        <span className="text-green-400">💬</span>
                        <span className="text-xs font-bold text-green-300">{movie.subtitles}</span>
                      </div>
                    )}
                  </div>
                )}
                        <span className="text-xs font-bold text-green-300">{movie.fileSize}</span>
                      </div>
                    )}
                    {movie.audioLanguage && (
                      <div className="flex items-center gap-1.5 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20">
                        <span className="text-blue-400">🔊</span>
                        <span className="text-xs font-bold text-blue-300">{movie.audioLanguage}</span>
                      </div>
                    )}
                    {movie.subtitles && (
                      <div className="flex items-center gap-1.5 bg-pink-500/10 px-3 py-1.5 rounded-lg border border-pink-500/20">
                        <span className="text-pink-400">💬</span>
                        <span className="text-xs font-bold text-pink-300">{movie.subtitles}</span>
                      </div>
                    )}
                    {movie.videoQuality && (
                      <div className="flex items-center gap-1.5 bg-yellow-500/10 px-3 py-1.5 rounded-lg border border-yellow-500/20">
                        <span className="text-yellow-400">📺</span>
                        <span className="text-xs font-bold text-yellow-300">{movie.videoQuality}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs font-semibold text-gray-300 mb-8 border-b border-white/10 pb-6">
                  <div className="flex items-center gap-1.5 text-gold">
                    <Star size={14} fill="#FFD700" />
                    <span className="text-white">{movie.rating}</span>
                  </div>
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                  <span>{movie.views} Views</span>
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                  <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-green-500"/> Verified</span>
                </div>

                {/* ✅ FIXED: Action Buttons for Movies - Now with SEPARATE functionality */}
                {!isSeries && (
                  <div className="flex flex-col gap-3 w-full mb-8">
                    <div className="flex gap-3">
                        {/* Watch/Stream Button */}
                        <button
                          onClick={() => handleWatch(movie.telegramCode)}
                          className="flex-1 bg-gold text-black py-4 px-6 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,215,0,0.2)] hover:bg-[#ffe033] active:scale-98 transition-all"
                        >
                          <Play size={20} fill="black" />
                          STREAM NOW
                        </button>
                        
                        {/* Download Button - NOW WITH SEPARATE FUNCTIONALITY */}
                        <button
                          onClick={() => handleDownload(movie.downloadCode, movie.downloadLink, movie.telegramCode)}
                          className="flex-1 bg-[#1a1a1a] border border-white/10 text-white py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#222] active:scale-98 transition-all"
                        >
                          {movie.downloadLink ? <ExternalLink size={20} /> : <Download size={20} />}
                          DOWNLOAD
                        </button>
                    </div>
                    
                    {/* Telegram Join Box */}
                    <div 
                        onClick={() => window.open(channelLink, '_blank')}
                        className="mt-2 w-full p-3 rounded-xl bg-[#0088cc]/10 border border-[#0088cc]/30 flex items-center justify-center cursor-pointer active:scale-98 transition-transform"
                    >
                        <Send size={24} className="text-[#0088cc]" />
                    </div>
                  </div>
                )}

                {/* Tabs for Series */}
                {isSeries && (
                    <div className="flex items-center gap-6 mb-6 border-b border-white/10">
                    <button 
                        onClick={() => setActiveTab('episodes')}
                        className={`pb-3 text-xs font-bold tracking-wider uppercase transition-all ${activeTab === 'episodes' ? 'text-gold border-b-2 border-gold' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Episodes
                    </button>
                    <button 
                        onClick={() => setActiveTab('info')}
                        className={`pb-3 text-xs font-bold tracking-wider uppercase transition-all ${activeTab === 'info' ? 'text-gold border-b-2 border-gold' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        About
                    </button>
                    </div>
                )}

                {/* Content Area */}
                <div className="min-h-[200px]">
                    {/* ✅ FIXED: Episodes Tab with SEPARATE Watch and Download buttons */}
                    {isSeries && activeTab === 'episodes' && (
                        <div>
                           {/* Season Selector */}
                           {availableSeasons.length > 0 && (
                               <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-2">
                                   {availableSeasons.map(seasonNum => (
                                       <button
                                         key={seasonNum}
                                         onClick={() => setSelectedSeason(seasonNum)}
                                         className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${selectedSeason === seasonNum ? 'bg-gold text-black' : 'bg-white/10 text-gray-400 hover:text-white'}`}
                                       >
                                           Season {seasonNum}
                                       </button>
                                   ))}
                               </div>
                           )}

                           {/* Episode List - ENHANCED WITH SEASON LOCK & BETTER THUMBNAILS */}
                           <div className="space-y-3">
                              {/* ✅ Season Locked Message */}
                              {isSeasonLocked ? (
                                <div className="text-center py-16 space-y-4">
                                  <div className="text-6xl mb-4">🔒</div>
                                  <h3 className="text-2xl font-bold text-white">Season {selectedSeason}</h3>
                                  <p className="text-gold font-bold text-lg">COMING SOON</p>
                                  {seasonReleaseInfo?.releaseDate && (
                                    <p className="text-gray-400 text-sm">
                                      📅 Releases on {seasonReleaseInfo.releaseDate}
                                    </p>
                                  )}
                                  {seasonReleaseInfo?.comingSoonMessage && (
                                    <p className="text-gray-500 text-sm max-w-md mx-auto">
                                      {seasonReleaseInfo.comingSoonMessage}
                                    </p>
                                  )}
                                </div>
                              ) : currentEpisodes.length > 0 ? currentEpisodes.map((ep, index) => {
                                const isLocked = ep.isComingSoon || ep.isUpcoming;
                                return (
                                  <motion.div 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    key={ep.id} 
                                    className={`group flex items-center gap-3 p-3 rounded-xl bg-[#111] border border-white/5 hover:bg-[#1a1a1a] transition-all ${isLocked ? 'opacity-60' : 'hover:border-gold/30'}`}
                                  >
                                    {/* ✅ Episode Thumbnail - 16:9 Ratio Perfect */}
                                    <div 
                                      onClick={() => !isLocked && handleWatch(ep.telegramCode)}
                                      className={`relative rounded-lg overflow-hidden shrink-0 ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02]'} transition-transform aspect-video w-28`}
                                    >
                                        {ep.thumbnail ? (
                                          // Premium: Episode specific thumbnail (16:9)
                                          <>
                                            <img src={ep.thumbnail} className="absolute inset-0 w-full h-full object-cover" alt={ep.title} />
                                            {isLocked && <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center text-2xl">🔒</div>}
                                            {!isLocked && <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 flex items-center justify-center transition-all">
                                              <Play size={24} fill="white" className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-2xl" />
                                            </div>}
                                          </>
                                        ) : (
                                          // Default: Movie thumbnail fallback
                                          <>
                                            <img src={movie.thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm" alt="" />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                              {isLocked ? (
                                                <div className="text-2xl">🔒</div>
                                              ) : (
                                                <Play size={20} fill="white" className="text-white drop-shadow-lg" />
                                              )}
                                            </div>
                                          </>
                                        )}
                                    </div>

                                    {/* ✅ Episode Info - Clean & Professional */}
                                    <div 
                                      onClick={() => !isLocked && handleWatch(ep.telegramCode)}
                                      className={`flex-1 min-w-0 ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                    >
                                        <div className="flex justify-between items-start mb-1.5">
                                            <h4 className="text-sm font-bold text-white group-hover:text-gold transition-colors truncate pr-2 leading-tight">
                                                {ep.number}. {ep.title}
                                            </h4>
                                            <span className="text-[10px] font-mono text-gray-400 bg-black/50 px-2 py-0.5 rounded shrink-0">{ep.duration}</span>
                                        </div>
                                        
                                        {/* ✅ Professional Metadata (no fileSize) */}
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-[10px] text-gray-500 font-medium">S{ep.season} • E{ep.number}</span>
                                            
                                            {ep.quality && (
                                              <span className="text-[9px] text-blue-300 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                                                {ep.quality}
                                              </span>
                                            )}
                                            {ep.audioLanguage && (
                                              <span className="text-[9px] text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
                                                🔊 {ep.audioLanguage}
                                              </span>
                                            )}
                                            {ep.subtitles && (
                                              <span className="text-[9px] text-green-300 bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/20">
                                                💬 Subs
                                              </span>
                                            )}
                                            
                                            {/* Coming Soon Indicator */}
                                            {isLocked && (
                                              <span className="text-[9px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-500/30 font-bold">
                                                🔒 COMING SOON
                                                {ep.releaseDate && ` • ${ep.releaseDate}`}
                                              </span>
                                            )}
                                            
                                            {/* Download Available Badge */}
                                            {!isLocked && (ep.downloadCode || ep.downloadLink) && (
                                              <span className="text-[9px] text-emerald-400 flex items-center gap-0.5 font-medium">
                                                <Download size={9} />
                                                Download
                                              </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* ✅ Action Buttons - Beautiful & Functional */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        {/* Download Button */}
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            if (!isLocked) {
                                              handleDownload(ep.downloadCode, ep.downloadLink, ep.telegramCode);
                                            }
                                          }}
                                          disabled={isLocked}
                                          className={`p-3 border rounded-xl transition-all ${
                                            isLocked 
                                              ? 'bg-gray-800 border-gray-700 cursor-not-allowed opacity-30'
                                              : 'bg-[#1a1a1a] hover:bg-emerald-500/10 border-white/10 hover:border-emerald-500/30 active:scale-95'
                                          } group/btn`}
                                          title={isLocked ? "Coming Soon" : "Download Episode"}
                                        >
                                          {ep.downloadLink ? (
                                            <ExternalLink size={16} className="text-gray-400 group-hover/btn:text-emerald-400 transition-colors" />
                                          ) : (
                                            <Download size={16} className="text-gray-400 group-hover/btn:text-emerald-400 transition-colors" />
                                          )}
                                        </button>
                                        
                                        {/* Watch Button */}
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            if (!isLocked) {
                                              handleWatch(ep.telegramCode);
                                            }
                                          }}
                                          disabled={isLocked}
                                          className={`p-3 border rounded-xl transition-all ${
                                            isLocked 
                                              ? 'bg-gray-800 border-gray-700 cursor-not-allowed opacity-30'
                                              : 'bg-gold/10 hover:bg-gold/20 border-gold/30 hover:border-gold/50 active:scale-95 shadow-[0_0_15px_rgba(255,215,0,0.1)]'
                                          }`}
                                          title={isLocked ? "Coming Soon" : "Watch Episode"}
                                        >
                                          <Play size={16} fill={isLocked ? "gray" : "#FFD700"} className={isLocked ? "text-gray-600" : "text-gold"} />
                                        </button>
                                    </div>
                                  </motion.div>
                                );
                              }) : (
                                  <div className="text-center py-12 text-gray-500 text-sm">
                                    <div className="mb-2 text-2xl">📺</div>
                                    No episodes available for Season {selectedSeason}
                                  </div>
                              )}
                           </div>
                        </div>
                    )}

                    {/* Info Tab */}
                    {(!isSeries || activeTab === 'info') && (
                        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                             <p className="text-gray-300 text-sm leading-7 font-medium opacity-90">
                                {movie.description || 'No description available for this content.'}
                            </p>
                            
                            {/* ✅ Enhanced Screenshots Gallery - Beautiful Grid with Lightbox */}
                            {movie.screenshots && movie.screenshots.length > 0 && (
                              <div className="space-y-4">
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                  <span className="text-lg">📸</span>
                                  Screenshots
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                  {movie.screenshots.slice(0, 8).map((screenshot, idx) => (
                                    <div 
                                      key={idx}
                                      className="relative aspect-video rounded-xl overflow-hidden bg-[#0a0a0a] border border-white/10 group cursor-pointer hover:border-gold/40 transition-all"
                                      onClick={() => {
                                        // ✅ Better fullscreen preview with backdrop
                                        const overlay = document.createElement('div');
                                        overlay.className = 'fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300';
                                        overlay.onclick = () => overlay.remove();
                                        
                                        const container = document.createElement('div');
                                        container.className = 'relative max-w-7xl w-full';
                                        
                                        const img = document.createElement('img');
                                        img.src = screenshot;
                                        img.className = 'w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-2xl';
                                        img.alt = `Screenshot ${idx + 1}`;
                                        
                                        const closeBtn = document.createElement('button');
                                        closeBtn.innerHTML = '✕';
                                        closeBtn.className = 'absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-full text-white text-xl font-bold transition-all';
                                        closeBtn.onclick = (e) => {
                                          e.stopPropagation();
                                          overlay.remove();
                                        };
                                        
                                        const info = document.createElement('div');
                                        info.className = 'absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10';
                                        info.innerHTML = `<span class="text-white text-sm font-medium">Screenshot ${idx + 1} of ${movie.screenshots.length}</span>`;
                                        
                                        container.appendChild(img);
                                        container.appendChild(closeBtn);
                                        container.appendChild(info);
                                        overlay.appendChild(container);
                                        document.body.appendChild(overlay);
                                      }}
                                    >
                                      <img 
                                        src={screenshot} 
                                        alt={`Screenshot ${idx + 1}`}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        loading="lazy"
                                      />
                                      {/* Hover Overlay */}
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                                          <span className="text-[10px] text-white font-medium bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                                            Screenshot {idx + 1}
                                          </span>
                                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-1.5">
                                            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                            </svg>
                                          </div>
                                        </div>
                                      </div>
                                      {/* Premium Shine Effect */}
                                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                {movie.screenshots.length > 8 && (
                                  <p className="text-xs text-gray-500 text-center">
                                    Showing 8 of {movie.screenshots.length} screenshots
                                  </p>
                                )}
                              </div>
                            )}
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-[#111] p-3 rounded-xl border border-white/5">
                                    <span className="text-[10px] text-gray-500 uppercase block mb-1">Rating</span>
                                    <span className="text-xs text-white font-semibold flex items-center gap-1">
                                      <Star size={12} fill="#FFD700" className="text-gold" />
                                      {movie.rating}/10
                                    </span>
                                </div>
                                <div className="bg-[#111] p-3 rounded-xl border border-white/5">
                                    <span className="text-[10px] text-gray-500 uppercase block mb-1">Genre</span>
                                    <span className="text-xs text-white font-semibold">{movie.category}</span>
                                </div>
                                <div className="bg-[#111] p-3 rounded-xl border border-white/5">
                                    <span className="text-[10px] text-gray-500 uppercase block mb-1">Quality</span>
                                    <span className="text-xs text-white font-semibold">{movie.quality || 'HD'}</span>
                                </div>
                                <div className="bg-[#111] p-3 rounded-xl border border-white/5">
                                    <span className="text-[10px] text-gray-500 uppercase block mb-1">Year</span>
                                    <span className="text-xs text-white font-semibold">{movie.year || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

              </motion.div>
            </div>
        </div>
      </motion.div>
  );
};

export default MovieDetails;
