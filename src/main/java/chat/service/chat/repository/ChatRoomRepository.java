package chat.service.chat.repository;

import chat.service.chat.model.ChatRoomEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRoomRepository extends JpaRepository<ChatRoomEntity, String> {
}