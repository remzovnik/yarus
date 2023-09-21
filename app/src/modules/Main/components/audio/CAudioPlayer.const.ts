import AudioModel from "@/modules/Main/models/AudioModel";
import { EMusicEntityType } from "@/modules/Music/domain/MusicEntityType.enum";
import MusicTrackModel from "@/modules/Music/models/MusicTrackModel";
import { Track } from "@/modules/Music/domain/Track/Track";

export const isAudioDefaultAudio = (audio: AudioModel | MusicTrackModel | Track): audio is AudioModel => {
  return typeof (audio as AudioModel)?.artist === "string";
};

export const isAudioMusicTrack = (audio: AudioModel | MusicTrackModel | Track): audio is MusicTrackModel => {
  return typeof (audio as MusicTrackModel).artistTitle === "string";
};

export const isAudioTrack = (audio: AudioModel | MusicTrackModel | Track): audio is Track => {
  return (audio as Track).entityType === EMusicEntityType.TRACK;
};
