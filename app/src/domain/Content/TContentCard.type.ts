import { Clip } from "@/domain/Clip/Clip";
import { NewsPreview } from "@/domain/News/NewsPreview";
import { Photo } from "@/domain/Photo/Photo";
import { Post } from "@/domain/Post/Post";
import { Video } from "@/domain/Video/Video";
import { Banner } from "@/domain/Banner/Banner";
import { EventPreview } from "@/domain/Event/EventPreview";

export type TContentCard = Clip | NewsPreview | Photo | Post | Video | Banner | EventPreview;
