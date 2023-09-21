import { Timestamp, TimestampByServer } from "@/_core/Base.type";

export class DateTimeService {
  getTimestamp(timestamp: Timestamp): TimestampByServer {
    return timestamp * 1000;
  }

  getServerTimestamp(timestamp: TimestampByServer): Timestamp {
    return Math.round(timestamp / 1000);
  }
}
