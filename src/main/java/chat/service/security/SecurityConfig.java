package chat.service.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // CSRF 보호 비활성화 (API 서버용)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/login.html", "/signup.html", "/css/**", "/js/**", "/api/signup").permitAll()
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginPage("/login.html") // 커스텀 로그인 페이지
                        .loginProcessingUrl("/login") // 로그인 처리 URL
                        .defaultSuccessUrl("/index.html", true) // 로그인 성공 시 이동할 페이지
                        .permitAll()
                )
                .logout(logout -> logout
                        .logoutSuccessUrl("/login.html") // 로그아웃 성공 시 이동할 페이지
                        .permitAll()
                );
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}