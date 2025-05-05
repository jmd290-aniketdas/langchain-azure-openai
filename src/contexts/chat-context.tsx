import {
  chatInvoke,
  createNewChat,
  createNewMessage,
  fetchAllChatIdsForUser,
  fetchChatMessages,
  fetchChatTitle,
  updateChatTitle,
} from "@/actions/chats.actions";
import { sendChatStream } from "@/actions/chats.client.actions";
import { CHATS_ROOT_LINK, EMPTY_STORED_MESSAGE, SCRATCHPAD_GEN_SYSTEM_MSG, TITLE_GEN_DEVELOPER_MSG } from "@/lib/consts";
import { Message } from "@/types/chats.types";
import { SubSidebarMenuContent } from "@/types/menus.types";
import { StoredMessage } from "@langchain/core/messages";
import { MessageCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { useModelsContext } from "./models-context";

type ChatContext = {
  subSidebarChatMenuContent: SubSidebarMenuContent[];
  subSidebarChatMenuContentLoading: boolean;

  currentChatId: string;
  currentChatTitle: string;
  currentChatContextLoading: boolean;

  messages: Message[];

  chatTextStream: string;
  chatTextResponse: StoredMessage;
  chatLoading: boolean;
  chatStreaming: boolean;

  scratchpadTextStream: string;
  scratchpadTextResponse: StoredMessage;
  scratchpadLoading: boolean;
  scratchpadStreaming: boolean;

  loadChat: (chatId: string) => Promise<void>;
  newChat: () => void;
  sendChat: (message: string) => Promise<void>;
  generateNewChat: (message: string) => Promise<void>;
  sendScratchpadChat: (message: string) => Promise<StoredMessage>;

  isWebSearchOn: boolean;
  setIsWebSearchOn: Dispatch<SetStateAction<boolean>>;
};

const ChatContext = createContext<ChatContext | undefined>(undefined);

const ChatProvider = ({ children }: { children?: React.ReactNode }) => {
  const { selectedModel } = useModelsContext();
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { chatId: paramsChatId }: { chatId: string } = useParams();

  const [subSidebarChatMenuContent, setSubSidebarChatMenuContent] = useState<SubSidebarMenuContent[]>([]);
  const [subSidebarChatMenuContentLoading, setSubSidebarChatMenuContentLoading] = useState<boolean>(true);

  const [currentChatId, setCurrentChatId] = useState<string>("");
  const [currentChatTitle, setCurrentChatTitle] = useState<string>("");
  const [currentChatContextLoading, setCurrentChatContextLoading] = useState<boolean>(!!paramsChatId);

  const [messages, setMessages] = useState<Message[]>([]);

  const [chatTextStream, setChatTextStream] = useState<string>("");
  const [chatTextResponse, setChatTextResponse] = useState<StoredMessage>(EMPTY_STORED_MESSAGE);
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [chatStreaming, setChatStreaming] = useState<boolean>(false);

  const [scratchpadTextStream, setScratchpadTextStream] = useState<string>("");
  const [scratchpadTextResponse, setScratchpadTextResponse] = useState<StoredMessage>(EMPTY_STORED_MESSAGE);
  const [scratchpadLoading, setScratchpadLoading] = useState<boolean>(false);
  const [scratchpadStreaming, setScratchpadStreaming] = useState<boolean>(false);

  const [isWebSearchOn, setIsWebSearchOn] = useState<boolean>(false);

  const fetchAllChatInfosForUser = (email: string) => {
    fetchAllChatIdsForUser(email)
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
  };

  useEffect(() => {
    if (!session) return;
    fetchAllChatInfosForUser(session.user.email);
  }, [session]);

  useEffect(() => {
    if (!pathname.includes(CHATS_ROOT_LINK)) return;
    if (!paramsChatId) newChat();
    else loadChat(paramsChatId);
  }, [pathname, paramsChatId]);

  const loadChat = async (_chatId: string) => {
    if (messages.length === 1) {
      await sendNewChat();
      return;
    }

    setCurrentChatContextLoading(true);
    try {
      setCurrentChatId(_chatId);

      const chatTitle = await fetchChatTitle(_chatId);
      setCurrentChatTitle(chatTitle);

      const chatMessages = await fetchChatMessages(_chatId);
      setMessages(chatMessages);
    } catch (error) {
      console.error(error);
      router.push(CHATS_ROOT_LINK);
    } finally {
      setCurrentChatContextLoading(false);
    }
  };

  const newChat = () => {
    setCurrentChatContextLoading(true);
    setCurrentChatId("");
    setCurrentChatTitle("New Chat");
    setMessages([]);
    setCurrentChatContextLoading(false);
  };

  const generateNewChat = async (message: string) => {
    if (sessionStatus !== "authenticated") throw new Error("Not Authenticated");

    const newChat = await createNewChat(session.user.email);

    const _messages = [...messages];
    const userMessage: Message = { role: "user", content: message };

    setCurrentChatId(newChat.id);
    setChatLoading(true);
    setMessages([..._messages, userMessage]);

    router.push(`${CHATS_ROOT_LINK}/${newChat.id}`);
  };

  const sendNewChat = async () => {
    try {
      if (sessionStatus !== "authenticated") throw new Error("Not Authenticated");

      const res = await sendChatStream({
        modelName: selectedModel,
        messages: [...messages],
        streamingTextSetter: setChatTextStream,
        loadingSetter: setChatLoading,
        streamingSetter: setChatStreaming,
        responseSetter: setChatTextResponse,
      });

      const assistantMessage: Message = { role: "assistant", content: res.data.content };

      setMessages([...messages, assistantMessage]);
      setChatTextStream("");

      await createNewMessage(currentChatId, assistantMessage);

      const developerMessage: Message = { role: "developer", content: TITLE_GEN_DEVELOPER_MSG };
      const titleRes = await chatInvoke(selectedModel, [...messages, assistantMessage, developerMessage]);
      setCurrentChatTitle(titleRes.data.content);
      await updateChatTitle(currentChatId, titleRes.data.content);
      fetchAllChatInfosForUser(session.user.email);
    } catch (error) {
      setChatTextStream("An error occured");
      throw error;
    }
  };

  const sendChat = async (message: string) => {
    try {
      if (sessionStatus !== "authenticated") throw new Error("Not Authenticated");

      const _messages = [...messages];
      const userMessage: Message = { role: "user", content: message };

      setMessages([..._messages, userMessage]);

      const res = await sendChatStream({
        modelName: selectedModel,
        messages: [..._messages, userMessage],
        streamingTextSetter: setChatTextStream,
        loadingSetter: setChatLoading,
        streamingSetter: setChatStreaming,
        responseSetter: setChatTextResponse,
      });

      const assistantMessage: Message = { role: "assistant", content: res.data.content };

      setMessages([..._messages, userMessage, assistantMessage]);
      setChatTextStream("");

      await createNewMessage(currentChatId, userMessage);
      await createNewMessage(currentChatId, assistantMessage);
    } catch (error) {
      setChatTextStream("An error occured");
      throw error;
    }
  };

  const sendScratchpadChat = async (message: string) => {
    try {
      setScratchpadTextStream(message);
      const systemMessage: Message = { role: "system", content: SCRATCHPAD_GEN_SYSTEM_MSG };
      const userMessage: Message = { role: "user", content: message };
      const res = await sendChatStream({
        modelName: selectedModel,
        messages: [systemMessage, userMessage],
        streamingTextSetter: setScratchpadTextStream,
        loadingSetter: setScratchpadLoading,
        streamingSetter: setScratchpadStreaming,
        responseSetter: setScratchpadTextResponse,
      });
      return res;
    } catch (error) {
      setScratchpadTextStream("An error occured");
      throw error;
    }
  };

  return (
    <ChatContext.Provider
      value={{
        subSidebarChatMenuContent,
        subSidebarChatMenuContentLoading,
        currentChatId,
        currentChatTitle,
        currentChatContextLoading,
        messages,
        chatTextStream,
        chatTextResponse,
        chatLoading,
        chatStreaming,
        scratchpadTextStream,
        scratchpadTextResponse,
        scratchpadLoading,
        scratchpadStreaming,
        loadChat,
        newChat,
        generateNewChat,
        sendChat,
        sendScratchpadChat,
        isWebSearchOn,
        setIsWebSearchOn,
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
