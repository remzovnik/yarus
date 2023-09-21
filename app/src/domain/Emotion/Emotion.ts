import { EEmotionId } from "@/domain/Emotion/EEmotionId.enum";
import { IDtoEmotion } from "@/domain/Emotion/IDtoEmotion.interface";

export class Emotion {
  public readonly count: number;
  public readonly id: EEmotionId;

  constructor(dto: IDtoEmotion) {
    this.id = dto.id;
    this.count = dto.count;
  }
}
