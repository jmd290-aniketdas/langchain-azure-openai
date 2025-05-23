import {
  chatInvoke,
  createNewChat,
  createNewMessage,
  fetchChatMessages,
  fetchChatTitle,
  updateChatTitle,
} from "@/actions/chats.actions";
import { chatStream } from "@/actions/chats.client.actions";
import { useSidebar } from "@/components/ui/sidebar";
import useLocalStorage from "@/hooks/use-local-storage";
import { CHATS_ROOT_LINK, SCRATCHPAD_GEN_SYSTEM_MSG, TITLE_GEN_DEVELOPER_MSG } from "@/lib/consts";
import { Message } from "@/types/chats.types";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

type ChatContext = {
  currentChatId: string;
  currentChatTitle: string;
  currentChatContextLoading: boolean;

  messages: Message[];
  messageLoading: boolean;
  messageGenerating: boolean;
  sendChat: (message: string) => Promise<void>;

  scratchpadMessage: Message;
  scratchpadMessageLoading: boolean;
  scratchpadMessageGenerating: boolean;
  sendScratchpadChat: (message: string) => Promise<void>;

  loadChat: (chatId: string) => Promise<void>;
  newChat: () => void;
};

const ChatContext = createContext<ChatContext | undefined>(undefined);

const ChatProvider = ({ children }: { children?: React.ReactNode }) => {
  const [selectedModel, _, isSelectedModelLoading] = useLocalStorage("model", "");
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const { chatId: paramsChatId }: { chatId?: string } = useParams();
  const { chatMenuSidebarContentRefresh } = useSidebar();

  const [currentChatId, setCurrentChatId] = useState<string>("");
  const [currentChatTitle, setCurrentChatTitle] = useState<string>("");
  const [currentChatContextLoading, setCurrentChatContextLoading] = useState<boolean>(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageLoading, setMessageLoading] = useState<boolean>(false);
  const [messageGenerating, setMessageGenerating] = useState<boolean>(false);

  const [scratchpadMessage, setScratchpadMessage] = useState<Message>({ role: "assistant", content: "" });
  const [scratchpadMessageLoading, setScratchpadMessageLoading] = useState<boolean>(false);
  const [scratchpadMessageGenerating, setScratchpadMessageGenerating] = useState<boolean>(false);

  const isNavigatingAfterNewChatCreationRef = useRef<boolean>(false);

  const sendChat = useCallback(
    async (message: string): Promise<void> => {
      if (sessionStatus !== "authenticated") return;
      if (currentChatContextLoading || isSelectedModelLoading || messageLoading || messageGenerating) return;

      let chatId = paramsChatId;

      const userMessage: Message = { role: "user", content: message };
      let assistantAcc: Message = { role: "assistant", content: "" };

      const history = [...messages];

      setMessages((m) => [...m, userMessage]);
      setMessageLoading(() => true);

      if (!chatId) {
        const newChat = await createNewChat(session.user.email);
        chatId = newChat.id;

        isNavigatingAfterNewChatCreationRef.current = true;
        setCurrentChatId(chatId);

        router.push(`${CHATS_ROOT_LINK}/${chatId}`);
      }

      for await (const chunk of chatStream(selectedModel, [...history, userMessage])) {
        setMessageLoading(() => false);
        setMessageGenerating(() => true);

        assistantAcc.content += chunk.data.content;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last.role === "assistant") {
            return [...prev.slice(0, -1), assistantAcc];
          }
          return [...prev, assistantAcc];
        });
      }

      setMessageGenerating(() => false);

      await createNewMessage(chatId, userMessage);
      await createNewMessage(chatId, assistantAcc);

      if (!paramsChatId) {
        const titlePrompt: Message = { role: "developer", content: TITLE_GEN_DEVELOPER_MSG };
        const titleRes = await chatInvoke(selectedModel, [...history, userMessage, assistantAcc, titlePrompt]);
        const newTitle = titleRes.data.content;
        setCurrentChatTitle(newTitle);
        await updateChatTitle(chatId, newTitle);

        chatMenuSidebarContentRefresh(true);
      }
    },
    [
      session,
      sessionStatus,
      router,
      currentChatContextLoading,
      chatMenuSidebarContentRefresh,
      messages,
      selectedModel,
      isSelectedModelLoading,
      messageLoading,
      messageGenerating,
      paramsChatId,
    ]
  );

  const sendScratchpadChat = useCallback(
    async (message: string): Promise<void> => {
      if (sessionStatus !== "authenticated") return;
      if (isSelectedModelLoading || scratchpadMessageLoading || scratchpadMessageGenerating) return;

      setScratchpadMessage({ role: "assistant", content: "" });

      const userMessage: Message = { role: "user", content: message };
      const systemMessage: Message = { role: "system", content: SCRATCHPAD_GEN_SYSTEM_MSG };
      let assistantAcc: Message = { role: "assistant", content: "" };

      setScratchpadMessageLoading(() => true);

      for await (const chunk of chatStream(selectedModel, [systemMessage, userMessage])) {
        setScratchpadMessageLoading(() => false);
        setScratchpadMessageGenerating(() => true);

        assistantAcc.content += chunk.data.content;
        setScratchpadMessage((prev) => ({ ...prev, content: prev.content + chunk.data.content }));
      }

      setScratchpadMessageGenerating(() => false);
    },
    [session, sessionStatus, selectedModel, isSelectedModelLoading, scratchpadMessageLoading, scratchpadMessageGenerating]
  );

  const loadChat = useCallback(
    async (chatId: string) => {
      if (sessionStatus !== "authenticated") return;

      setCurrentChatContextLoading(() => true);
      try {
        setCurrentChatId(chatId);

        const chatTitle = await fetchChatTitle(chatId);
        setCurrentChatTitle(chatTitle);

        const chatMessages = await fetchChatMessages(chatId);
        setMessages(chatMessages);
      } catch (error) {
        console.error(error);
        toast.error((error as Error).message);

        router.push(CHATS_ROOT_LINK);
      } finally {
        setCurrentChatContextLoading(() => false);
      }
    },
    [router, sessionStatus]
  );

  const newChat = useCallback(() => {
    if (sessionStatus !== "authenticated") return;
    setCurrentChatId("");
    setCurrentChatTitle("");
    setMessages([]);
  }, [sessionStatus]);

  useEffect(() => {
    if (sessionStatus !== "authenticated") return;

    if (!paramsChatId && currentChatId && !isNavigatingAfterNewChatCreationRef.current) {
      newChat();
    } else if (isNavigatingAfterNewChatCreationRef.current && paramsChatId === currentChatId) {
      isNavigatingAfterNewChatCreationRef.current = false;
    } else if (!isNavigatingAfterNewChatCreationRef.current && paramsChatId && paramsChatId !== currentChatId) {
      loadChat(paramsChatId);
    }
  }, [paramsChatId, sessionStatus, loadChat, newChat, currentChatId]);

  const contextValue = useMemo(
    () => ({
      currentChatId,
      currentChatTitle,
      currentChatContextLoading,
      messages,
      messageLoading,
      messageGenerating,
      sendChat,
      scratchpadMessage,
      scratchpadMessageLoading,
      scratchpadMessageGenerating,
      sendScratchpadChat,
      loadChat,
      newChat,
    }),
    [
      currentChatId,
      currentChatTitle,
      currentChatContextLoading,
      messages,
      messageLoading,
      messageGenerating,
      sendChat,
      scratchpadMessage,
      scratchpadMessageLoading,
      scratchpadMessageGenerating,
      sendScratchpadChat,
      loadChat,
      newChat,
    ]
  );

  return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>;
};

const useChatContext = () => {
  const _context = useContext(ChatContext);
  if (!_context) throw new Error("useChatContext must be used within a ChatProvider");
  return _context;
};

export { ChatProvider, useChatContext, type ChatContext };
