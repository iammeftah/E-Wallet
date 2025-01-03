package wav.hmed.authentication.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import wav.hmed.authentication.entity.User;
import wav.hmed.authentication.service.UserService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    /*
    * curl -X POST 'http://localhost:8090/api/admin/create-admin' \
     -H "Content-Type: application/json" \
     -d '{"firstName":"Hmed","lastName":"Reda","email":"john@example.com","phone":"0707641333","role":"ADMIN","password":"meftah"}'
    * */

    @PostMapping("/create-admin")
    public ResponseEntity<?> createAdminUser(@RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            return ResponseEntity.ok("Admin user created successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating admin user: " + e.getMessage());
        }
    }

}
