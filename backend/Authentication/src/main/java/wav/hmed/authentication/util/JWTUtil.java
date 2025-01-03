package wav.hmed.authentication.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;
import wav.hmed.authentication.entity.User;

import java.util.Date;

@Component
public class JWTUtil {
    private String secret = "/lKPMmCX6G8gHY2Wlou6kXl12F53qyr8kmrAeltIHzbOvnhcA+r1cIxjpiBcy9vRHM8uJUxpIj9hIdW+QcojBw==\n";
    private long expirationTime = 86400000; // 24 hours

    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getPhone())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

    public String extractPhone(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }
}