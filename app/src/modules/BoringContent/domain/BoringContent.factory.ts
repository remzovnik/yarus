import { BoringContent } from "@/modules/BoringContent/domain/BoringContent";
import { IDtoBoringContent } from "@/modules/BoringContent/domain/IDtoBoringContent.interface";

export class BoringContentFactory {
  create(dto: IDtoBoringContent): BoringContent {
    return new BoringContent(dto);
  }

  createCollection(dtoList: IDtoBoringContent[]): BoringContent[] {
    return dtoList.map((dto: IDtoBoringContent) => new BoringContent(dto));
  }
}
