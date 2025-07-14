import { sequelize } from "../models";
import RoomPriceRules from "../models/roomPriceRules.model";

const seedDefaultPriceRule = async () => {
  const transaction = await sequelize.transaction();
  try {
    const priceRule = {
      name: "Default Price",
      start_date: new Date("2025-07-01"),
      end_date: new Date("2025-12-31"),
      price_per_night: 1500.0,
      is_default_price: true,
    };

    // Check if default price already exists
    const existingRule = await RoomPriceRules.findOne({
      where: { name: priceRule.name },
    });

    if (existingRule) {
      console.info(`Price rule with name "${priceRule.name}" already exists`);
      return;
    }

    await RoomPriceRules.create(priceRule, { transaction });
    await transaction.commit();
    console.log("Default room price rule seeded successfully");
    process.exit(0);
  } catch (error) {
    await transaction.rollback();
    console.error("Error seeding room price rule:", error);
    process.exit(1);
  }
};

seedDefaultPriceRule();
