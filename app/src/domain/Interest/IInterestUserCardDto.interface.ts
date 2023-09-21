import { InterestTag } from "@/domain/Interest/InterestTag";
import { IDtoUser } from "@/domain/User/IDtoUser.interface";

export interface IInterestUserCardDto {
  tags: InterestTag[];
  user: IDtoUser;
}
