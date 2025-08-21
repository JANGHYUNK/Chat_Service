package chat.service.user;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UserAccountController {

    private final UserAccountService userAccountService;

    @PostMapping("/api/signup")
    public ResponseEntity<String> signup(@RequestBody SignUpRequest request) {
        userAccountService.signup(request.getUsername(), request.getPassword());
        return ResponseEntity.ok("회원가입이 성공적으로 완료되었습니다.");
    }

    // DTO for signup request
    @Getter
    private static class SignUpRequest {
        private String username;
        private String password;
    }
}