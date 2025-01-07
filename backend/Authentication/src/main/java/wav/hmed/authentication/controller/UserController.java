package wav.hmed.authentication.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import wav.hmed.authentication.entity.User;
import wav.hmed.authentication.service.UserService;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfile(Authentication authentication) {
        String phone = authentication.getName();
        User user = userService.getUserByPhone(phone);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateUserProfile(@RequestBody User updatedUser, Authentication authentication) {
        String phone = authentication.getName();
        User updatedUserProfile = userService.updateUser(phone, updatedUser);
        return ResponseEntity.ok(updatedUserProfile);
    }

    @PutMapping("/profile/password")
    public ResponseEntity<Void> changePassword(
            @RequestBody Map<String, String> passwordData,
            Authentication authentication) {
        String phone = authentication.getName();
        String currentPassword = passwordData.get("currentPassword");
        String newPassword = passwordData.get("newPassword");

        userService.changePassword(phone, currentPassword, newPassword);
        return ResponseEntity.ok().build();
    }
}
