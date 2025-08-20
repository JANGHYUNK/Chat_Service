'use strict';

const usernamePage = document.querySelector('#username-page');
const chatPage = document.querySelector('#chat-page');
const usernameForm = document.querySelector('#usernameForm');
const messageForm = document.querySelector('#messageForm');
const messageInput = document.querySelector('#messageInput');
const messagesList = document.querySelector('#messages');
const chatHeader = document.querySelector('.chat-header h2');

let stompClient = null;
let username = null;
let roomId = null;

function connect(event) {
    username = document.querySelector('#name').value.trim();

    const urlParams = new URLSearchParams(window.location.search);
    roomId = urlParams.get('roomId');
    const roomName = urlParams.get('roomName');

    if (username && roomId) {
        chatHeader.textContent = decodeURIComponent(roomName); // 채팅방 이름 표시

        usernamePage.classList.add('d-none');
        chatPage.style.display = 'block';

        const socket = new SockJS('/ws-chat');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();
}

function onConnected() {
    // 각 채팅방의 고유한 토픽을 구독합니다.
    stompClient.subscribe(`/topic/chat/room/${roomId}`, onMessageReceived);

    // 서버에 사용자 입장 정보를 전송합니다.
    stompClient.send(`/app/chat/${roomId}/addUser`,
        {},
        JSON.stringify({sender: username, type: 'JOIN'})
    );

    // 이전 대화 기록을 불러옵니다.
    fetch(`/api/chatrooms/${roomId}/messages`)
        .then(response => response.json())
        .then(messages => {
            messages.forEach(message => {
                // JOIN/LEAVE 메시지는 기록에서 보여주지 않거나, 다르게 처리할 수 있습니다.
                if (message.type === 'CHAT') {
                    displayMessage(message);
                }
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
            sender: username,
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
    displayMessage(message);
}

function displayMessage(message) {
    const messageElement = document.createElement('li');

    if (message.type === 'JOIN' || message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        messageElement.textContent = message.type === 'JOIN' ? message.sender + ' 님이 입장하셨습니다.' : message.sender + ' 님이 퇴장하셨습니다.';
    } else {
        messageElement.classList.add('chat-message');
        if (message.sender === username) {
            messageElement.classList.add('mine');
        }
        messageElement.innerHTML = `<strong>${message.sender}</strong>: <span>${message.content}</span>`;
    }

    messagesList.appendChild(messageElement);
    messagesList.scrollTop = messagesList.scrollHeight;
}

usernameForm.addEventListener('submit', connect, true);
messageForm.addEventListener('submit', sendMessage, true);