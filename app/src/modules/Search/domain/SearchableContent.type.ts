import { Feed } from "@/domain/Feed/Feed";
import { NewsPreview } from "@/domain/News/NewsPreview";
import { Post } from "@/domain/Post/Post";
import { User } from "@/domain/User/User";
import ClipModel from "@/modules/Clips/models/ClipModel";
import { EventPreview } from "@/domain/Event/EventPreview";
import { Hashtag } from "@/domain/Hashtag/Hashtag";
import { Album } from "@/modules/Music/domain/Album/Album";
import { Artist } from "@/modules/Music/domain/Artist/Artist";
import { Playlist } from "@/modules/Music/domain/Playlist/Playlist";
import { Track } from "@/modules/Music/domain/Track/Track";
import { SearchCard } from "@/modules/Search/models/SearchCard";
import VideoModel from "@/modules/Video/models/VideoModel";
import VideoNsfwModel from "@/modules/Video/models/VideoNsfwModel";

export type SearchableContentType =
  | Hashtag
  | User
  | Feed
  | Post
  | NewsPreview
  | EventPreview
  | VideoModel
  | ClipModel
  | VideoNsfwModel
  | SearchCard
  | Artist
  | Album
  | Track
  | Playlist;
