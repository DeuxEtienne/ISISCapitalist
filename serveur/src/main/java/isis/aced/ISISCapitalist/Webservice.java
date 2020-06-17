package isis.aced.ISISCapitalist;

import isis.aced.ISISCapitalist.generated.PallierType;
import isis.aced.ISISCapitalist.generated.ProductType;
import org.springframework.web.bind.annotation.RequestBody;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.xml.bind.JAXBException;
import java.io.IOException;

@Path("generic")
public class Webservice {
    Services services;
    public Webservice() {
        services = new Services();
    }

    @GET
    @Path("world")
    @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public Response getWorld(@Context HttpServletRequest request) {
        String username = request.getHeader("X-User");
        try {
            return Response.ok(services.getWorld(username)).build();
        } catch (IOException | JAXBException ex) {
            ex.printStackTrace();
            return Response.serverError().build();
        }
    }

    @PUT
    @Path("product")
    @Consumes({org.springframework.http.MediaType.APPLICATION_XML_VALUE, org.springframework.http.MediaType.APPLICATION_JSON_VALUE})
    public Response putProduct(@Context HttpServletRequest request, @RequestBody ProductType product) {
        String username = request.getHeader("X-User");

        if (username == null || username=="") return Response.serverError().build();

        try {
            if (services.updateProduct(username, product)){
                return Response.ok(services.getWorld(username)).build();
            } else {
                return Response.serverError().build();
            }
        } catch (IOException | JAXBException ex) {
            return Response.serverError().build();
        }
    }

    @PUT
    @Path("manager")
    @Consumes({org.springframework.http.MediaType.APPLICATION_XML_VALUE, org.springframework.http.MediaType.APPLICATION_JSON_VALUE})
    public Response putManager(@Context HttpServletRequest request, @RequestBody PallierType manager) {

        String username = request.getHeader("X-User");

        if (username == null || username == "") return Response.serverError().build();

        try {
            if (services.updateManager(username, manager)){
                return Response.ok(services.getWorld(username)).build();
            } else {
                return Response.serverError().build();
            }
        } catch (IOException | JAXBException ex) {
            ex.printStackTrace();
            return Response.serverError().build();
        }
    }

    @PUT
    @Path("upgrade")
    @Consumes({org.springframework.http.MediaType.APPLICATION_XML_VALUE, org.springframework.http.MediaType.APPLICATION_JSON_VALUE})
    public Response putUpgrade(@Context HttpServletRequest request, @RequestBody PallierType upgrade) {

        String username = request.getHeader("X-User");

        if (username == null || username == "") return Response.serverError().build();

        try {
            if (services.updateUpgrade(username, upgrade)){
                return Response.ok(services.getWorld(username)).build();
            } else {
                return Response.serverError().build();
            }
        } catch (IOException | JAXBException ex) {
            ex.printStackTrace();
            return Response.serverError().build();
        }
    }
}
