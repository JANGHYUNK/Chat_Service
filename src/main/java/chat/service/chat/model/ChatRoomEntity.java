package chat.service.chat.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_room")
@Getter
@NoArgsConstructor
public class ChatRoomEntity {
    @Id
    private String roomId;
    private String name;
    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public ChatRoomEntity(String roomId, String name) {
        this.roomId = roomId;
        this.name = name;
    }
}