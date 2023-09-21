import { BaseViewModel } from "@/_core/models/BaseViewModel";

export interface EmotionListUser {
  id: number;
  name: string;
  surname: string;
  photo: string;
  nickname: string;
  approved: string;
}

export interface EmotionListMetric {
  emotionId: number;
  total: number;
}

export interface EmotionListMember {
  user: EmotionListUser;
  emotion: number;
  date: number;
}

export default class EmotionListModel extends BaseViewModel {
  total: number;
  metrics: EmotionListMetric[];
  members: EmotionListMember[];
}
