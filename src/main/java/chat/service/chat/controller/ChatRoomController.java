package chat.service.chat.controller;

import chat.service.chat.model.ChatMessage;
import chat.service.chat.model.ChatRoom;
import chat.service.chat.model.ChatMessageEntity;
import chat.service.chat.repository.ChatMessageRepository;
import chat.service.chat.service.ChatRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class ChatRoomController {

    private final ChatRoomService chatRoomService;
    private final SimpMessageSendingOperations messagingTemplate;
    private final ChatMessageRepository chatMessageRepository;

    // --- REST API Endpoints ---
    @GetMapping("/api/chatrooms")
    public List<ChatRoom> getAllRooms() {
        return chatRoomService.findAllRooms();
    }

    @PostMapping("/api/chatrooms")
    public ChatRoom createRoom(@RequestBody Map<String, String> payload) {
        return chatRoomService.createChatRoom(payload.get("name"));
    }

    @DeleteMapping("/api/chatrooms/{roomId}")
    public void deleteRoom(@PathVariable String roomId) {
        chatRoomService.deleteRoom(roomId);
    }

    @GetMapping("/api/chatrooms/{roomId}/messages")
    public List<ChatMessage> getRoomMessages(@PathVariable String roomId) {
        return chatMessageRepository.findByRoomIdOrderBySentAtAsc(roomId).stream()
                .map(ChatMessage::new) // 엔티티를 DTO로 변환하는 로직을 생성자로 위임
                .collect(Collectors.toList());
    }

    // --- WebSocket Message Mappings ---
    @MessageMapping("/chat/{roomId}/sendMessage")
    public void sendMessage(@DestinationVariable String roomId, @Payload ChatMessage chatMessage) {
        ChatMessageEntity savedEntity = saveMessage(roomId, chatMessage);
        messagingTemplate.convertAndSend(String.format("/topic/chat/room/%s", roomId), new ChatMessage(savedEntity));
    }

    @MessageMapping("/chat/{roomId}/addUser")
    public void addUser(@DestinationVariable String roomId, @Payload ChatMessage chatMessage,
                        SimpMessageHeaderAccessor headerAccessor) {
        // WebSocket 세션에 사용자 이름과 방 ID를 저장합니다.
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        headerAccessor.getSessionAttributes().put("roomId", roomId);
        ChatMessageEntity savedEntity = saveMessage(roomId, chatMessage);
        messagingTemplate.convertAndSend(String.format("/topic/chat/room/%s", roomId), new ChatMessage(savedEntity));
    }

    private ChatMessageEntity saveMessage(String roomId, ChatMessage chatMessage) {
        ChatMessageEntity messageEntity = new ChatMessageEntity(roomId, chatMessage.getSender(), chatMessage.getContent(), chatMessage.getType());
        return chatMessageRepository.save(messageEntity);
    }
}