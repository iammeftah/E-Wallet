package wav.hmed.authentication.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import wav.hmed.authentication.entity.Role;
import wav.hmed.authentication.entity.User;
import wav.hmed.authentication.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User createUser(User user) {
        if (userRepository.findByPhone(user.getPhone()).isPresent()) {
            throw new RuntimeException("Phone number already registered");
        }
        // Set default role as ADMIN
        user.setRole(Role.ADMIN);

        // Hash the password using BCryptPasswordEncoder
        user.setPassword(hashPassword(user.getPassword()));

        return userRepository.save(user);
    }

    private String hashPassword(String plainPassword) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        return passwordEncoder.encode(plainPassword);
    }
    // Other methods...
}

