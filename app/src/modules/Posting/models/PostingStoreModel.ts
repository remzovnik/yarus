import { EActionContentType } from "@/modules/Main/models/EActionContentType";

export default interface PostingStoreModel {
  isEditing: boolean;
  id: number | null;
  type: EActionContentType | null;
}
