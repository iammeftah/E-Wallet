package wav.hmed.authentication.service;

import org.springframework.beans.factory.annotation.Autowired;
import wav.hmed.authentication.entity.Role;
import wav.hmed.authentication.entity.User;
import wav.hmed.authentication.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User createUser(User user) {
        // Set default role as ADMIN
        user.setRole(Role.ADMIN);

        // Hash the password (you might want to use BCryptPasswordEncoder)
        // user.setPassword(hashPassword(user.getPassword()));

        return userRepository.save(user);
    }

    // Other methods...
}
