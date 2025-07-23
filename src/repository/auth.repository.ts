import { db } from '@/sequilizedir/models';
import Admin from '@/sequilizedir/models/users.model';

const checkUserService = async (email: string): Promise<Admin | null> => {
  try {
    return await db.Users.findOne({ where: { email: email } });
  } catch (error) {
    console.log('🚀 ~ :5 ~ checkUserService ~ error:', error);
    return null;
  }
};
export { checkUserService };
