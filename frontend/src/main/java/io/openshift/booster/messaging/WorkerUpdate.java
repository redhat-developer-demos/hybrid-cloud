package io.openshift.booster.messaging;

public class WorkerUpdate {

    private final String workerId;
    private final String cloud;
    private long timestamp;
    private long requestsProcessed;

    public WorkerUpdate(String workerId, String cloud, long timestamp, long requestsProcessed) {
        this.workerId = workerId;
        this.cloud = cloud;
        this.timestamp = timestamp;
        this.requestsProcessed = requestsProcessed;
    }

    public void update() {
        this.timestamp = System.currentTimeMillis();
        this.requestsProcessed++;
    }

    public String getWorkerId() {
        return workerId;
    }

    public String getCloud() {
        return cloud;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public long getRequestsProcessed() {
        return requestsProcessed;
    }

    @Override
    public String toString() {
        return String.format("WorkerUpdate{workerId=%s, cloud=%s, timestamp=%s, requestsProcessed=%s}",
                             workerId, cloud, timestamp, requestsProcessed);
    }
    
}