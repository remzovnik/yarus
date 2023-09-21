import { EmotionFactory } from "@/domain/Emotion/Emotion.factory";
import { FullMetrics } from "@/domain/Metrics/FullMetrics/FullMetrics";
import { IDtoFullMetrics } from "@/domain/Metrics/FullMetrics/IDtoFullMetrics.interfaces";

export class FullMetricsFactory {
  /** factories */
  public readonly _emotionFactory: EmotionFactory;

  constructor(emotionFactory: EmotionFactory) {
    /** set factories */
    this._emotionFactory = emotionFactory;
  }

  create(dto: IDtoFullMetrics): FullMetrics {
    return new FullMetrics(dto, this._emotionFactory);
  }

  createCollection(dtoList: IDtoFullMetrics[]): FullMetrics[] {
    return dtoList.map((dto: IDtoFullMetrics) => {
      return this.create(dto);
    });
  }
}
