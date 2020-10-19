package io.openshift.booster.messaging;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.containsString;

@QuarkusTest
public class WorkerResourceTest {

    @Test
    public void shouldReturnWelcomeMessage() {
        given()
          .body("{\"requestId\" : 1337,\"request\" :{\"text\":\"foo\",\"uppercase\" : false,\"reverse\" : false }}")
          .contentType("application/json")
          .when().post("/api/process")
          .then()
             .statusCode(200)
             .body(containsString("Aloha foo"));
    }

    @Test
    public void shouldReturnWelcomeUppercaseMessage() {
        given()
          .body("{\"requestId\" : 1337,\"request\" :{\"text\":\"foo\",\"uppercase\" : true,\"reverse\" : false }}")
          .contentType("application/json")
          .when().post("/api/process")
          .then()
             .statusCode(200)
             .body(containsString("Aloha FOO"));
    }

    @Test
    public void shouldReturnWelcomeReversedMessage() {
        given()
          .body("{\"requestId\" : 1337,\"request\" :{\"text\":\"foo\",\"uppercase\" : false,\"reverse\" : true }}")
          .contentType("application/json")
          .when().post("/api/process")
          .then()
             .statusCode(200)
             .body(containsString("Aloha oof"));
    }

}