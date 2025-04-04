"use server";

import { GPT_MODELS_AVAILABLE } from "@/lib/consts";
import { GPTModelCatalog } from "@/types/models.types";

async function fetchAvailableGPTModels(): Promise<GPTModelCatalog[]> {
  return GPT_MODELS_AVAILABLE;
}

export { fetchAvailableGPTModels };
