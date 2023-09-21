import { Id } from "@/_core/Base.type";
import { IDtoAudio } from "@/domain/Audio/IDtoAudio.interface";
import { EContentItemType } from "@/domain/ContentItem/EContentItemType.enum";

export interface IDtoContentItemAudio {
  id: Id;
  audio: IDtoAudio;
  type: EContentItemType.AUDIO;
}
