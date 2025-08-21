document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');

    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                alert('회원가입에 성공했습니다! 로그인 페이지로 이동합니다.');
                window.location.href = '/login.html';
            } else {
                alert('회원가입에 실패했습니다. 다른 사용자 이름을 시도해보세요.');
            }
        } catch (error) {
            console.error('Signup error:', error);
            alert('오류가 발생했습니다. 다시 시도해주세요.');
        }
    });
});