import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle, TrendingUp, AlertCircle } from "lucide-react";

/**
 * AnalyzedSkillsModal
 * A focused dialog box showing the breakdown of parsed skills without navigating away from the dashboard.
 */
const AnalyzedSkillsModal = ({ isOpen, onClose, analysis }) => {
  const [activeTab, setActiveTab] = useState("strong");

  // Prevent background scrolling when open
  useEffect(() => {
    if (!isOpen) return;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const originalOverflow = document.body.style.overflow;
    const originalPadding = document.body.style.paddingRight;
    
    document.body.style.overflow = "hidden";
    // Avoid layout shift when scrollbar disappears
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPadding;
    };
  }, [isOpen]);

  if (!isOpen || !analysis) return null;

  const tabs = [
    { 
      id: "strong", 
      label: "Strong Skills", 
      icon: CheckCircle, 
      color: "text-green-600", 
      borderColor: "border-green-500",
      bgClass: "bg-green-100/50",
      pillBg: "bg-green-100",
      pillText: "text-green-700",
      counts: analysis.strongSkills?.length || 0 
    },
    { 
      id: "improve", 
      label: "To Improve", 
      icon: TrendingUp, 
      color: "text-amber-600", 
      borderColor: "border-amber-500",
      bgClass: "bg-amber-100/30",
      pillBg: "bg-amber-100",
      pillText: "text-amber-700",
      counts: analysis.skillsToImprove?.length || 0 
    },
    { 
      id: "missing", 
      label: "Missing Skills", 
      icon: AlertCircle, 
      color: "text-red-600", 
      borderColor: "border-red-500",
      bgClass: "bg-red-50",
      pillBg: "bg-red-100",
      pillText: "text-red-700",
      counts: analysis.missingSkills?.length || 0 
    },
  ];

  const renderContent = () => {
    let skills = [];
    if (activeTab === "strong") skills = analysis.strongSkills || [];
    else if (activeTab === "improve") skills = analysis.skillsToImprove || [];
    else if (activeTab === "missing") skills = analysis.missingSkills || [];

    if (skills.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-slate-400">
          <p className="text-sm">No skills found in this category.</p>
        </div>
      );
    }

    return (
      <div className="space-y-3 mt-4">
        {skills.map((skill, index) => {
          // Normalize string vs object formats
          const name = typeof skill === 'string' ? skill : skill.name || skill.skill || "Skill";
          const reason = typeof skill !== 'string' ? skill.reason || skill.description : null;

          return (
            <div key={index} className="flex items-start bg-white border border-slate-100 rounded-xl p-4 hover:shadow-md transition-all group">
              <div className={`mt-1 mr-3 w-2 h-2 rounded-full flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity ${
                activeTab === 'strong' ? 'bg-green-500' : activeTab === 'improve' ? 'bg-amber-500' : 'bg-red-500'
              }`} />
              <div>
                <h4 className="font-semibold text-slate-800 text-[15px] mb-1">{name}</h4>
                {reason && (
                  <p className="text-xs text-slate-500 leading-relaxed max-w-xl">{reason}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="glass-abyssal rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden relative z-10 border border-white/10 transform scale-100 animate-slideUpFade">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-gradient-to-r from-indigo-950/40 to-transparent shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <span className="text-2xl text-indigo-400">⚡</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Analyzed Skills Inventory</h2>
              <p className="text-xs text-indigo-300 font-bold uppercase tracking-widest mt-0.5">Skill Breakdown Insight</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all border border-white/0 hover:border-white/10 active:scale-95"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs Layer */}
        <div className="flex items-center justify-between px-4 pt-2 bg-black/20 border-b border-white/5 shrink-0 overflow-x-auto hide-scrollbar">
          <div className="flex items-center gap-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              const tabStyles = {
                strong: "border-emerald-500 text-emerald-400 bg-emerald-500/5",
                improve: "border-amber-500 text-amber-400 bg-amber-500/5",
                missing: "border-rose-500 text-rose-400 bg-rose-500/5"
              };

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-4 py-4 rounded-t-xl transition-all border-b-2 font-black text-xs uppercase tracking-widest whitespace-nowrap
                    ${isActive 
                      ? tabStyles[tab.id]
                      : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5'
                    }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? '' : 'text-slate-600'}`} />
                  {tab.label}
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${isActive ? 'bg-white/10' : 'bg-black/40'}`}>
                    {tab.counts}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="p-6 pb-10 overflow-y-auto flex-1 bg-black/10">
          {skills.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 text-slate-500">
               <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 opacity-20" />
               </div>
               <p className="text-xs font-bold uppercase tracking-widest">No skills in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {skills.map((skill, index) => {
                const name = typeof skill === 'string' ? skill : skill.name || skill.skill || "Skill";
                const reason = typeof skill !== 'string' ? skill.reason || skill.reasoning || skill.description : null;
                const level = typeof skill !== 'string' ? skill.currentLevel || skill.strengthLevel : null;

                return (
                  <div key={index} className="flex items-start bg-white/2 border border-white/5 rounded-2xl p-5 hover:bg-white/5 hover:border-indigo-500/30 transition-all group">
                    <div className={`mt-1.5 mr-4 w-2 h-2 rounded-full flex-shrink-0 shadow-[0_0_8px_currentColor] ${
                      activeTab === 'strong' ? 'text-emerald-500 bg-emerald-500' : 
                      activeTab === 'improve' ? 'text-amber-500 bg-amber-500' : 
                      'text-rose-500 bg-rose-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="font-bold text-white text-[15px] tracking-tight">{name}</h4>
                        {level && (
                          <span className="text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded bg-white/5 text-indigo-300 border border-white/5">
                            {level}
                          </span>
                        )}
                      </div>
                      {reason && (
                        <p className="text-xs text-slate-400 leading-relaxed max-w-xl group-hover:text-slate-300 transition-colors">{reason}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AnalyzedSkillsModal;
