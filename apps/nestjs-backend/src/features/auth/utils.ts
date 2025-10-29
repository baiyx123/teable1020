import type { Prisma } from '@teable/db-main-prisma';
import { type IUserMeVo } from '@teable/openapi';
import { pick } from 'lodash';
import { getPublicFullStorageUrl } from '../attachments/plugins/utils';

export type IPickUserMe = Pick<
  Prisma.UserGetPayload<null>,
  'id' | 'name' | 'avatar' | 'phone' | 'email' | 'password' | 'notifyMeta' | 'isAdmin' | 'primaryDepartmentId' | 'primaryDepartmentName' | 'primaryDepartmentCode'
>;

export const pickUserMe = (user: IPickUserMe): IUserMeVo => {
  return {
    id: user.id,
    name: user.name,
    phone: user.phone,
    email: user.email,
    isAdmin: user.isAdmin,
    primaryDepartmentId: user.primaryDepartmentId,
    primaryDepartmentName: user.primaryDepartmentName,
    primaryDepartmentCode: user.primaryDepartmentCode,
    notifyMeta: typeof user.notifyMeta === 'object' ? user.notifyMeta : JSON.parse(user.notifyMeta),
    avatar:
      user.avatar && !user.avatar?.startsWith('http')
        ? getPublicFullStorageUrl(user.avatar)
        : user.avatar,
    hasPassword: user.password !== null,
  };
};
