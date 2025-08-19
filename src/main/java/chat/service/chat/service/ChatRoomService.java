package chat.service.chat.service;

import chat.service.chat.model.ChatRoom;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ChatRoomService {

    // 여러 스레드가 동시에 접근해도 안전한 ConcurrentHashMap을 사용합니다.
    private final Map<String, ChatRoom> chatRooms = new ConcurrentHashMap<>();

    // 채팅방 생성
    public ChatRoom createChatRoom(String name) {
        String roomId = UUID.randomUUID().toString();
        ChatRoom chatRoom = new ChatRoom(roomId, name);
        chatRooms.put(roomId, chatRoom);
        return chatRoom;
    }

    // 모든 채팅방 조회
    public List<ChatRoom> findAllRooms() {
        return new ArrayList<>(chatRooms.values());
    }

    // 특정 채팅방 조회
    public ChatRoom findRoomById(String roomId) {
        return chatRooms.get(roomId);
    }

    // 채팅방 삭제
    public void deleteRoom(String roomId) {
        chatRooms.remove(roomId);
    }
}