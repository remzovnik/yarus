import { BaseViewModel } from "@/_core/models/BaseViewModel";

export default class SeoModel extends BaseViewModel {
  meta_url = window.location.href;
  meta_title = "ЯRUS";
  meta_description =
    "Социальная сеть ЯRUS, объединившая в себе новости, музыку, события, видео, которые будут интересны именно тебе.";
  meta_image = "/images/og_logo.png";
  meta_image_alt = "ЯRUS";
  meta_image_type = "image/png";
  meta_image_width = "1200";
  meta_image_height = "630";
  meta_type = "website";
  meta_id?: string;
  meta_video_duration?: string;
  meta_upload_date?: string;
  meta_adult?: string;
  meta_video_type?: string;
  meta_video?: string;
  breadcrumbs: object;
  navigation: object;
  video?: object;
  event?: object;
  html_attrs?: object;

  public constructor(init?: Partial<SeoModel>) {
    super();
    Object.assign(this, init);
  }
}
