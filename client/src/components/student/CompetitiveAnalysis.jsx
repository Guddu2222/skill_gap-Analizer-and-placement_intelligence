import React from 'react';
import { Users, AlertCircle } from 'lucide-react';

const CompetitiveAnalysis = ({ student, analysis }) => {
  return (
    <div className="bg-white p-12 text-center rounded-3xl border border-slate-100 shadow-sm">
      <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-slate-900 mb-2">Competitive Analysis</h3>
      <p className="text-slate-500 font-medium mb-6">See how you stack up against other candidates competing for {analysis?.targetRole || 'your target role'}.</p>
      <div className="inline-flex items-center text-amber-600 bg-amber-50 px-4 py-2 rounded-lg font-medium text-sm border border-amber-200">
        <AlertCircle className="w-4 h-4 mr-2" />
        This feature is coming soon in Phase 3!
      </div>
    </div>
  );
};

export default CompetitiveAnalysis;
