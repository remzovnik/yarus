import { ResponseModel } from "@/modules/Main/models/ResponseModel";
import { BaseService } from "@/_core/service/BaseService";
import ComplainTypeModel from "@/modules/Main/models/ComplainTypeModel";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";

export default class ComplaintService extends BaseService {
  async getComplaintTypeList(): Promise<ComplainTypeModel[]> {
    const res = await this.getArrayOrFail(ComplainTypeModel, "/complaint");
    return res || [];
  }

  async sendComplaint(
    id: string | number,
    categoryId: number | null,
    text: string,
    contentType: EActionContentType,
    contentId?: string | number,
    parentId?: number | null
  ): Promise<ResponseModel> {
    let path = "";
    let data: any = { categoryId, text };
    switch (contentType) {
      case EActionContentType.AUDIO:
        path = `/complaint/audio/${id}`;
        break;
      case EActionContentType.VIDEO:
        path = `/complaint/video/${id}`;
        break;
      case EActionContentType.CLIP:
        path = `/complaint/clip/${id}`;
        break;
      case EActionContentType.POST:
        path = `/complaint/post/${id}`;
        break;
      case EActionContentType.NEWS:
        path = `/complaint/news/${id}`;
        break;
      case EActionContentType.FEED:
        path = `/complaint/feed/${id}`;
        break;
      case EActionContentType.EVENT:
        path = `/complaint/event/${id}`;
        break;
      case EActionContentType.COMMENT_POST:
      case EActionContentType.REPLY_POST:
        path = `/complaint/comment`;
        data = { ...data, contentId, commentId: id, contentType: "post", commentParentId: parentId };
        break;
      case EActionContentType.COMMENT_NEWS:
      case EActionContentType.REPLY_NEWS:
        path = `/complaint/comment`;
        data = { ...data, contentId, commentId: id, contentType: "news", commentParentId: parentId };
        break;
      case EActionContentType.COMMENT_VIDEO:
      case EActionContentType.REPLY_VIDEO:
        path = `/complaint/comment`;
        data = { ...data, contentId, commentId: id, contentType: "video", commentParentId: parentId };
        break;
      case EActionContentType.COMMENT_CLIP:
      case EActionContentType.REPLY_CLIP:
        path = `/complaint/comment`;
        data = { ...data, contentId, commentId: id, contentType: "clip", commentParentId: parentId };
        break;
      case EActionContentType.USER:
        path = `/complaint/user/${id}`;
        break;
      case EActionContentType.HASHTAG:
        path = `/complaint/hashtag/${id}`;
        break;
    }

    try {
      await this.apiRequest.post(path, data);
      return ResponseModel.createOK();
    } catch (err: any) {
      return ResponseModel.createError(err);
    }
  }
}
