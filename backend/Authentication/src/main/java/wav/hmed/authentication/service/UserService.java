package wav.hmed.authentication.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import wav.hmed.authentication.entity.Role;
import wav.hmed.authentication.entity.User;
import wav.hmed.authentication.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.authentication.BadCredentialsException;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User getUserByPhone(String phone) {
        return userRepository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

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
        String hashedPassword = passwordEncoder.encode(user.getPassword());

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

    public User updateUser(String phone, User updatedUser) {
        logger.info("Updating user profile for phone: {}", phone);

        User existingUser = getUserByPhone(phone);

        // Update only allowed fields
        existingUser.setFirstName(updatedUser.getFirstName());
        existingUser.setLastName(updatedUser.getLastName());
        existingUser.setEmail(updatedUser.getEmail());

        // Only update phone if it's changed and not already taken
        if (!phone.equals(updatedUser.getPhone())) {
            if (userRepository.findByPhone(updatedUser.getPhone()).isPresent()) {
                logger.warn("Phone number already taken: {}", updatedUser.getPhone());
                throw new RuntimeException("Phone number already taken");
            }
            existingUser.setPhone(updatedUser.getPhone());
        }

        try {
            User savedUser = userRepository.save(existingUser);
            logger.info("User profile updated successfully for ID: {}", savedUser.getId());
            return savedUser;
        } catch (Exception e) {
            logger.error("Error updating user profile", e);
            throw new RuntimeException("Error updating user profile: " + e.getMessage());
        }
    }

    public void changePassword(String phone, String currentPassword, String newPassword) {
        logger.info("Attempting to change password for user with phone: {}", phone);

        User user = getUserByPhone(phone);

        // Verify current password
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            logger.warn("Invalid current password provided for user: {}", phone);
            throw new BadCredentialsException("Current password is incorrect");
        }

        // Validate new password
        if (newPassword == null || newPassword.length() < 8) {
            logger.warn("Invalid new password provided for user: {}", phone);
            throw new RuntimeException("New password must be at least 8 characters long");
        }

        // Hash and save new password
        user.setPassword(passwordEncoder.encode(newPassword));

        try {
            userRepository.save(user);
            logger.info("Password changed successfully for user: {}", phone);
        } catch (Exception e) {
            logger.error("Error changing password", e);
            throw new RuntimeException("Error changing password: " + e.getMessage());
        }
    }
}
