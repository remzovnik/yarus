import { VideoPlayerSpeed } from "@/modules/Video/components/VideoPlayer/VideoPlayer.types";

export const VIDEO_PLAYER_SPEED_DEFAULT: VideoPlayerSpeed = {
  id: "1x",
  label: "Обычная",
  value: 1,
};

export const VIDEO_PLAYER_SPEED_LIST: VideoPlayerSpeed[] = [
  {
    id: "0,25x",
    label: "0,25x",
    value: 0.25,
  },
  {
    id: "0,5x",
    label: "0,5x",
    value: 0.5,
  },
  {
    id: "0,75x",
    label: "0,75x",
    value: 0.75,
  },
  VIDEO_PLAYER_SPEED_DEFAULT,
  {
    id: "1,25x",
    label: "1,25x",
    value: 1.25,
  },
  {
    id: "1,5x",
    label: "1,5x",
    value: 1.5,
  },
  {
    id: "1,75x",
    label: "1,75x",
    value: 1.75,
  },
  {
    id: "2x",
    label: "2x",
    value: 2,
  },
];
