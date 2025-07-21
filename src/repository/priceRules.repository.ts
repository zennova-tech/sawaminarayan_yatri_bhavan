import RoomPriceRules, { IRoomPriceRules } from '@/sequilizedir/models/roomPriceRules.model';
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

const fetchPriceRuleData = async (checkInDate?: string) => {
  return await RoomPriceRules.findAll({
    where: checkInDate
      ? {
          start_date: { [Op.lte]: checkInDate },
          end_date: { [Op.gte]: checkInDate },
        }
      : {},
  });
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
  id?: string,
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
      [Op.and]: [{ start_date: { [Op.lte]: endDate } }, { end_date: { [Op.gte]: startDate } }],
    },
  });
};

const fetchDefaultPriceRule = async () => {
  return await RoomPriceRules.findOne({
    where: { is_default_price: true },
  });
};

const findPriceRuleByDate = async (date: Date) => {
  return await RoomPriceRules.findOne({
    where: {
      start_date: { [Op.lte]: date },
      end_date: { [Op.gte]: date },
      is_default_price: false,
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
  fetchDefaultPriceRule,
  findPriceRuleByDate,
};
