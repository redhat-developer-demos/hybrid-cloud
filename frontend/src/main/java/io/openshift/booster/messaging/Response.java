package io.openshift.booster.messaging;

public class Response {
    
    private String requestId;
    private String workerId;
    private String cloudId;
    private String text;

    public Response() {
    }

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

    public void setCloudId(String cloudId) {
        this.cloudId = cloudId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public void setText(String text) {
        this.text = text;
    }

    public void setWorkerId(String workerId) {
        this.workerId = workerId;
    }

    @Override
    public String toString() {
        return String.format("Response{requestId=%s, workerId=%s, cloudId=%s, text=%s}",
                             requestId, workerId, cloudId, text);
    }
    
}