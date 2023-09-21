import { IHashtagDto } from "@/domain/Hashtag/IHashtagDto.interface";

export class Hashtag {
  isSubscribe: boolean;
  name: string;
  count: number;
  id: number;

  constructor(dto: IHashtagDto) {
    this.isSubscribe = dto.isSubscribe;
    this.name = dto.name;
    this.count = dto.count;
    this.id = dto.id;
  }
}
