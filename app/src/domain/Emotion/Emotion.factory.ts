import { Emotion } from "@/domain/Emotion/Emotion";
import { IDtoEmotion } from "@/domain/Emotion/IDtoEmotion.interface";

export class EmotionFactory {
  create(dto: IDtoEmotion): Emotion {
    return new Emotion(dto);
  }

  createCollection(dtoList: IDtoEmotion[]): Emotion[] {
    return dtoList.map((dto: IDtoEmotion) => {
      return this.create(dto);
    });
  }

  createBabeCollection(
    dtoList: [IDtoEmotion, IDtoEmotion, IDtoEmotion, IDtoEmotion, IDtoEmotion]
  ): [Emotion, Emotion, Emotion, Emotion, Emotion] {
    return [
      this.create(dtoList[0]),
      this.create(dtoList[1]),
      this.create(dtoList[2]),
      this.create(dtoList[3]),
      this.create(dtoList[4]),
    ];
  }
}
