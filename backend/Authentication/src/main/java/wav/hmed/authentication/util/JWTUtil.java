package wav.hmed.authentication.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import wav.hmed.authentication.entity.User;

import java.util.Date;
import java.util.logging.Logger;

@Component
public class JWTUtil {
    private static final Logger logger = Logger.getLogger(JWTUtil.class.getName());

    @Value("${jwt.secret}")
    private String secret;

    private long expirationTime = 86400000; // 24 hours

    public String generateToken(User user) {
        if (user == null || user.getPhone() == null) {
            throw new IllegalArgumentException("User or phone number cannot be null");
        }

        try {
            String token = Jwts.builder()
                    .setSubject(user.getPhone())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                    .signWith(SignatureAlgorithm.HS512, secret)
                    .compact();

            logger.info("Generated token: " + token);
            return token;
        } catch (Exception e) {
            logger.severe("Error generating token: " + e.getMessage());
            throw new RuntimeException("Error generating JWT token", e);
        }
    }

    public String extractPhone(String token) {
        if (token == null) {
            logger.severe("Received null token");
            throw new IllegalArgumentException("Token cannot be null");
        }

        logger.info("Received token for extraction: " + token);

        try {
            // Remove "Bearer " prefix if present
            String jwtToken = token.startsWith("Bearer ") ? token.substring(7).trim() : token.trim();
            logger.info("Processed JWT token (after Bearer removal): " + jwtToken);

            // Validate token format
            if (!jwtToken.contains(".") || jwtToken.split("\\.").length != 3) {
                logger.severe("Invalid token format. Token: " + jwtToken);
                throw new IllegalArgumentException("Invalid JWT token format - must contain exactly two dots");
            }

            Claims claims = Jwts.parser()
                    .setSigningKey(secret)
                    .parseClaimsJws(jwtToken)
                    .getBody();

            String subject = claims.getSubject();
            logger.info("Successfully extracted subject: " + subject);
            return subject;
        } catch (Exception e) {
            logger.severe("Error extracting phone from token: " + e.getMessage() + ". Token: " + token);
            throw new RuntimeException("Error processing JWT token", e);
        }
    }
}