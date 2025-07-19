import RoomPriceRules, {
  IRoomPriceRules,
} from '@/sequilizedir/models/roomPriceRules.model';
import { Op } from 'sequelize';

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

const findPriceRuleByName = async (name: string, id?: string) => {
  return await RoomPriceRules.findOne({
    where: {
      name,
      ...(id
        ? {
            id: {
              [Op.ne]: id,
            },
          }
        : {}),
    },
  });
};

const findOverlappingDateRule = async (
  startDate: string | Date,
  endDate: string | Date,
  id?: string
) => {
  return await RoomPriceRules.findOne({
    where: {
      is_default_price: false,
      ...(id
        ? {
            id: {
              [Op.ne]: id,
            },
          }
        : {}),
      [Op.and]: [
        { start_date: { [Op.lte]: endDate } },
        { end_date: { [Op.gte]: startDate } },
      ],
    },
  });
};

export {
  createPriceRule,
  deletePriceRuleData,
  updatePriceRuleData,
  fetchPriceRuleData,
  findPriceRuleByName,
  findOverlappingDateRule,
};
