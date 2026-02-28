import React from 'react';
import { BookOpen, ExternalLink, Award, Clock } from 'lucide-react';

const RecommendedCourses = ({ analysis }) => {
  if (!analysis) {
    return (
      <div className="bg-white p-12 text-center rounded-3xl border border-slate-100 shadow-sm">
        <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">No Courses Available</h3>
        <p className="text-slate-500 font-medium">Run a skill gap analysis to get personalized curriculum recommendations.</p>
      </div>
    );
  }

  const courses = analysis.recommendedCourses || [];
  const certs = analysis.recommendedCertifications || [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
           <BookOpen className="w-6 h-6 mr-3 text-indigo-600" />
           Recommended Courses
        </h2>
        
        {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, idx) => (
                <a 
                  key={idx} 
                  href={course.url || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:border-indigo-300 transition-all group flex flex-col h-full"
                >
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">{course.platform}</p>
                  <h3 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-indigo-600 transition-colors">
                     {course.title}
                  </h3>
                  <div className="flex-grow"></div>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 font-medium">
                     <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {course.duration || 'Self-paced'}</span>
                     <span className={`px-2 py-1 rounded-md text-xs font-bold ${course.price?.toLowerCase() === 'free' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                        {course.price || 'Paid'}
                     </span>
                  </div>
                </a>
              ))}
            </div>
        ) : (
           <p className="text-slate-500 italic">No specific courses recommended at this time.</p>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center mt-12">
           <Award className="w-6 h-6 mr-3 text-amber-500" />
           Valuable Certifications
        </h2>
        
        {certs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certs.map((cert, idx) => (
                <div key={idx} className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 p-6 flex justify-between items-center shadow-sm hover:shadow-md transition-all">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{cert.name}</h3>
                    <p className="text-slate-500 text-sm mt-1">Issued by: <span className="font-semibold text-slate-700">{cert.issuer}</span></p>
                  </div>
                  <a 
                    href={cert.url || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              ))}
            </div>
         ) : (
           <p className="text-slate-500 italic">No specific certifications recommended at this time.</p>
         )}
      </div>
    </div>
  );
};

export default RecommendedCourses;
