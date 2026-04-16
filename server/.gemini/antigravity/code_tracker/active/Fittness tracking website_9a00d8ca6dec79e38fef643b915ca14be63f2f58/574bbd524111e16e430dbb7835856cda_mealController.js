¹import Meal from '../models/Meal.js';

export async function listMeals(req, res) {
  try {
    const items = await Meal.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: 'Failed to list meals' });
  }
}

export async function createMeal(req, res) {
  try {
    const doc = await Meal.create({ user: req.user._id, ...req.body });
    res.status(201).json(doc);
  } catch (e) {
    res.status(500).json({ error: 'Failed to create meal' });
  }
}

export async function updateMeal(req, res) {
  try {
    const { id } = req.params;
    const updated = await Meal.findOneAndUpdate({ _id: id, user: req.user._id }, req.body, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: 'Failed to update meal' });
  }
}

export async function deleteMeal(req, res) {
  try {
    const { id } = req.params;
    await Meal.findOneAndDelete({ _id: id, user: req.user._id });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete meal' });
  }
}
¹*cascade08"(9a00d8ca6dec79e38fef643b915ca14be63f2f582Yfile:///d:/project/Fittness%20tracking%20website/server/src/controllers/mealController.js:0file:///d:/project/Fittness%20tracking%20website