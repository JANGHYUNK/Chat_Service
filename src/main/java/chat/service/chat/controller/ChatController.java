package chat.service.chat.controller;

import chat.service.chat.model.ChatRoom;
import chat.service.chat.service.ChatRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/chatrooms")
class chatRoomController {

    @Autowired
    private ChatRoomService chatRoomService;

    @GetMapping
    public List<ChatRoom> getAllRooms() {
        return chatRoomService.findAllRooms();
    }

    @PostMapping
    public ChatRoom createRoom(@RequestBody String name) {
        return chatRoomService.createChatRoom(name);
    }

    @DeleteMapping("/{roomId}")
    public void deleteRoom(@PathVariable String roomId) {
        chatRoomService.deleteRoom(roomId);
    }
}