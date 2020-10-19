package io.openshift.booster.messaging;

public class Message {

    private String requestId;
    private Request request;

    public Message(){
    }

    public Message(String requestId, Request request) {
        this.request = request;
        this.requestId = requestId;
    }

    public Request getRequest() {
        return request;
    }
    
    public String getRequestId() {
        return requestId;
    }

    public void setRequest(Request request) {
        this.request = request;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

}