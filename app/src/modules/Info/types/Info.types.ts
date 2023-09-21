import { Url } from "@/_core/Base.type";
import RouteModel from "@/modules/Main/models/RouteModel";

export interface IDocumentInfo {
  id: string;
  title: string;
  href: Url;
  iconName: string;
  route?: RouteModel;
}
