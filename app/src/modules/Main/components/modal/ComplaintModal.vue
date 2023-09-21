<script lang="ts" setup>
import { ref } from "vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import ComplaintService from "@/modules/Main/apiServices/ComplaintService";
import ComplainTypeModel from "@/modules/Main/models/ComplainTypeModel";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import useNotify from "@/modules/Main/components/toast/useNotify";
import { ResponseType } from "@/modules/Main/models/ResponseModel";

const notify = useNotify();

const props = defineProps<{
  id: string | number;
  parentId?: number | null;
  contentType: EActionContentType;
  contentId?: string | number;
}>();

const complaintTypeList = ref<ComplainTypeModel[]>([]);
const comment = ref("");
const activeReasonId = ref(null);

const fetchData = async (): Promise<void> => {
  complaintTypeList.value = await ServiceLocator.instance.getService(ComplaintService).getComplaintTypeList();
};

const reasonClickHandler = (id): void => {
  activeReasonId.value = id;
};

const submitClickHandler = async (resolve, close): Promise<void> => {
  const result = await ServiceLocator.instance
    .getService(ComplaintService)
    .sendComplaint(props.id, activeReasonId.value, comment.value, props.contentType, props.contentId, props.parentId);

  const isSuccess = result.status === ResponseType.OK;
  notify.message(true, String(isSuccess), isSuccess ? "Спасибо" : "Произошла ошибка.");
  resolve();
  close();
};
fetchData();
</script>

<template>
  <BaseModal
    title="Пожаловаться"
    submit-button-text="Отправить"
    :are-actions-shown="true"
    :is-submit-disabled="!activeReasonId || !comment"
    :submit-handler="submitClickHandler"
  >
    <template #content>
      <div class="complaint-modal">
        <div v-if="complaintTypeList.length" class="complaint-modal__reasons">
          <BaseChips
            v-for="(item, index) in complaintTypeList"
            :key="index"
            class="complaint-modal__reason-item"
            :is-active="activeReasonId === item.id"
            type="filter"
            @click="reasonClickHandler(item.id)"
          >
            {{ item.name }}
          </BaseChips>
        </div>
        <BaseTextarea
          v-model="comment"
          class="complaint-modal__text"
          :custom-height="160"
          placeholder="Расскажите нам, почему вы решили пожаловаться"
        />
      </div>
    </template>
  </BaseModal>
</template>

<style lang="scss">
.complaint-modal {
  @media (max-width: $media-sm) {
    width: auto;
  }

  &__reasons {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  &__reason-item {
    margin-right: 0.8rem;
    margin-bottom: 0.8rem;
  }

  &__text {
    margin-top: 3.2rem;
  }
}
</style>
