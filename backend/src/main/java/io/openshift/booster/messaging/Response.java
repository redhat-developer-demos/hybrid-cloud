package io.openshift.booster.messaging;

public class Response {
    
    private final String requestId;
    private final String workerId;
    private final String cloudId;
    private final String text;

    public Response(String requestId, String workerId, String cloudId, String text) {
        this.requestId = requestId;
        this.workerId = workerId;
        this.cloudId = cloudId;
        this.text = text;
    }

    public String getRequestId() {
        return requestId;
    }

    public String getWorkerId() {
        return workerId;
    }

    public String getText() {
        return text;
    }

    public String getCloudId() {
        return cloudId;
    }

    @Override
    public String toString() {
        return String.format("Response{requestId=%s, workerId=%s, cloudId=%s, text=%s}",
                             requestId, workerId, cloudId, text);
    }
    
}