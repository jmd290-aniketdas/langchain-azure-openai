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

  chatId: string;
  chatTitle: string;

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
  sendChat: (message: string) => Promise<StoredMessage>;
  sendScratchpadChat: (message: string) => Promise<StoredMessage>;

  isWebSearchOn: boolean;
  setIsWebSearchOn: Dispatch<SetStateAction<boolean>>;
};

const ChatContext = createContext<ChatContext | undefined>(undefined);

const ChatProvider = ({ children }: { children?: React.ReactNode }) => {
  const [subSidebarChatMenuContent, setSubSidebarChatMenuContent] = useState<SubSidebarMenuContent[]>([]);
  const [subSidebarChatMenuContentLoading, setSubSidebarChatMenuContentLoading] = useState<boolean>(true);

  const [chatId, setChatId] = useState<string>("");
  const [chatTitle, setChatTitle] = useState<string>("");

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

  const { selectedModel } = useModelsContext();
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { chatId: paramsChatId }: { chatId: string } = useParams();

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
    setChatLoading(true);
    try {
      setChatId(_chatId);

      const chatTitle = await fetchChatTitle(_chatId);
      setChatTitle(chatTitle);

      const chatMessages = await fetchChatMessages(_chatId);
      setMessages(chatMessages);
    } catch (error) {
      console.error(error);
      router.push(CHATS_ROOT_LINK);
    } finally {
      setChatLoading(false);
    }
  };

  const newChat = () => {
    setChatLoading(true);
    setChatId("");
    setChatTitle("New Chat");
    setMessages([]);
    setChatLoading(false);
  };

  const sendChat = async (message: string) => {
    try {
      if (sessionStatus !== "authenticated") throw new Error("Not Authenticated");

      const _messages = [...messages];
      const userMessage: Message = { role: "user", content: message };

      setMessages([..._messages, userMessage]);

      let newChatId: string = "";
      if (!chatId) {
        const newChat = await createNewChat(session.user.email);
        newChatId = newChat.id;
        setChatId(newChat.id);
        router.push(`${CHATS_ROOT_LINK}/${newChat.id}`);
      }

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

      if (newChatId) {
        await createNewMessage(newChatId, userMessage);
        await createNewMessage(newChatId, assistantMessage);

        const developerMessage: Message = { role: "developer", content: TITLE_GEN_DEVELOPER_MSG };
        const titleRes = await chatInvoke(selectedModel, [...messages, userMessage, assistantMessage, developerMessage]);
        setChatTitle(titleRes.data.content);
        await updateChatTitle(newChatId, titleRes.data.content);
        fetchAllChatInfosForUser(session.user.email);
      } else {
        await createNewMessage(chatId, userMessage);
        await createNewMessage(chatId, assistantMessage);
      }

      return res;
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
        chatId,
        chatTitle,
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
