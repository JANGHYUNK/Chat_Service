package chat.service.chat.service;

import chat.service.chat.model.ChatRoom;
import chat.service.chat.model.ChatRoomEntity;
import chat.service.chat.repository.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;

    // 채팅방 생성
    public ChatRoom createChatRoom(String name) {
        ChatRoomEntity chatRoomEntity = new ChatRoomEntity(UUID.randomUUID().toString(), name);
        chatRoomRepository.save(chatRoomEntity);
        return new ChatRoom(chatRoomEntity.getRoomId(), chatRoomEntity.getName());
    }

    // 모든 채팅방 조회
    public List<ChatRoom> findAllRooms() {
        return chatRoomRepository.findAll().stream()
                .map(entity -> new ChatRoom(entity.getRoomId(), entity.getName()))
                .collect(Collectors.toList());
    }

    // 채팅방 삭제
    public void deleteRoom(String roomId) {
        chatRoomRepository.deleteById(roomId);
    }
}