import { fetchAvailableGPTModels } from "@/actions/models.actions";
import useLocalStorage from "@/hooks/use-local-storage";
import { GPTModelCatalog } from "@/types/models.types";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

type ModelsContext = {
  availableModels: GPTModelCatalog[];
  selectedModel: string;
  setSelectedModel: (newValue: string) => void;
  selectedModelLoading: boolean;
};

const ModelsContext = createContext<ModelsContext | undefined>(undefined);

const ModelsProvider = ({ children }: { children?: React.ReactNode }) => {
  const [selectedModel, setSelectedModel, selectedModelLoading] = useLocalStorage("model", "");
  const [availableModels, setAvailableModels] = useState<GPTModelCatalog[]>([]);

  useEffect(() => {
    fetchAvailableGPTModels()
      .then((res) => setAvailableModels(res))
      .catch((e) => {
        console.error(e);
        toast.error(e.message);
      });
  }, []);

  return (
    <ModelsContext.Provider
      value={{
        availableModels,
        selectedModel,
        setSelectedModel,
        selectedModelLoading,
      }}
    >
      {children}
    </ModelsContext.Provider>
  );
};

const useModelsContext = () => {
  const _context = useContext(ModelsContext);
  if (!_context) throw new Error("useModelContext must be used within a ModelsContext");
  return _context;
};

export { useModelsContext, ModelsProvider, type ModelsContext };
