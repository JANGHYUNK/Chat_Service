package chat.service.chat.listener;

import chat.service.chat.model.ChatMessage;
import chat.service.chat.model.ChatMessageEntity;
import chat.service.chat.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {

    private final SimpMessageSendingOperations messageTemplate;
    private final ChatMessageRepository chatMessageRepository;

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        // 세션에서 사용자 이름과 방 ID를 가져옵니다.
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        String roomId = (String) headerAccessor.getSessionAttributes().get("roomId");
        if (username != null && roomId != null) {
            log.info("사용자 연결 해제: {}, 채팅방 ID: {}", username, roomId);
            var chatMessage = new ChatMessage();
            chatMessage.setType(ChatMessage.MessageType.LEAVE);
            chatMessage.setSender(username);

            ChatMessageEntity messageEntity = new ChatMessageEntity(roomId, chatMessage.getSender(), null, chatMessage.getType());
            chatMessageRepository.save(messageEntity);
            messageTemplate.convertAndSend(String.format("/topic/chat/room/%s", roomId), chatMessage);
        }
    }
}
