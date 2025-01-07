package wav.hmed.authentication.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import wav.hmed.authentication.entity.User;
import wav.hmed.authentication.service.UserService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    @Autowired
    private UserService userService;

    @PostMapping("/create-admin")
    public ResponseEntity<?> createAdminUser(@RequestBody User user) {
        logger.info("Received request to create admin user with phone: {}", user.getPhone());

        try {
            logger.debug("Request body: {}", user.toString());
            User createdUser = userService.createUser(user);
            logger.info("Successfully created admin user with ID: {}", createdUser.getId());
            return ResponseEntity.ok(createdUser);
        } catch (Exception e) {
            logger.error("Error creating admin user", e);
            return ResponseEntity.badRequest().body("Error creating admin user: " + e.getMessage());
        }
    }
}