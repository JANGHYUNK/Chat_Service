package chat.service.chat.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ChatMessage {

    private String sender;
    private String content;
    private MessageType type;

    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE
    }

    public ChatMessage(ChatMessageEntity entity) {
        this.sender = entity.getSender();
        this.content = entity.getContent();
        this.type = entity.getMessageType();
    }
}