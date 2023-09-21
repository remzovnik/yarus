import { EPlatform } from "@/modules/ChangeLog/domain/Platform.enum";

export interface IDtoChangeLogRecord {
  title: string;
  platform: EPlatform;
  date: string;
  addedList?: string[];
  changedList?: string[];
  tagList?: string[];
  fixList?: string[];
}
