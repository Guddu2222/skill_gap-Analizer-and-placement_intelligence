ãimport Workout from '../models/Workout.js';

export async function listWorkouts(req, res) {
  try {
    const items = await Workout.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: 'Failed to list workouts' });
  }
}

export async function createWorkout(req, res) {
  try {
    const doc = await Workout.create({ user: req.user._id, ...req.body });
    res.status(201).json(doc);
  } catch (e) {
    res.status(500).json({ error: 'Failed to create workout' });
  }
}

export async function updateWorkout(req, res) {
  try {
    const { id } = req.params;
    const updated = await Workout.findOneAndUpdate({ _id: id, user: req.user._id }, req.body, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: 'Failed to update workout' });
  }
}

export async function deleteWorkout(req, res) {
  try {
    const { id } = req.params;
    await Workout.findOneAndDelete({ _id: id, user: req.user._id });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete workout' });
  }
}
ã*cascade08"(9a00d8ca6dec79e38fef643b915ca14be63f2f582\file:///d:/project/Fittness%20tracking%20website/server/src/controllers/workoutController.js:0file:///d:/project/Fittness%20tracking%20website