import { EContentType } from "@/domain/Content/EContentType.enum";
import { User } from "@/domain/User/User";

export interface IUserCard {
  type: EContentType.USER;
  model: User;
}
