import { PostingContentTypeId } from "@/modules/Posting/models/PostingContentType";

function setTitleItem(data) {
  const { text } = data;

  return {
    type: PostingContentTypeId.title,
    text,
    param: 2,
  };
}

function setTextItem(data) {
  const { text } = data;

  return {
    type: PostingContentTypeId.text,
    text,
  };
}

function setImageItem(data) {
  return {
    type: PostingContentTypeId.image,
    image: data.image.imageMobile || data.image.image,
    imageWidth: data.image.imageWidth,
    imageHeight: data.image.imageHeight,
    imageOriginal: data.image.imageOriginal,
    widthImageOriginal: data.image.widthImageOriginal,
    heightImageOriginal: data.image.heightImageOriginal,
  };
}

function setQuoteItem(data) {
  const { extra, text } = data;

  return {
    type: PostingContentTypeId.quote,
    text,
    extra,
  };
}

function setLinkItem(data) {
  const { link, text } = data;

  return {
    type: PostingContentTypeId.link,
    text,
    link,
  };
}

function setAudioItem(data) {
  const { artist, name, audio } = data;

  return {
    type: PostingContentTypeId.audio,
    audio: {
      artist,
      name,
      transcodeResponse: JSON.stringify(audio),
    },
  };
}

function setVideoItem(data) {
  const { previewImage, name, description, video, tags } = data;

  return {
    type: PostingContentTypeId.video,
    video: {
      previewImage,
      name: name ? name : "",
      description: description ? description : "",
      transcodeResponse: JSON.stringify(video),
      tags: tags ? tags.filter((item) => !!item.trim().length) : [],
    },
  };
}

export default (items) => {
  const newItems: any[] = [];

  items.forEach((item) => {
    switch (item.type) {
      case "title": {
        if (item.data?.text) {
          newItems.push({ ...setTitleItem(item.data), action: item.action, id: item.id });
        }
        break;
      }

      case "text": {
        if (item.data?.text) {
          newItems.push({ ...setTextItem(item.data), action: item.action, id: item.id });
        }
        break;
      }

      case "image": {
        if (item.data?.image.imageOriginal || item.data?.image.image) {
          newItems.push({ ...setImageItem(item.data), action: item.action, id: item.id });
        }
        break;
      }

      case "quote": {
        if (item.data?.text || item.data?.extra) {
          newItems.push({ ...setQuoteItem(item.data), action: item.action, id: item.id });
        }
        break;
      }

      case "link": {
        if (item.data?.link) {
          newItems.push({ ...setLinkItem(item.data), action: item.action, id: item.id });
        }
        break;
      }

      case "audio": {
        if (item.data?.audio?.status === "ok" || item.isEditing) {
          newItems.push({ ...setAudioItem(item.data), action: item.action, id: item.id });
        }
        break;
      }

      case "video": {
        if (item.data?.video?.status === "ok" || item.isEditing) {
          newItems.push({ ...setVideoItem(item.data), action: item.action, id: item.id });
        }
        break;
      }

      default:
        break;
    }
  });

  return newItems;
};
