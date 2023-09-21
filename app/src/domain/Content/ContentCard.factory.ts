import { EContentType } from "@/domain/Content/EContentType.enum";
import { ClipFactory } from "@/domain/Clip/ClipFactory";
import { PostFactory } from "@/domain/Post/Post.factory";
import { VideoFactory } from "@/domain/Video/VideoFactory";
import { NewsFactory } from "@/domain/News/News.factory";
import { PhotoFactory } from "@/domain/Photo/Photo.factory";
import { IContentCardDto } from "@/domain/Content/IContentCardDto";
import { BannerFactory } from "@/domain/Banner/Banner.factory";
import { EventFactory } from "@/domain/Event/Event.factory";
import { IContentDto } from "@/domain/Content/IContentDto.interface";
import { TContentCard } from "@/domain/Content/TContentCard.type";

export class ContentCardFactory {
  public readonly _clipFactory: ClipFactory;
  public readonly _newsFactory: NewsFactory;
  public readonly _photoFactory: PhotoFactory;
  public readonly _postFactory: PostFactory;
  public readonly _videoFactory: VideoFactory;
  public readonly _bannerFactory: BannerFactory;
  public readonly _eventFactory: EventFactory;

  constructor(
    clipFactory: ClipFactory,
    newsFactory: NewsFactory,
    photoFactory: PhotoFactory,
    postFactory: PostFactory,
    videoFactory: VideoFactory,
    bannerFactory: BannerFactory,
    eventFactory: EventFactory
  ) {
    this._clipFactory = clipFactory;
    this._newsFactory = newsFactory;
    this._photoFactory = photoFactory;
    this._postFactory = postFactory;
    this._videoFactory = videoFactory;
    this._bannerFactory = bannerFactory;
    this._eventFactory = eventFactory;
  }

  create(dto: IContentCardDto): TContentCard | null {
    switch (dto.type) {
      case EContentType.POST: {
        return this._postFactory.create(dto.model);
      }

      case EContentType.PHOTO: {
        return this._photoFactory.create(dto.model);
      }

      case EContentType.NEWS: {
        return this._newsFactory.create(dto.model);
      }

      case EContentType.VIDEO: {
        return this._videoFactory.create(dto.model);
      }

      case EContentType.CLIP_BOX: {
        //Clipbox содержит коллекцию из трёх клипов, поэтому при создании одной карточки из него возьмём первый клип
        return this._clipFactory.create(dto.model[0].model);
      }

      case EContentType.CLIP: {
        return this._clipFactory.create(dto.model);
      }

      case EContentType.BANNER: {
        return this._bannerFactory.create(dto.model);
      }

      case EContentType.EVENT: {
        return this._eventFactory.create(dto.model);
      }

      case EContentType.NEW_EVENT: {
        return this._eventFactory.create(dto.model);
      }

      default:
        return null;
    }
  }

  createCollectionFromCardDto(dto: IContentCardDto[]): TContentCard[] {
    return dto.reduce((acc: TContentCard[], item: IContentCardDto) => {
      if (item) {
        if (item.type === EContentType.CLIP_BOX) {
          this._clipFactory.createCollection(item.model.map((item) => item.model)).forEach((clip) => {
            acc.push(clip);
          });
        } else {
          const data = this.create(item);
          if (data !== null) {
            acc.push(data);
          }
        }
      }

      return acc;
    }, []);
  }

  createCollectionFromEntityDto(dto: IContentDto[], presetCardType: EContentType): TContentCard[] {
    return dto.reduce((acc: TContentCard[], item: IContentDto) => {
      if (item) {
        const data: TContentCard | null = this.create({ type: presetCardType, model: item } as unknown as IContentCardDto);

        if (data !== null) {
          acc.push(data);
        }
      }

      return acc;
    }, []);
  }
}
