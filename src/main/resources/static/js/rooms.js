document.addEventListener('DOMContentLoaded', () => {
    const roomList = document.getElementById('roomList');
    const createRoomBtn = document.getElementById('createRoomBtn');
    const roomNameInput = document.getElementById('roomNameInput');

    // 채팅방 목록 불러오기
    const fetchRooms = async () => {
        try {
            const response = await fetch('/api/chatrooms');
            if (!response.ok) {
                throw new Error('채팅방 목록을 불러오는데 실패했습니다.');
            }
            const rooms = await response.json();
            roomList.innerHTML = ''; // 목록 초기화

            if (rooms.length === 0) {
                roomList.innerHTML = '<li class="list-group-item text-center text-muted">개설된 채팅방이 없습니다.</li>';
            } else {
                rooms.forEach(room => {
                    const roomElement = document.createElement('li');
                    roomElement.className = 'list-group-item d-flex justify-content-between align-items-center';

                    const roomLink = document.createElement('a');
                    roomLink.href = `/chat.html?roomId=${room.roomId}&roomName=${encodeURIComponent(room.name)}`;
                    roomLink.textContent = room.name;
                    roomLink.className = 'room-link';

                    // 삭제 버튼 생성 (Bootstrap 클래스를 제거하여 스타일 충돌 방지)
                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'delete-btn';
                    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
                    deleteBtn.dataset.roomId = room.roomId;

                    roomElement.appendChild(roomLink);
                    roomElement.appendChild(deleteBtn);
                    roomList.appendChild(roomElement);
                });
            }
        } catch (error) {
            console.error(error);
            roomList.innerHTML = '<li class="list-group-item text-danger">채팅방 목록을 불러올 수 없습니다.</li>';
        }
    };

    // 채팅방 생성
    const createRoom = async () => {
        const name = roomNameInput.value.trim();
        if (!name) {
            alert('채팅방 이름을 입력해주세요.');
            return;
        }
        try {
            const response = await fetch('/api/chatrooms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: name }),
            });
            if (!response.ok) {
                throw new Error('채팅방 생성에 실패했습니다.');
            }
            roomNameInput.value = '';
            fetchRooms(); // 목록 새로고침
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    // 채팅방 삭제 (이벤트 위임 사용)
    roomList.addEventListener('click', async (event) => {
        // 클릭된 요소가 삭제 버튼(또는 그 안의 아이콘)인지 확인합니다.
        const deleteBtn = event.target.closest('.delete-btn');

        if (deleteBtn) {
            const roomId = deleteBtn.dataset.roomId;
            if (confirm('정말로 이 채팅방을 삭제하시겠습니까?')) {
                try {
                    const response = await fetch(`/api/chatrooms/${roomId}`, {
                        method: 'DELETE',
                    });

                    if (!response.ok) {
                        throw new Error('채팅방 삭제에 실패했습니다.');
                    }
                    // 삭제 성공 시, 채팅방 목록을 다시 불러옵니다.
                    fetchRooms();
                } catch (error) {
                    console.error(error);
                    alert(error.message);
                }
            }
        }
    });

    // '방 생성' 버튼 클릭 시 createRoom 함수 호출
    createRoomBtn.addEventListener('click', createRoom);

    // 입력 필드에서 Enter 키를 눌렀을 때도 방 생성
    roomNameInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            createRoom();
        }
    });

    // 페이지가 처음 로드될 때 채팅방 목록을 불러옵니다.
    fetchRooms();
});