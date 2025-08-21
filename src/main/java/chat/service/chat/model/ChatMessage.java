package chat.service.chat.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.format.DateTimeFormatter;

@Getter
@Setter
@NoArgsConstructor
public class ChatMessage {

    private String sender;
    private String content;
    private MessageType type;
    private String sentAt;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("a h:mm");

    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE
    }

    public ChatMessage(ChatMessageEntity entity) {
        this.sender = entity.getSender();
        this.content = entity.getContent();
        this.type = entity.getMessageType();
        if (entity.getSentAt() != null) {
            this.sentAt = entity.getSentAt().format(FORMATTER);
        }
    }
}