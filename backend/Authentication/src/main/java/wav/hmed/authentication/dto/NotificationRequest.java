package wav.hmed.authentication.dto;


public class NotificationRequest {
    private String userId;
    private String email;
    private String message;

    // Constructor
    public NotificationRequest(String userId, String email, String message) {
        this.userId = userId;
        this.email = email;
        this.message = message;
    }

    // Getters and setters
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}