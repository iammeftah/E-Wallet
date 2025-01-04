package wav.hmed.authentication.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import wav.hmed.authentication.clients.BackofficeClient;
import wav.hmed.authentication.dto.LoginRequest;
import wav.hmed.authentication.dto.LoginResponse;
import wav.hmed.authentication.entity.Agent;
import wav.hmed.authentication.entity.RegistrationStatus;
import wav.hmed.authentication.entity.Role;
import wav.hmed.authentication.entity.User;
import wav.hmed.authentication.repository.AgentRepository;
import wav.hmed.authentication.repository.UserRepository;
import wav.hmed.authentication.util.JWTUtil;

import java.util.logging.Logger;

@Service
public class AuthService {
    private static final Logger logger = Logger.getLogger(AuthService.class.getName());

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTUtil jwtUtil;
    private final AgentRepository agentRepository;
    private final BackofficeClient backofficeClient;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JWTUtil jwtUtil, AgentRepository agentRepository, BackofficeClient backofficeClient) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.agentRepository = agentRepository;
        this.backofficeClient = backofficeClient;
    }


    public LoginResponse login(LoginRequest request) {
        // Validate request
        if (request == null || request.getPhone() == null || request.getPassword() == null) {
            throw new IllegalArgumentException("Invalid login request");
        }

        // Find user
        User user = userRepository.findByPhone(request.getPhone())
                .orElseThrow(() -> new RuntimeException("User not found"));

        logger.info("Processing login for user: " + user.getPhone());

        // Validate password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            logger.warning("Invalid password attempt for user: " + user.getPhone());
            throw new RuntimeException("Invalid credentials");
        }

        try {
            // Generate token
            String token = jwtUtil.generateToken(user);

            // Validate generated token
            if (token == null || token.trim().isEmpty()) {
                throw new RuntimeException("Error generating token");
            }

            logger.info("Login successful for user: " + user.getPhone());
            return new LoginResponse(token, user);
        } catch (Exception e) {
            logger.severe("Error during login process: " + e.getMessage());
            throw new RuntimeException("Authentication failed", e);
        }
    }

    public void logout(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            // Implementation for token blacklisting if needed
            logger.info("User logged out successfully");
        }
    }




    @Transactional
    public Agent registerAgent(Agent agent) {
        // Set initial status
        agent.setRole(Role.AGENT);
        agent.setStatus(RegistrationStatus.PENDING);

        // Save agent in auth database
        Agent savedAgent = agentRepository.save(agent);

        // Send registration request to backoffice
        try {
            backofficeClient.sendRegistrationRequest(savedAgent);
        } catch (Exception e) {
            // Log error and potentially handle failure
            logger.severe(e.getMessage());
            logger.severe("Failed to send registration request to backoffice");
        }

        return savedAgent;
    }
}