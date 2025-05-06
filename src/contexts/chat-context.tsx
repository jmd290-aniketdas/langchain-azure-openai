import {
  chatInvoke,
  createNewChat,
  createNewMessage,
  fetchAllChatIdsForUser,
  fetchChatMessages,
  fetchChatTitle,
  updateChatTitle,
} from "@/actions/chats.actions";
import { chatStream } from "@/actions/chats.client.actions";
import { CHATS_ROOT_LINK, TITLE_GEN_DEVELOPER_MSG } from "@/lib/consts";
import { Message } from "@/types/chats.types";
import { SubSidebarMenuContent } from "@/types/menus.types";
import { MessageCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { useModelsContext } from "./models-context";
import useLocalStorage from "@/hooks/use-local-storage";

type ChatContext = {
  subSidebarChatMenuContent: SubSidebarMenuContent[];
  subSidebarChatMenuContentLoading: boolean;

  currentChatId: string;
  currentChatTitle: string;
  currentChatContextLoading: boolean;

  messages: Message[];
  messageLoading: boolean;

  isWebSearchOn: boolean;
  setIsWebSearchOn: (value: boolean) => void;
  isWebSearchOnLoading: boolean;

  generateNewChatIdAndNavigate: (message: string) => Promise<void>;
  generateNewChatTitle: () => Promise<void>;
  sendChat: (message: string) => Promise<void>;
  loadChat: (chatId: string) => Promise<void>;
  newChat: () => void;
};

const ChatContext = createContext<ChatContext | undefined>(undefined);

const ChatProvider = ({ children }: { children?: React.ReactNode }) => {
  const { selectedModel } = useModelsContext();
  const { data: session, status: sessionStatus } = useSession();
  const { chatId: paramsChatId }: { chatId: string } = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const [subSidebarChatMenuContent, setSubSidebarChatMenuContent] = useState<SubSidebarMenuContent[]>([]);
  const [subSidebarChatMenuContentLoading, setSubSidebarChatMenuContentLoading] = useState<boolean>(true);

  const [currentChatId, setCurrentChatId] = useState<string>("");
  const [currentChatTitle, setCurrentChatTitle] = useState<string>("");
  const [currentChatContextLoading, setCurrentChatContextLoading] = useState<boolean>(!!paramsChatId);

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageLoading, setMessageLoading] = useState<boolean>(false);

  const [isWebSearchOn, setIsWebSearchOn, isWebSearchOnLoading] = useLocalStorage<boolean>("isWebSearchOn", false);

  const fetchAllChatInfosForCurrentUser = useCallback(() => {
    if (sessionStatus !== "authenticated") return;

    fetchAllChatIdsForUser(session.user.email)
      .then((res) =>
        setSubSidebarChatMenuContent(
          res.map((r) => ({
            name: r.chatTitle,
            icon: MessageCircle,
            link: `${CHATS_ROOT_LINK}/${r.chatId}`,
            searchTerms: [r.chatTitle, r.createdAt.toDateString(), r.updatedAt.toDateString()],
          }))
        )
      )
      .catch((err) => {
        console.error(err);
        toast.error(err.message);
      })
      .finally(() => setSubSidebarChatMenuContentLoading(false));
  }, [sessionStatus, session]);

  const generateNewChatIdAndNavigate = async (message: string) => {
    if (sessionStatus !== "authenticated") throw new Error("Not Authenticated");

    const userMessage: Message = { role: "user", content: message };
    setMessages([userMessage]);
    setMessageLoading(() => true);

    const newChat = await createNewChat(session.user.email);
    setCurrentChatId(newChat.id);

    await createNewMessage(newChat.id, userMessage);

    router.replace(`${CHATS_ROOT_LINK}/${newChat.id}`);
  };

  const generateNewChatTitle = useCallback(async () => {
    const developerMessage: Message = { role: "developer", content: TITLE_GEN_DEVELOPER_MSG };
    const titleRes = await chatInvoke(selectedModel, [...messages, developerMessage]);
    setCurrentChatTitle(titleRes.data.content);
    await updateChatTitle(currentChatId, titleRes.data.content);
    fetchAllChatInfosForCurrentUser();
  }, [currentChatId, selectedModel, messages, fetchAllChatInfosForCurrentUser]);

  const generateChatAfterRedirect = async () => {
    try {
      let accumulatedAssistantMessage: Message = { role: "assistant", content: "" };
      for await (const chunk of chatStream(selectedModel, messages)) {
        setMessageLoading(() => false);

        accumulatedAssistantMessage = {
          ...accumulatedAssistantMessage,
          content: accumulatedAssistantMessage.content + chunk.data.content,
        };
        setMessages((m) => {
          const last = m.at(-1);
          if (!last) return [accumulatedAssistantMessage];
          if (last.role === "assistant") {
            return [...m.slice(0, -1), accumulatedAssistantMessage];
          }
          return [...m, accumulatedAssistantMessage];
        });
      }

      await createNewMessage(currentChatId, accumulatedAssistantMessage);
      await generateNewChatTitle();
    } catch (error) {
      setMessages((m) => [...m, { role: "assistant", content: (error as Error).message }]);
      throw error;
    }
  };

  const sendChat = async (message: string) => {
    try {
      let accumulatedAssistantMessage: Message = { role: "assistant", content: "" };
      const userMessage: Message = { role: "user", content: message };

      setMessages((m) => [...m, userMessage]);
      setMessageLoading(() => true);

      for await (const chunk of chatStream(selectedModel, [...messages, userMessage])) {
        setMessageLoading(() => false);

        accumulatedAssistantMessage = {
          ...accumulatedAssistantMessage,
          content: accumulatedAssistantMessage.content + chunk.data.content,
        };
        setMessages((m) => {
          const last = m.at(-1);
          if (!last) return [accumulatedAssistantMessage];
          if (last.role === "assistant") {
            return [...m.slice(0, -1), accumulatedAssistantMessage];
          }
          return [...m, accumulatedAssistantMessage];
        });
      }

      await createNewMessage(currentChatId, userMessage);
      await createNewMessage(currentChatId, accumulatedAssistantMessage);
    } catch (error) {
      setMessages((m) => [...m, { role: "assistant", content: (error as Error).message }]);
      throw error;
    }
  };

  const loadChat = async (_chatId: string) => {
    setCurrentChatContextLoading(true);
    try {
      setCurrentChatId(_chatId);

      const chatTitle = await fetchChatTitle(_chatId);
      setCurrentChatTitle(chatTitle);

      const chatMessages = await fetchChatMessages(_chatId);
      setMessages(chatMessages);
    } catch (error) {
      console.error(error);
      toast.error((error as Error).message);
    } finally {
      setCurrentChatContextLoading(false);
    }
  };

  const newChat = () => {
    setCurrentChatContextLoading(true);
    setCurrentChatId("");
    setCurrentChatTitle("");
    setMessages([]);
    setCurrentChatContextLoading(false);
  };

  useEffect(() => {
    fetchAllChatInfosForCurrentUser();
  }, [fetchAllChatInfosForCurrentUser]);

  useEffect(() => {
    if (!pathname.includes(CHATS_ROOT_LINK)) return;
    if (paramsChatId) {
      if (messages.length === 1) generateChatAfterRedirect();
      else loadChat(paramsChatId);
    } else newChat();
  }, [pathname, paramsChatId]);

  return (
    <ChatContext.Provider
      value={{
        subSidebarChatMenuContent,
        subSidebarChatMenuContentLoading,
        currentChatId,
        currentChatTitle,
        currentChatContextLoading,
        messages,
        messageLoading,
        isWebSearchOn,
        setIsWebSearchOn,
        isWebSearchOnLoading,
        generateNewChatIdAndNavigate,
        generateNewChatTitle,
        sendChat,
        loadChat,
        newChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

const useChatContext = () => {
  const _context = useContext(ChatContext);
  if (!_context) throw new Error("useChatContext must be used within a ChatProvider");
  return _context;
};

export { ChatProvider, useChatContext, type ChatContext };
