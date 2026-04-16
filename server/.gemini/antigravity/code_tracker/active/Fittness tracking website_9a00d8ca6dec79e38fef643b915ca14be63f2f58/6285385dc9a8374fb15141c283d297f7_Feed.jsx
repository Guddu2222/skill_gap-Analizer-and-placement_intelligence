£import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Feed() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/friends/feed')
      .then(res => setWorkouts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center p-10 text-gray-400">Loading feed...</div>;

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-accent-500">
          Community Feed
        </h1>
        <p className="text-gray-400">See what your friends are up to</p>
      </header>

      {workouts.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
          <p className="text-gray-400 text-lg">No activity yet.</p>
          <p className="text-gray-500 text-sm mt-2">Follow more people to see their workouts here!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {workouts.map(workout => (
            <div key={workout._id} className="glass-card">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg">
                  {workout.user?.name?.[0].toUpperCase() || '?'}
                </div>
                <div>
                  <h3 className="font-bold text-white">{workout.user?.name || 'Unknown User'}</h3>
                  <p className="text-xs text-gray-400">{new Date(workout.date).toLocaleDateString()} at {new Date(workout.date).toLocaleTimeString()}</p>
                </div>
              </div>
              
              <div className="pl-14">
                <div className="flex items-center gap-2 mb-2">
                   <span className="bg-primary-500/20 text-primary-300 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                     Workout
                   </span>
                   {workout.notes && <span className="text-gray-400 text-sm italic">- "{workout.notes}"</span>}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                  {workout.exercises.map((ex, i) => (
                    <div key={i} className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <p className="font-medium text-gray-200">{ex.name}</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {ex.sets} sets x {ex.reps} reps
                        {ex.weightKg ? ` @ ${ex.weightKg}kg` : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
£"(9a00d8ca6dec79e38fef643b915ca14be63f2f582Jfile:///d:/project/Fittness%20tracking%20website/client/src/pages/Feed.jsx:0file:///d:/project/Fittness%20tracking%20website