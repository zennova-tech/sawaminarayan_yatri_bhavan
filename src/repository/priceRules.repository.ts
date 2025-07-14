import RoomPriceRules, {
  IRoomPriceRules,
} from "@/sequilizedir/models/roomPriceRules.model";

const createPriceRule = async (data: IRoomPriceRules) => {
  return await RoomPriceRules.create(data);
};

const updatePriceRuleData = async (id: string, data: IRoomPriceRules) => {
  return await RoomPriceRules.update(data, { where: { id } });
};

const deletePriceRuleData = async (id: string) => {
  return await RoomPriceRules.destroy({
    where: { id },
  });
};

const fetchPriceRuleData = async () => {
  return await RoomPriceRules.findAll();
};

export {
  createPriceRule,
  deletePriceRuleData,
  updatePriceRuleData,
  fetchPriceRuleData,
};
