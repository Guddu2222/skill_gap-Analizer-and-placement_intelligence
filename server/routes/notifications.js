const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Notification = require("../models/Notification");

// GET /api/notifications — Retrieve notifications for authenticated user/role
router.get("/", auth, async (req, res) => {
  try {
    const userRole = req.user.role || "student";
    const userId = req.user.userId;

    const query = {
      $or: [
        { recipient: userId },
        { recipientRole: userRole },
        { recipientRole: "all" },
      ],
    };

    let count = await Notification.countDocuments();
    if (count === 0) {
      // Seed rich realistic notifications matching platform telemetry
      await Notification.insertMany([
        {
          recipientRole: "all",
          title: "Amazon SDE-1 Shortlist Released",
          message: "42 candidates advanced to Technical Round 2. Slot confirmations open until 6:00 PM.",
          category: "shortlist",
          read: false,
          link: "/college/shortlist",
        },
        {
          recipientRole: "all",
          title: "Google Marquee Drive Assessment Scheduled",
          message: "Online Assessment slot booked for tomorrow at 10:00 AM IST on HackerEarth.",
          category: "drive",
          read: false,
          link: "/college/drives",
        },
        {
          recipientRole: "all",
          title: "Microsoft FTE Offer Recommendations",
          message: "3 candidates recommended for FTE Cloud Solution Architect offer clearance.",
          category: "placement",
          read: false,
          link: "/college/students",
        },
        {
          recipientRole: "student",
          title: "AI Skill Gap Analysis Refreshed",
          message: "Your profile score updated (+8%) based on recent Docker & Kubernetes coursework.",
          category: "interview",
          read: false,
          link: "/student/skills",
        },
        {
          recipientRole: "college_admin",
          title: "TCS Prime Technical Round Clearances",
          message: "18 candidate clearances pending placement cell official stamp.",
          category: "drive",
          read: true,
          link: "/college/drives",
        },
      ]);
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    const unreadCount = notifications.filter((n) => !n.read).length;

    res.json({
      success: true,
      unreadCount,
      notifications,
    });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// PATCH /api/notifications/:id/read — Mark single notification as read
router.patch("/:id/read", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.json({ success: true, notification });
  } catch (err) {
    res.status(500).json({ error: "Failed to update notification status" });
  }
});

// PATCH /api/notifications/read-all — Mark all notifications as read
router.patch("/read-all", auth, async (req, res) => {
  try {
    const userRole = req.user.role || "student";
    const userId = req.user.userId;

    await Notification.updateMany(
      {
        $or: [
          { recipient: userId },
          { recipientRole: userRole },
          { recipientRole: "all" },
        ],
        read: false,
      },
      { read: true }
    );

    res.json({ success: true, message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark all as read" });
  }
});

// DELETE /api/notifications/:id — Dismiss notification
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndDelete(id);
    res.json({ success: true, message: "Notification dismissed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete notification" });
  }
});

module.exports = router;
