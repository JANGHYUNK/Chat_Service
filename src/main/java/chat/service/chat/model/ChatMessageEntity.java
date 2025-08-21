package chat.service.chat.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_message")
@Getter
@NoArgsConstructor
public class ChatMessageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long messageId;

    private String roomId;
    private String sender;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    private ChatMessage.MessageType messageType;

    private LocalDateTime sentAt = LocalDateTime.now();

    public ChatMessageEntity(String roomId, String sender, String content, ChatMessage.MessageType messageType) {
        this.roomId = roomId;
        this.sender = sender;
        this.content = content;
        this.messageType = messageType;
    }
}