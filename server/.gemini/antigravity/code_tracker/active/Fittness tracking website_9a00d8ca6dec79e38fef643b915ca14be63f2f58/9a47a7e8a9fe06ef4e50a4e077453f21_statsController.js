ï	import Meal from '../models/Meal.js';
import Workout from '../models/Workout.js';

export async function dailySummary(req, res) {
  try {
    const { date } = req.query; // ISO date string
    const day = date ? new Date(date) : new Date();
    const start = new Date(day); start.setHours(0,0,0,0);
    const end = new Date(day); end.setHours(23,59,59,999);

    const meals = await Meal.find({ user: req.user._id, date: { $gte: start, $lte: end } });
    const workouts = await Workout.find({ user: req.user._id, date: { $gte: start, $lte: end } });

    const totals = {
      caloriesConsumed: 0, protein: 0, carbs: 0, fat: 0,
      caloriesBurned: 0, workoutMinutes: 0,
    };

    for (const m of meals) {
      for (const it of m.items) {
        totals.caloriesConsumed += it.calories || 0;
        totals.protein += it.protein || 0;
        totals.carbs += it.carbs || 0;
        totals.fat += it.fat || 0;
      }
    }
    for (const w of workouts) {
      for (const ex of w.exercises) {
        totals.caloriesBurned += ex.calories || 0;
        totals.workoutMinutes += ex.durationMin || 0;
      }
    }
    res.json({ date: start.toISOString(), totals });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch daily summary' });
  }
}
ï	*cascade08"(9a00d8ca6dec79e38fef643b915ca14be63f2f582Zfile:///d:/project/Fittness%20tracking%20website/server/src/controllers/statsController.js:0file:///d:/project/Fittness%20tracking%20website