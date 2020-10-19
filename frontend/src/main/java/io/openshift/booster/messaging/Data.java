package io.openshift.booster.messaging;

import java.util.Map;
import java.util.Queue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;

public class Data {

    private final Queue<String> requestIds;
    private final Map<String, Response> responses;
    private final Map<String, WorkerUpdate> workers;

    public Data() {
        this.requestIds = new ConcurrentLinkedQueue<>();
        this.responses = new ConcurrentHashMap<>();
        this.workers = new ConcurrentHashMap<>();
    }

    public void updateWorker(String workerId, String cloudId) {
        this.workers.putIfAbsent(workerId, new WorkerUpdate(workerId, cloudId, System.currentTimeMillis(), 0));
        this.workers.get(workerId).update();
    }

    public void putResponse(String requestId, Response response) {
        this.responses.put(requestId, response);
    }

    public void addRequestId(String requestId) {
        getRequestIds().add(requestId);
    }

    public Queue<String> getRequestIds() {
        return requestIds;
    }

    public Map<String, Response> getResponses() {
        return responses;
    }

    public Map<String, WorkerUpdate> getWorkers() {
        return workers;
    }

    @Override
    public String toString() {
        return String.format("Data{requestIds=%s, responses=%s, workers=%s}",
                             requestIds, responses, workers);
    }
    
}