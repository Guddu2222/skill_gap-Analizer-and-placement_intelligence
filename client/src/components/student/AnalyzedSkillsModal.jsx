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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      {/* Click outside to close (Optional, easy added layer) */}
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden relative z-10 transform scale-100 animate-slideUpFade">
        {/* Header */}
        <div className="flex items-center justify-between p-5 md:p-6 border-b border-slate-100 bg-white shadow-sm z-10">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <span className="text-xl md:text-2xl">⚡</span>
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-slate-800 leading-tight">Analyzed Skills Inventory</h2>
              <p className="text-xs md:text-sm text-slate-500 font-medium">Breakdown of your current technical alignment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors active:scale-95"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Tabs Layer */}
        <div className="flex items-center justify-between px-2 pt-2 bg-slate-50/50 border-b border-slate-100 shrink-0 overflow-x-auto hide-scrollbar">
          <div className="flex items-center gap-1 md:gap-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 md:gap-2 px-3 py-3 rounded-t-xl transition-all border-b-2 font-medium text-[13px] md:text-sm whitespace-nowrap
                    ${isActive 
                      ? `${tab.borderColor} ${tab.color} ${tab.bgClass}` 
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
                    }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? tab.color : 'text-slate-400'}`} />
                  {tab.label}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold ${isActive ? `${tab.pillBg} ${tab.pillText}` : 'bg-slate-200/70 text-slate-500'}`}>
                    {tab.counts}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="p-4 md:p-6 pb-8 overflow-y-auto flex-1 bg-slate-50/50">
          {renderContent()}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AnalyzedSkillsModal;
