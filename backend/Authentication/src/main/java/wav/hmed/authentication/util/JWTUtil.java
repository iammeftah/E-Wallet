package wav.hmed.authentication.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;
import wav.hmed.authentication.entity.User;

import java.util.*;
import java.util.logging.Logger;
import java.util.stream.Collectors;

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
            Map<String, Object> claims = new HashMap<>();

            // Get authorities from user
            Collection<? extends GrantedAuthority> authorities = user.getAuthorities();
            List<String> roles = authorities.stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());

            logger.info("Generating token for user: " + user.getPhone());
            logger.info("User role from entity: " + user.getRole());
            logger.info("User authorities from getAuthorities(): " + authorities);
            logger.info("Roles to be included in token: " + roles);

            claims.put("roles", roles);

            String token = Jwts.builder()
                    .setClaims(claims)
                    .setSubject(user.getPhone())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                    .signWith(SignatureAlgorithm.HS512, secret)
                    .compact();

            // Verify the token immediately after generation
            Claims verificationClaims = extractAllClaims(token);
            logger.info("Verified token claims: " + verificationClaims);
            logger.info("Verified token roles: " + verificationClaims.get("roles"));

            return token;
        } catch (Exception e) {
            logger.severe("Error generating token: " + e.getMessage());
            logger.severe("Stack trace: " + Arrays.toString(e.getStackTrace()));
            throw new RuntimeException("Error generating JWT token", e);
        }
    }

    public String extractPhone(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public List<String> extractRoles(String token) {
        try {
            Claims claims = extractAllClaims(token);

            @SuppressWarnings("unchecked")
            List<String> roles = (List<String>) claims.get("roles");

            if (roles != null && !roles.isEmpty()) {
                logger.info("Extracted roles from token: " + roles);
                return roles;
            } else {
                logger.warning("No roles found in token claims: " + claims);
                return Collections.emptyList();
            }
        } catch (Exception e) {
            logger.severe("Error extracting roles from token: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    private <T> T extractClaim(String token, java.util.function.Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        if (token == null) {
            logger.severe("Received null token");
            throw new IllegalArgumentException("Token cannot be null");
        }

        try {
            String jwtToken = token.startsWith("Bearer ") ? token.substring(7).trim() : token.trim();

            if (!jwtToken.contains(".") || jwtToken.split("\\.").length != 3) {
                logger.severe("Invalid token format. Token: " + jwtToken);
                throw new IllegalArgumentException("Invalid JWT token format");
            }

            return Jwts.parser()
                    .setSigningKey(secret)
                    .parseClaimsJws(jwtToken)
                    .getBody();
        } catch (Exception e) {
            logger.severe("Error extracting claims from token: " + e.getMessage());
            throw new RuntimeException("Error processing JWT token", e);
        }
    }
}