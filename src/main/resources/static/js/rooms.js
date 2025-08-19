'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const roomNameInput = document.getElementById('roomNameInput');
    const createRoomBtn = document.getElementById('createRoomBtn');
    const roomList = document.getElementById('roomList');

    // Function to fetch and display rooms
    async function loadRooms() {
        try {
            const response = await fetch('/api/chatrooms');
            if (!response.ok) {
                throw new Error('채팅방 목록을 불러오는데 실패했습니다.');
            }
            const rooms = await response.json();
            roomList.innerHTML = ''; // Clear existing list
            rooms.forEach(room => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                // Pass roomId and roomName to chat.html via URL parameters
                a.href = `/chat.html?roomId=${room.roomId}&roomName=${encodeURIComponent(room.name)}`;
                a.textContent = room.name;
                li.appendChild(a);
                roomList.appendChild(li);
            });
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }

    // Function to create a new room
    async function createRoom() {
        const roomName = roomNameInput.value.trim();
        if (!roomName) {
            alert('채팅방 이름을 입력해주세요.');
            return;
        }

        try {
            await fetch('/api/chatrooms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: roomName }),
            });
            roomNameInput.value = ''; // Clear input
            await loadRooms(); // Reload the list
        } catch (error) {
            console.error(error);
            alert('채팅방 생성에 실패했습니다.');
        }
    }

    // Event Listeners
    createRoomBtn.addEventListener('click', createRoom);

    // Initial load
    loadRooms();
});