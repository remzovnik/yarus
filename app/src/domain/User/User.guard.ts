import { User } from "@/domain/User/User";

export const isUserGuard = (model: unknown): model is User => {
  return model instanceof User;
};
