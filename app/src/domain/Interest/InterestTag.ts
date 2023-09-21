import { IInterestTagDto } from "@/domain/Interest/IInterestTagDto.interface";

export class InterestTag {
  public readonly tag: string;
  public readonly count: number;
  public isSelected: boolean;
  public readonly isIntersect: boolean;

  constructor(dto: IInterestTagDto) {
    this.tag = dto.tag || "";
    this.count = dto.count || 0;
    this.isSelected = dto.isSelected || false;
    this.isIntersect = dto.isIntersect || false;
  }

  toggleSelected(): void {
    this.isSelected = !this.isSelected;
  }

  select(): void {
    this.isSelected = true;
  }

  unselect(): void {
    this.isSelected = false;
  }
}
