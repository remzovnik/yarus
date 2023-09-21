import { IDtoVideoSource } from "@/domain/Video/VideoSource/IDtoVideoSource.interface";

export default class VideoSource {
  id: number;
  name: string;
  color: string;
  active: boolean;
  isSelected: boolean;
  image: string;
  watermark: string;
  webIconActive: string;
  webIconInactive: string;
  constructor(dto: IDtoVideoSource) {
    this.id = dto.id;
    this.name = dto.name;
    this.color = dto.color;
    this.active = dto.active;
    this.isSelected = dto.isSelected;
    this.image = dto.image;
    this.watermark = dto.watermark;
    this.webIconActive = dto.webIconActive;
    this.webIconInactive = dto.webIconInactive;
  }
}
