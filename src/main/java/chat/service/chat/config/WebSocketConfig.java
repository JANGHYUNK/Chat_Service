package chat.service.chat.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // 메시지를 구독하는 클라이언트에게 메시지를 전달할 때 사용하는 경로의 prefix.
        // 클라이언트는 /topic/{roomId}를 구독하여 메시지를 받을 수 있습니다.
        config.enableSimpleBroker("/topic");

        // 클라이언트가 서버로 메시지를 보낼 때 사용하는 경로의 prefix.
        // 클라이언트는 /app/{...} 경로로 메시지를 보냅니다.
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // WebSocket 연결을 위한 엔드포인트 경로를 설정합니다.
        // SockJS를 사용해 WebSocket을 지원하지 않는 브라우저에서도 통신이 가능하게 합니다.
        registry.addEndpoint("/ws-chat")
                .setAllowedOriginPatterns("*") // 모든 Origin 허용
                .withSockJS();
    }
}