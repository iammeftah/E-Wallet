package wav.hmed.bank.dto;

import lombok.Data;
import wav.hmed.bank.entity.SubscriptionPlan;


public class SubscriptionUpgradeRequest {
    private SubscriptionPlan newPlan;

    public SubscriptionPlan getNewPlan() {
        return newPlan;
    }

    public void setNewPlan(SubscriptionPlan newPlan) {
        this.newPlan = newPlan;
    }
}