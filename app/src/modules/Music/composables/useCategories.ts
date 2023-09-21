import { Uuid } from "@/_core/Base.type";
import { PaginationModel } from "@/_core/models/PaginationModel";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { appConfig } from "@/appConfig";
import { Category } from "@/modules/Music/domain/Category/Category";
import MusicApiService from "@/modules/Music/MusicApiService";
import { ref } from "vue";

export default (perPage = appConfig.music.categoriesPerPage) => {
  const categoryList = ref<Category[]>([]);
  const category = ref<Category | null>(null);
  const categoriesPagination = ref<PaginationModel>(new PaginationModel({ perPage }));
  const categoryListIsLoaded = ref<boolean>(false);
  const loadCategoriesChunk = async (): Promise<void> => {
    const chunk = await ServiceLocator.instance.getService(MusicApiService).getCategoryList(categoriesPagination.value);
    categoryList.value = [...categoryList.value, ...chunk];
    categoriesPagination.value.currentPage++;
    if (chunk.length < perPage) {
      categoryListIsLoaded.value = true;
    }
  };

  const getCategoryById = async (id: Uuid): Promise<void> => {
    category.value = await ServiceLocator.instance.getService(MusicApiService).getCategoryById(id);
  };

  return {
    categoryList,
    loadCategoriesChunk,
    getCategoryById,
    category,
    categoryListIsLoaded,
  };
};
