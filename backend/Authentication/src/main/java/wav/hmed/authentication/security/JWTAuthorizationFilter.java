package wav.hmed.authentication.security;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import wav.hmed.authentication.util.JWTUtil;

import java.io.IOException;
import java.util.ArrayList;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

public class JWTAuthorizationFilter extends BasicAuthenticationFilter {
    private final JWTUtil jwtUtil;

    public JWTAuthorizationFilter(AuthenticationManager authManager, JWTUtil jwtUtil) {  // Add JWTUtil parameter
        super(authManager);
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req,
                                    HttpServletResponse res,
                                    FilterChain chain) throws IOException, ServletException {
        String header = req.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            chain.doFilter(req, res);
            return;
        }

        try {
            UsernamePasswordAuthenticationToken authentication = getAuthentication(req);
            if (authentication != null) {
                // Add this debug logging
                System.out.println("Token subject: " + jwtUtil.extractPhone(header.replace("Bearer ", "")));
                System.out.println("Token roles: " + jwtUtil.extractRoles(header.replace("Bearer ", "")));
                System.out.println("Authentication authorities: " + authentication.getAuthorities());

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
            chain.doFilter(req, res);
        } catch (Exception e) {
            System.out.println("Error processing JWT: " + e.getMessage());
            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            res.getWriter().write("Invalid token: " + e.getMessage());
        }
    }


    private UsernamePasswordAuthenticationToken getAuthentication(HttpServletRequest request) {
        String token = request.getHeader("Authorization").replace("Bearer ", "");

        if (token != null) {
            String username = jwtUtil.extractPhone(token);
            List<String> roles = jwtUtil.extractRoles(token);

            if (username != null) {
                List<SimpleGrantedAuthority> authorities = roles.stream()
                        .map(role -> role.startsWith("ROLE_")
                                ? new SimpleGrantedAuthority(role)
                                : new SimpleGrantedAuthority("ROLE_" + role))
                        .collect(Collectors.toList());

                return new UsernamePasswordAuthenticationToken(username, null, authorities);
            }
            return null;
        }
        return null;
    }
}