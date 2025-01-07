package wav.hmed.authentication.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import wav.hmed.authentication.clients.NotificationClient;
import wav.hmed.authentication.dto.AgentDTO;
import wav.hmed.authentication.entity.Agent;
import wav.hmed.authentication.entity.RegistrationStatus;
import wav.hmed.authentication.entity.Role;
import wav.hmed.authentication.repository.AgentRepository;

import java.util.List;
import java.util.UUID;

@Service
public class AgentService {
    private final AgentRepository agentRepository;
    private final PasswordEncoder passwordEncoder;
    private final NotificationClient notificationClient;

    public AgentService(AgentRepository agentRepository,
                        PasswordEncoder passwordEncoder,
                        NotificationClient notificationClient) {
        this.agentRepository = agentRepository;
        this.passwordEncoder = passwordEncoder;
        this.notificationClient = notificationClient;
    }

    @Transactional
    public Agent registerAgent(Agent agent) {
        agent.setRole(Role.AGENT);
        agent.setStatus(RegistrationStatus.PENDING);

        Agent savedAgent = agentRepository.save(agent);

        // Send notification email for registration
        String subject = "Agent Registration Confirmation";
        String message = String.format("""
            Dear %s %s,
            
            Thank you for registering as an agent. Your registration is currently pending approval.
            We will notify you once your account has been reviewed.
            
            Best regards,
            The System Team
            """,
                agent.getFirstName(),
                agent.getLastName());

        notificationClient.sendEmail(agent.getEmail(), subject, message);

        return savedAgent;
    }

    @Transactional
    public Agent createVerifiedAgent(AgentDTO agentDTO) {
        // Check if email already exists
        if (agentRepository.findByEmail(agentDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        Agent agent = new Agent();

        // Map DTO fields to entity
        agent.setFirstName(agentDTO.getFirstName());
        agent.setLastName(agentDTO.getLastName());
        agent.setEmail(agentDTO.getEmail());
        agent.setPhone(agentDTO.getPhone());
        agent.setIdType(agentDTO.getIdType());
        agent.setIdNumber(agentDTO.getIdNumber());
        agent.setBirthdate(agentDTO.getBirthdate());
        agent.setAddress(agentDTO.getAddress());
        agent.setImmatriculation(agentDTO.getImmatriculation());
        agent.setPatentNumber(agentDTO.getPatentNumber());

        // Set verified status and role
        agent.setStatus(RegistrationStatus.ACCEPTED);
        agent.setRole(Role.AGENT);

        // Generate a temporary password
        String tempPassword = generateTemporaryPassword();
        agent.setPassword(passwordEncoder.encode(tempPassword));



        // Send welcome email with temporary password
        String subject = "Welcome - Your Account Details";
        String message = String.format("""
            Dear %s %s,
            
            Your agent account has been created successfully. Please use the following temporary password to log in:
            
            Temporary Password: %s
            
            Important Security Instructions:
            1. Please change your password immediately after your first login
            2. Choose a strong password that you haven't used elsewhere
            3. Keep your login credentials confidential
            
            Login URL: [Your System URL]
            
            If you have any questions or need assistance, please contact our support team.
            
            Best regards,
            The System Team
            """,
                agent.getFirstName(),
                agent.getLastName(),
                tempPassword);

        notificationClient.sendEmail(agent.getEmail(), subject, message);

        // Save the agent


        return agentRepository.save(agent);
    }

    @Transactional
    public Agent updateStatus(Long agentId, RegistrationStatus status) {
        Agent agent = agentRepository.findById(agentId)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        agent.setStatus(status);
        Agent updatedAgent = agentRepository.save(agent);

        // Send status update notification
        String subject = "Agent Status Update";
        String message = String.format("""
            Dear %s %s,
            
            Your agent account status has been updated to: %s
            
            %s
            
            Best regards,
            The System Team
            """,
                agent.getFirstName(),
                agent.getLastName(),
                status,
                getStatusMessage(status));

        notificationClient.sendEmail(agent.getEmail(), subject, message);

        return updatedAgent;
    }

    private String getStatusMessage(RegistrationStatus status) {
        return switch (status) {
            case ACCEPTED -> "Congratulations! Your account has been approved. You can now log in to the system.";
            case DECLINED -> "Unfortunately, your account application has been rejected. Please contact support for more information.";
            case PENDING -> "Your account is under review. We will notify you once the review is complete.";
        };
    }

    private String generateTemporaryPassword() {
        // Generate a random 8-character password
        return UUID.randomUUID().toString().substring(0, 8);
    }

    public List<Agent> getAllAgents() {
        return agentRepository.findAll();
    }

    public Agent getAgentById(Long id) {
        return agentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agent not found"));
    }

    public List<Agent> getAgentsByStatus(RegistrationStatus status) {
        return agentRepository.findByStatus(status);
    }
}