package wav.hmed.bank.entity;

import java.math.BigDecimal;

public enum SubscriptionPlan {
    HSSAB1(new BigDecimal("200.00")),
    HSSAB2(new BigDecimal("1000.00")),
    HSSAB3(new BigDecimal("10000.00"));

    private final BigDecimal transactionCeiling;

    SubscriptionPlan(BigDecimal transactionCeiling) {
        this.transactionCeiling = transactionCeiling;
    }

    public BigDecimal getTransactionCeiling() {
        return transactionCeiling;
    }

    public boolean isTransactionAllowed(BigDecimal amount) {
        return amount.compareTo(transactionCeiling) <= 0;
    }
}
