package wav.hmed.authentication.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import wav.hmed.authentication.dto.LoginRequest;
import wav.hmed.authentication.dto.LoginResponse;
import wav.hmed.authentication.entity.User;
import wav.hmed.authentication.util.JWTUtil;

import java.io.IOException;

public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
    private final AuthenticationManager authManager;
    private final JWTUtil jwtUtil;

    public JWTAuthenticationFilter(AuthenticationManager authManager, JWTUtil jwtUtil) {  // Add JWTUtil parameter
        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
        setFilterProcessesUrl("/api/auth/login");
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {
        try {
            LoginRequest loginRequest = new ObjectMapper()
                    .readValue(request.getInputStream(), LoginRequest.class);

            return authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getPhone(),
                            loginRequest.getPassword()
                    )
            );
        } catch (IOException e) {
            throw new RuntimeException("Error reading login request", e);
        }
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                            FilterChain chain, Authentication authResult) throws IOException {
        User user = (User) authResult.getPrincipal();

        logger.info("Successful authentication for user: " + user.getPhone());
        logger.info("User role: " + user.getRole());
        logger.info("User authorities: " + user.getAuthorities());

        String token = jwtUtil.generateToken(user);

        // Verify token contents immediately after generation
        logger.info("Generated token: " + token);
        logger.info("Extracted roles from new token: " + jwtUtil.extractRoles(token));

        LoginResponse loginResponse = new LoginResponse(token, user);
        response.setContentType("application/json");
        new ObjectMapper().writeValue(response.getWriter(), loginResponse);
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                              AuthenticationException failed) throws IOException, ServletException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"" + failed.getMessage() + "\"}");
    }
}