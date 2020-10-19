package io.openshift.booster.messaging;

import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.eclipse.microprofile.rest.client.inject.RestClient;

@Path("/api")
public class FrontendResource {

    private static final String ID = "frontend-quarkus-" + UUID.randomUUID()
                                                .toString().substring(0, 4);

    private final AtomicInteger requestSequence = new AtomicInteger(0);
    private final Data data = new Data();
    
    @RestClient
    BackendService backendService;

    @POST
    @Path("/send-request")
    @Consumes(MediaType.APPLICATION_JSON)
    public javax.ws.rs.core.Response sendRequest(Request request) {

        final String requestId = ID + "/" + requestSequence.incrementAndGet();
        final Message message = new Message(requestId, request);

        this.data.addRequestId(requestId);
        final Response response = this.backendService.sendMessage(message);
        
        this.data.putResponse(requestId, response);
        this.data.updateWorker(response.getWorkerId(), response.getCloudId());
        
        return javax.ws.rs.core.Response.status(202).build();
    }

    @GET
    @Path("/data")
    @Produces(MediaType.APPLICATION_JSON)
    public Data getResponse() {
        return data;
    }

}