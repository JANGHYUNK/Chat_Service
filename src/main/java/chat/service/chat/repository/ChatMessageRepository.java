package chat.service.chat.repository;

import chat.service.chat.model.ChatMessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessageEntity, Long> {
    List<ChatMessageEntity> findByRoomIdOrderBySentAtAsc(String roomId);
    void deleteByRoomId(String roomId);
}