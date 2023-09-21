import { PostingContentActionType } from "@/modules/Posting/models/PostingContentActionType";

function setTitleItem(data) {
  return {
    type: "title",
    data: {
      text: data.text,
    },
    id: data.id,
    action: PostingContentActionType.updateData,
  };
}

function setTextItem(data) {
  return {
    type: "text",
    data: {
      text: data.text,
    },
    id: data.id,
    action: PostingContentActionType.updateData,
  };
}

function setImageItem(data) {
  return {
    type: "image",
    data: {
      image: { imageOriginal: data.image },
    },
    id: data.id,
    action: PostingContentActionType.updateData,
  };
}

function setQuoteItem(data) {
  return {
    type: "quote",
    data: {
      text: data.text,
      extra: data.extra,
    },
    id: data.id,
    action: PostingContentActionType.updateData,
  };
}

function setLinkItem(data) {
  return {
    type: "link",
    data: {
      text: data.text,
      link: data.link,
    },
    id: data.id,
    action: PostingContentActionType.updateData,
  };
}

function setAudioItem(data) {
  return {
    type: "audio",
    data: {
      name: data.audio.name,
      artist: data.audio.artist,
    },
    isEditing: true,
    id: data.id,
    action: PostingContentActionType.updateData,
  };
}

function setVideoItem(data) {
  return {
    type: "video",
    data: {
      previewImage: data.video.image,
      name: data.video.name,
      description: data.video.description,
      tags: data.tags ? data.tags.filter((item) => !!item.trim().length) : [],
    },
    isEditing: true,
    id: data.id,
    action: PostingContentActionType.updateData,
  };
}

export default (items) => {
  const newItems = items.map((item) => {
    switch (item.type) {
      case 0: {
        return setTitleItem(item);
      }

      case 1: {
        return setTextItem(item);
      }

      case 2: {
        return setImageItem(item);
      }

      case 3: {
        return setQuoteItem(item);
      }

      case 4: {
        return setLinkItem(item);
      }

      case 5: {
        return setAudioItem(item);
      }

      case 6: {
        return setVideoItem(item);
      }

      default:
        return false;
    }
  });

  return newItems;
};
