'use strict';

const messageForm = document.querySelector('#messageForm');
const messageInput = document.querySelector('#messageInput');
const messagesList = document.querySelector('#messages');
const chatHeader = document.querySelector('.chat-header h2');

let stompClient = null;
let username = null;
let roomId = null;

// 페이지 로드 시 채팅 초기화
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    roomId = urlParams.get('roomId');
    const roomName = urlParams.get('roomName');

    // Spring Security 컨텍스트에서 사용자 이름을 가져옵니다.
    // 실제로는 /api/me 같은 엔드포인트를 만들어 가져오는 것이 좋습니다.
    // 여기서는 컨트롤러에서 Principal을 사용하므로, 클라이언트에서는 보내기만 하면 됩니다.
    if (roomId) {
        chatHeader.textContent = decodeURIComponent(roomName); // 채팅방 이름 표시
        const socket = new SockJS('/ws-chat');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, onConnected, onError);
    }
});


function onConnected() {
    // 각 채팅방의 고유한 토픽을 구독합니다.
    stompClient.subscribe(`/topic/chat/room/${roomId}`, onMessageReceived);

    // 서버에 사용자 입장 정보를 전송합니다.
    stompClient.send(`/app/chat/${roomId}/addUser`,
        {},
        // 서버에서 Principal을 통해 사용자 이름을 얻으므로, sender는 비워도 됩니다.
        JSON.stringify({type: 'JOIN'})
    );

    // 이전 대화 기록을 불러옵니다.
    fetch(`/api/chatrooms/${roomId}/messages`)
        .then(response => response.json())
        .then(messages => {
            messages.forEach(message => {
                // 모든 유형의 과거 메시지(CHAT, JOIN, LEAVE)를 화면에 표시합니다.
                displayMessage(message);
            });
        })
        .catch(error => console.error('Error fetching previous messages:', error));
}

function onError(error) {
    alert('WebSocket 서버에 연결할 수 없습니다. 페이지를 새로고침하고 다시 시도하세요.');
}

function sendMessage(event) {
    const messageContent = messageInput.value.trim();
    if (messageContent && stompClient) {
        const chatMessage = {
            content: messageInput.value,
            type: 'CHAT'
        };
        stompClient.send(`/app/chat/${roomId}/sendMessage`, {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();
}

function onMessageReceived(payload) {
    const message = JSON.parse(payload.body);
    // 현재 사용자 이름을 알아야 'mine' 클래스를 적용할 수 있습니다.
    // 이 정보는 onConnected 시점에 서버에서 받아와 전역 변수에 저장하는 것이 좋습니다.
    // 지금은 임시로 message.sender를 사용합니다.
    if (!username) username = message.sender;
    displayMessage(message);
}

function displayMessage(message) {
    const messageArea = document.querySelector('#messages');
    let messageElement;

    if (message.type === 'JOIN' || message.type === 'LEAVE') {
        const eventTemplate = document.querySelector('#eventMessageTemplate').content.cloneNode(true);
        messageElement = eventTemplate.querySelector('li');
        messageElement.textContent = message.sender + (message.type === 'JOIN' ? ' 님이 입장하셨습니다.' : ' 님이 퇴장하셨습니다.');
    } else {
        const messageTemplate = document.querySelector('#messageTemplate').content.cloneNode(true);
        messageElement = messageTemplate.querySelector('li');

        const senderElement = messageElement.querySelector('.sender-name');
        const contentElement = messageElement.querySelector('.message-content');
        const timeElement = messageElement.querySelector('.message-time');

        senderElement.textContent = message.sender;
        contentElement.textContent = message.content;
        timeElement.textContent = message.sentAt;

        if (message.sender === username) {
            messageElement.classList.add('mine');
        }
    }

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}

messageForm.addEventListener('submit', sendMessage, true);

const leaveBtn = document.getElementById('leaveBtn');
if (leaveBtn) {
    leaveBtn.addEventListener('click', () => {
        // 가장 안정적인 방법은 즉시 페이지를 이동시키는 것입니다.
        // 브라우저가 페이지를 떠날 때 WebSocket 연결을 자동으로 종료하며,
        // 서버의 `SessionDisconnectEvent` 리스너가 이 이벤트를 감지하여
        // 다른 사용자에게 퇴장 사실을 안정적으로 알립니다.
        window.location.href = '/index.html';
    });
}