import { IClipCardDto } from "@/domain/Clip/IClipCardDto";
import { INewsCardDto } from "@/domain/News/INewsCardDto";
import { IPhotoCardDto } from "@/domain/Photo/IPhotoCardDto";
import { IPostCardDto } from "@/domain/Post/IPostCardDto";
import { IVideoCardDto } from "@/domain/Video/IVideoCardDto";
import { IClipBoxDto } from "@/domain/ClipBox/IClipBoxDto";
import { IBannerCardDto } from "@/domain/Banner/IBannerCardDto";
import { IEventCardDto } from "@/domain/Event/IEventCardDto.interface";

export type IContentCardDto =
  | IClipCardDto
  | IClipBoxDto
  | INewsCardDto
  | IPhotoCardDto
  | IPostCardDto
  | IVideoCardDto
  | IBannerCardDto
  | IEventCardDto;
