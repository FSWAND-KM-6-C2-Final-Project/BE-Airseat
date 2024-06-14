const router = require("express").Router();
const notifications = require("../controllers/notificationsController");

const authenticate = require("../middlewares/authenticate");

//get all notifications
router.get("/", authenticate, notifications.findNotifications);

// Create a new notifications
router.post("/", notifications.createNotifications);

//get Update an existing notifications
router.patch("/:id", notifications.updateNotifications);

// Delete a notifications
router.delete("/:id", notifications.deleteNotifications);

module.exports = router;
