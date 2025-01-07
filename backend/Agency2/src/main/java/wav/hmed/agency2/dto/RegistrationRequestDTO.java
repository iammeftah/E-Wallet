package wav.hmed.agency2.dto;

import org.springframework.web.multipart.MultipartFile;


public class RegistrationRequestDTO {
    private ClientDTO clientData;
    private MultipartFile idDocument;
    private MultipartFile idDocumentBack;
    private MultipartFile incomeProof;

    public ClientDTO getClientData() {
        return clientData;
    }

    public void setClientData(ClientDTO clientData) {
        this.clientData = clientData;
    }

    public MultipartFile getIdDocument() {
        return idDocument;
    }

    public void setIdDocument(MultipartFile idDocument) {
        this.idDocument = idDocument;
    }

    public MultipartFile getIdDocumentBack() {
        return idDocumentBack;
    }

    public void setIdDocumentBack(MultipartFile idDocumentBack) {
        this.idDocumentBack = idDocumentBack;
    }

    public MultipartFile getIncomeProof() {
        return incomeProof;
    }

    public void setIncomeProof(MultipartFile incomeProof) {
        this.incomeProof = incomeProof;
    }

    // This will help convert form data to ClientDTO
    public ClientDTO toClientDTO() {
        ClientDTO dto = new ClientDTO();
        dto.setClientType(clientData.getClientType());
        dto.setFirstName(clientData.getFirstName());
        dto.setLastName(clientData.getLastName());
        dto.setEmail(clientData.getEmail());
        dto.setPhone(clientData.getPhone());
        dto.setIdType(clientData.getIdType());
        dto.setIdNumber(clientData.getIdNumber());
        dto.setStatus("PENDING");
        return dto;
    }
}