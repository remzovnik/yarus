import { User } from "@/domain/User/User";
import { IEventCategory } from "@/domain/Event/IEventCategory.interface";
import { Id, Timestamp } from "@/_core/Base.type";
import { IEventPhoto } from "@/domain/Event/IEventPhoto.interface";
import { IEventPreviewDto } from "@/domain/Event/IEventPreviewDto.interface";
import { ICity } from "@/domain/City/ICity.interface";
import { EContentType } from "@/domain/Content/EContentType.enum";

export class EventPreview {
  public readonly id: Id;
  public readonly name: string;
  public readonly rating: number;
  public readonly cover: string;
  public readonly category: string;
  public readonly categoryID: Id;
  public readonly categories: IEventCategory[];
  public readonly place: string;
  public readonly city: ICity;
  public readonly since: number;
  public readonly till: number;
  public readonly ageRestriction: number;
  public readonly photos: IEventPhoto[];
  public readonly author: User;
  public readonly isFree: boolean;
  public readonly minPrice: number;
  public readonly maxPrice: number;
  public readonly checkPrice: boolean;
  public readonly statusString: string;
  public readonly createdAt: Timestamp;
  public readonly subscribedUser: User[];

  constructor(dto: IEventPreviewDto) {
    this.id = dto.id;
    this.createdAt = dto.createdAt;
    this.name = dto.name;
    this.category = dto.category;
    this.categoryID = dto.categoryID;
    this.photos = dto.photos;
    this.ageRestriction = dto.ageRestriction;
    this.minPrice = dto.minPrice;
    this.maxPrice = dto.maxPrice;
    this.author = dto.author;
    this.rating = dto.rating;
    this.isFree = dto.isFree;
    this.place = dto.place;
    this.statusString = dto.statusString;
    this.subscribedUser = dto.subscribedUser;
    this.categories = dto.categories;
    this.since = dto.since;
    this.till = dto.till;
    this.checkPrice = dto.checkPrice;
    this.cover = dto.cover;
  }

  get contentType(): EContentType {
    return EContentType.EVENT;
  }
}
