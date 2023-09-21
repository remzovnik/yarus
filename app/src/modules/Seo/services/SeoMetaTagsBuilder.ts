import { BaseService } from "@/_core/service/BaseService";
import SeoModel from "@/modules/Seo/models/SeoModel";

export class SeoMetaTagsBuilder extends BaseService {
  public create(meta?: SeoModel) {
    meta = this.setDefaultValues(meta);

    const result = {
      htmlAttrs: meta.html_attrs,
      title: meta?.meta_title?.substring(0, 70) || "ЯRUS",
      meta: [
        {
          key: "og:type",
          hid: "og:type",
          property: "og:type",
          content: meta.meta_type,
        },
        {
          key: "og:url",
          hid: "og:url",
          property: "og:url",
          content: meta.meta_url,
        },
        {
          key: "title",
          hid: "title",
          name: "title",
          content: meta?.meta_title?.substring(0, 70),
        },
        {
          key: "og:title",
          hid: "og:title",
          property: "og:title",
          content: meta?.meta_title?.substring(0, 70),
        },
        {
          key: "description",
          hid: "description",
          name: "description",
          content: meta?.meta_description?.substring(0, 150),
        },
        {
          key: "og:description",
          hid: "og:description",
          property: "og:description",
          content: meta?.meta_description?.substring(0, 150),
        },
        {
          key: "og:image",
          hid: "og:image",
          property: "og:image",
          content: meta?.meta_image,
        },
        {
          key: "og:image:alt",
          hid: "og:image:alt",
          property: "og:image:alt",
          content: meta?.meta_image_alt,
        },
        {
          key: "og:image:type",
          hid: "og:image:type",
          property: "og:image:type",
          content: meta?.meta_image_type,
        },
        {
          key: "og:image:width",
          hid: "og:image:width",
          property: "og:image:width",
          content: meta?.meta_image_width,
        },
        {
          key: "og:image:height",
          hid: "og:image:height",
          property: "og:image:height",
          content: meta?.meta_image_height,
        },
      ],
      script: [
        {
          key: "navigation",
          type: "application/ld+json",
          children: JSON.stringify(meta.navigation),
        },
        {
          key: "breadcrumbs",
          type: "application/ld+json",
          children: JSON.stringify(meta.breadcrumbs),
        },
      ],
    };

    if (meta?.video) {
      result.script.push({
        key: "video",
        type: "application/ld+json",
        children: JSON.stringify(meta.video),
      });
    }

    if (meta?.event) {
      result.script.push({
        key: "event",
        type: "application/ld+json",
        children: JSON.stringify(meta.event),
      });
    }

    if (meta?.meta_video) {
      result.meta.push({
        key: "og:video",
        hid: "og:video",
        property: "og:video",
        content: meta?.meta_video,
      });
    }

    if (meta?.meta_video_type) {
      result.meta.push({
        key: "og:video:type",
        hid: "og:video:type",
        property: "og:video:type",
        content: meta?.meta_video_type,
      });
    }

    if (meta?.meta_adult) {
      result.meta.push({
        key: "ya:ovs:adult",
        hid: "ya:ovs:adult",
        property: "ya:ovs:adult",
        content: meta?.meta_adult,
      });
    }

    if (meta?.meta_upload_date) {
      result.meta.push({
        key: "ya:ovs:upload_date",
        hid: "ya:ovs:upload_date",
        property: "ya:ovs:upload_date",
        content: meta?.meta_upload_date,
      });
    }

    if (meta?.meta_video_duration) {
      result.meta.push({
        key: "video:duration",
        hid: "video:duration",
        property: "video:duration",
        content: meta?.meta_video_duration,
      });
    }

    if (meta?.meta_video_duration) {
      result.meta.push({
        key: "video:duration",
        hid: "video:duration",
        property: "video:duration",
        content: meta?.meta_video_duration,
      });
    }

    if (meta?.meta_id) {
      result.meta.push({
        key: "ya:ovs:id",
        hid: "ya:ovs:id",
        property: "ya:ovs:id",
        content: meta?.meta_id,
      });
    }

    return result;
  }

  private setDefaultValues(headMetaTagInfo?: SeoModel): SeoModel {
    headMetaTagInfo = headMetaTagInfo || new SeoModel();
    return headMetaTagInfo;
  }
}
