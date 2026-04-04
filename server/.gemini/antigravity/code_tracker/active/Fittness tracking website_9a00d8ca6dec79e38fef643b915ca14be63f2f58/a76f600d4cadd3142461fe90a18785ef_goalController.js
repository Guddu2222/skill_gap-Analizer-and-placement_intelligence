Çimport Goal from '../models/Goal.js';

export async function listGoals(req, res) {
  try {
    const items = await Goal.find({ user: req.user._id, active: true }).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: 'Failed to list goals' });
  }
}

export async function createGoal(req, res) {
  try {
    const doc = await Goal.create({ user: req.user._id, ...req.body });
    res.status(201).json(doc);
  } catch (e) {
    res.status(500).json({ error: 'Failed to create goal' });
  }
}

export async function updateGoal(req, res) {
  try {
    const { id } = req.params;
    const updated = await Goal.findOneAndUpdate({ _id: id, user: req.user._id }, req.body, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: 'Failed to update goal' });
  }
}

export async function deleteGoal(req, res) {
  try {
    const { id } = req.params;
    await Goal.findOneAndDelete({ _id: id, user: req.user._id });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete goal' });
  }
}
Ç*cascade08"(9a00d8ca6dec79e38fef643b915ca14be63f2f582Yfile:///d:/project/Fittness%20tracking%20website/server/src/controllers/goalController.js:0file:///d:/project/Fittness%20tracking%20website