const router = require("express").Router();
const notifications = require("../controllers/notificationsController");

//get all notifications
router.get("/", notifications.findNotifications);

// Create a new notifications
router.post("/", notifications.createNotifications);

//get notifications by ID
router.get("/:id", notifications.findByIdNotifications);

//get Update an existing notifications
router.patch("/:id", notifications.updateNotifications);

// Delete a notifications
router.delete("/:id", notifications.deleteNotifications);

module.exports = router;
