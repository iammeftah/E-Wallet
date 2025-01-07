package wav.hmed.authentication.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import wav.hmed.authentication.repository.UserRepository;
import wav.hmed.authentication.security.JWTAuthenticationFilter;
import wav.hmed.authentication.security.JWTAuthorizationFilter;
import wav.hmed.authentication.util.JWTUtil;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserRepository userRepository;

    private final JWTUtil jwtUtil;  // Add this

    public SecurityConfig(UserRepository userRepository, JWTUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, AuthenticationManager authManager) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(request -> {
                    var corsConfig = new org.springframework.web.cors.CorsConfiguration();
                    corsConfig.addAllowedOrigin("http://localhost:4200");
                    corsConfig.addAllowedOrigin("http://localhost:8092");
                    corsConfig.addAllowedOrigin("http://localhost:8093");
                    corsConfig.addAllowedOrigin("http://localhost:8094");
                    corsConfig.addAllowedOrigin("http://localhost:8095");  // Notification service
                    corsConfig.addAllowedMethod("*");
                    corsConfig.addAllowedHeader("*");
                    corsConfig.setAllowCredentials(true);
                    return corsConfig;
                }))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/admin/create-admin").permitAll()
                        .requestMatchers("/api/registration-response/**").permitAll()
                        .requestMatchers("/api/agents/create").permitAll()
                        .requestMatchers("/api/clients/create").permitAll()
                        .requestMatchers("/send-email").permitAll()
                        .requestMatchers("/api/notifications/**").permitAll()

                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilter(new JWTAuthenticationFilter(authManager, jwtUtil))
                .addFilter(new JWTAuthorizationFilter(authManager, jwtUtil));

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> userRepository.findByPhone(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with phone: " + username));
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }




}