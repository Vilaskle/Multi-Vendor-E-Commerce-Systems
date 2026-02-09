import cron from "node-cron";
import User from "../models/User.js";

// ⏰ runs every hour
export const startUnverifiedUserCleanup = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      const expiryTime = new Date(
        Date.now() - 24* 60 * 60 * 1000 
      );

      const result = await User.deleteMany({
        isEmailVerified: false,
        createdAt: { $lt: expiryTime },
      });

      if (result.deletedCount > 0) {
        console.log(
          `[CLEANUP] Deleted ${result.deletedCount} unverified users`
        );
      }
    } catch (error) {
      console.error("[CLEANUP ERROR]", error.message);
    }
  });
};
