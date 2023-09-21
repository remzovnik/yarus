import { INewsPreviewDto } from "@/domain/News/INewsPreviewDto";
import { IClipDto } from "@/domain/Clip/IClipDto.interface";
import { IPostDto } from "@/domain/Post/IPostDto";
import { IPhotoDto } from "@/domain/Photo/IPhotoDto";
import { IVideoDto } from "@/domain/Video/IVideoDto";
import { IBannerDto } from "@/domain/Banner/IBannerDto";
import { IEventPreviewDto } from "@/domain/Event/IEventPreviewDto.interface";

export type IContentDto = IClipDto | INewsPreviewDto | IPostDto | IPhotoDto | IVideoDto | IBannerDto | IEventPreviewDto;
