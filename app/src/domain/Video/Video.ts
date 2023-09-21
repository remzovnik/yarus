import { Metrics, MetricsFull } from "@/modules/Main/models/MetricsModel";
import { IVideoDto } from "@/domain/Video/IVideoDto";
import { FullMetricsFactory } from "@/domain/Metrics/FullMetrics/FullMetrics.factory";
import { MetricsFactory } from "@/domain/Metrics/Metrics/Metrics.factory";
import { UserFactory } from "@/domain/User/User.factory";
import { User } from "@/domain/User/User";
import RouteModel from "@/modules/Main/models/RouteModel";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { EVideoStatusType } from "@/domain/Video/EVideoStatusType";
import { kFormatter } from "@/_core/utils/Formaters";
import { dateDiff } from "@/_core/utils/DateUtils";
import { durationFormatter } from "@/_core/utils/DurationUtils";
import { EContentType } from "@/domain/Content/EContentType.enum";

export class Video {
  public readonly id: number;
  public readonly status: EVideoStatusType;
  public readonly user: User;
  public readonly name: string;
  public readonly description: string;
  public readonly duration: number;
  public readonly createDate: number;
  public readonly image: string;
  public readonly m3u8: string;
  public readonly embed: boolean;
  public readonly embedId: string;
  public readonly metrics: Metrics;
  public readonly metricsFull: MetricsFull;
  public readonly originalLink: string;
  public readonly isStream: boolean;
  public readonly isStreamActive: boolean;

  public readonly _userFactory: UserFactory;
  public readonly _metricsFactory: MetricsFactory;
  public readonly _fullMetricsFactory: FullMetricsFactory;

  constructor(dto: IVideoDto, userFactory: UserFactory, metricsFactory: MetricsFactory, fullMetricsFactory: FullMetricsFactory) {
    this._userFactory = userFactory;
    this._fullMetricsFactory = fullMetricsFactory;
    this._metricsFactory = metricsFactory;

    this.id = dto.id;
    this.status = dto.status;
    this.user = this._userFactory.create(dto.user);
    this.name = dto.name;
    this.description = dto.description;
    this.duration = dto.duration;
    this.createDate = dto.createDate;
    this.image = dto.image;
    this.m3u8 = dto.m3u8;
    this.embed = dto.embed;
    this.embedId = dto.embedId;
    this.metrics = this._metricsFactory.create(dto.metrics);
    this.metricsFull = this._fullMetricsFactory.create(dto.metricsFull);
    this.originalLink = dto.originalLink;
    this.isStream = dto.isStream;
    this.isStreamActive = dto.isStreamActive;
  }

  get route(): RouteModel {
    return {
      name: ERouteName.VIDEO_DETAIL,
      params: { id: this.id },
    };
  }

  get commentsRoute(): RouteModel {
    return { name: ERouteName.VIDEO_DETAIL, params: { id: this.id, hash: "#comments-section" } };
  }

  get views(): string {
    return kFormatter(this.metricsFull?.views || 0);
  }

  get isProcessing() {
    return [EVideoStatusType.NEW, EVideoStatusType.PROCESSING].includes(this.status);
  }

  get statusLabel(): string {
    return this.isStreamActive ? "В эфире" : "Трансляция завершена";
  }

  get formattedDuration(): string {
    return durationFormatter(this.duration);
  }

  get formattedCreateDate(): string {
    return dateDiff(this.createDate);
  }

  get contentType(): EContentType {
    return EContentType.VIDEO;
  }
}
