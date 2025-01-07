package wav.hmed.bank.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import wav.hmed.bank.security.JWTAuthorizationFilter;
import wav.hmed.bank.client.AuthenticationClient;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final AuthenticationClient authenticationClient;

    public SecurityConfig(AuthenticationClient authenticationClient) {
        this.authenticationClient = authenticationClient;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .cors().and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests()
                .requestMatchers("/api/accounts/**").hasAnyRole("CLIENT", "AGENT", "ADMIN")
                .anyRequest().authenticated()
                .and()
                .addFilterBefore(
                        new JWTAuthorizationFilter(authenticationClient),
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}