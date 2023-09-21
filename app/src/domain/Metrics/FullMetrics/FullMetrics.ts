import { EEmotionId } from "@/domain/Emotion/EEmotionId.enum";
import { EmotionFactory } from "@/domain/Emotion/Emotion.factory";
import { Emotion } from "@/domain/Emotion/Emotion";
import { IDtoFullMetrics } from "@/domain/Metrics/FullMetrics/IDtoFullMetrics.interfaces";

export class FullMetrics {
  public readonly comments: number;
  public readonly emotions: {
    metrics: [Emotion, Emotion, Emotion, Emotion, Emotion];
    userEmotion: null | EEmotionId;
  };
  public readonly views: number;

  /** factory */
  public readonly _emotionFactory: EmotionFactory;

  constructor(dto: IDtoFullMetrics, emotionFactory: EmotionFactory) {
    /** set factory */
    this._emotionFactory = emotionFactory;

    this.comments = dto.comments;
    this.views = dto.views;
    this.emotions = {
      userEmotion: dto.emotions.userEmotion,
      metrics: this._emotionFactory.createBabeCollection(dto.emotions.metrics),
    };
  }
}
