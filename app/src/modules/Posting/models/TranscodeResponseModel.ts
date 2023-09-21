import { BaseViewModel } from "@/_core/models/BaseViewModel";

export default class TranscodeResponseModel extends BaseViewModel {
  status: string;
  body: {
    task_id: string;
  };
}
