package wav.hmed.authentication.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import wav.hmed.authentication.entity.Role;
import wav.hmed.authentication.entity.User;
import wav.hmed.authentication.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    public User createUser(User user) {
        logger.info("Attempting to create new user with phone: {}", user.getPhone());

        if (user == null) {
            logger.error("User object is null");
            throw new RuntimeException("User cannot be null");
        }

        logger.debug("Checking if phone number already exists: {}", user.getPhone());
        if (userRepository.findByPhone(user.getPhone()).isPresent()) {
            logger.warn("Phone number already registered: {}", user.getPhone());
            throw new RuntimeException("Phone number already registered");
        }

        // Set default role as ADMIN
        user.setRole(Role.ADMIN);
        logger.debug("Set user role to ADMIN");

        // Hash the password using BCryptPasswordEncoder
        String hashedPassword = hashPassword(user.getPassword());
        user.setPassword(hashedPassword);
        logger.debug("Password hashed successfully");

        try {
            User savedUser = userRepository.save(user);
            logger.info("User created successfully with ID: {}", savedUser.getId());
            return savedUser;
        } catch (Exception e) {
            logger.error("Error saving user to database", e);
            throw new RuntimeException("Error creating user: " + e.getMessage());
        }
    }

    private String hashPassword(String plainPassword) {
        if (plainPassword == null || plainPassword.isEmpty()) {
            logger.error("Password is null or empty");
            throw new RuntimeException("Password cannot be null or empty");
        }
        logger.debug("Hashing password");
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        return passwordEncoder.encode(plainPassword);
    }
}