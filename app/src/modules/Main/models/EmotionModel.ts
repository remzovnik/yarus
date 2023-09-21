import { Metric } from "./MetricsModel";

export interface Emotion {
  id: number;
  count: number;
}

export interface Emotions {
  userEmotion?: any;
  metrics: Metric[];
}
