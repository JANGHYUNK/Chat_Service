// js/rooms.js

// 서버의 REST API 기본 주소
const API_URL = "http://localhost:8080/api/chatrooms";

// DOM 요소
const roomList = document.getElementById('roomList');
const roomNameInput = document.getElementById('roomNameInput');
const createRoomBtn = document.getElementById('createRoomBtn');

// 채팅방 목록 불러오기
async function fetchRooms() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('네트워크 응답이 올바르지 않습니다.');
        }
        const rooms = await response.json();
        renderRooms(rooms);
    } catch (error) {
        console.error('채팅방 목록을 가져오는 중 오류 발생:', error);
    }
}

// 채팅방 목록을 화면에 렌더링
function renderRooms(rooms) {
    roomList.innerHTML = ''; // 기존 목록 초기화
    rooms.forEach(room => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${room.name} (${room.roomId})</span>
            <button class="delete-btn" data-room-id="${room.roomId}">삭제</button>
            <button class="join-btn" data-room-id="${room.roomId}">입장</button>
        `;
        roomList.appendChild(li);
    });
}

// 채팅방 생성
async function createRoom() {
    const roomName = roomNameInput.value.trim();
    if (roomName === '') {
        alert('방 이름을 입력해주세요.');
        return;
    }

    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: roomName
        });
        roomNameInput.value = ''; // 입력창 초기화
        fetchRooms(); // 목록 새로고침
    } catch (error) {
        console.error('채팅방 생성 중 오류 발생:', error);
    }
}

// 채팅방 삭제
async function deleteRoom(roomId) {
    if (!confirm('정말로 삭제하시겠습니까?')) {
        return;
    }
    try {
        await fetch(`${API_URL}/${roomId}`, {
            method: 'DELETE'
        });
        fetchRooms(); // 목록 새로고침
    } catch (error) {
        console.error('채팅방 삭제 중 오류 발생:', error);
    }
}

// 이벤트 리스너 등록
roomList.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
        const roomId = event.target.dataset.roomId;
        deleteRoom(roomId);
    } else if (event.target.classList.contains('join-btn')) {
        const roomId = event.target.dataset.roomId;
        window.location.href = `chat.html?roomId=${roomId}`;
    }
});
createRoomBtn.addEventListener('click', createRoom);

// 페이지 로드 시 채팅방 목록 불러오기
document.addEventListener('DOMContentLoaded', fetchRooms);