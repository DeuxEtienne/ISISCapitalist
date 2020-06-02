package isis.aced.ISISCapitalist;

import org.glassfish.jersey.server.ResourceConfig;
import org.springframework.stereotype.Component;

import javax.ws.rs.ApplicationPath;

@Component
@ApplicationPath("/isiscapitalist")
public class JerseyConfig extends ResourceConfig {
    public JerseyConfig() {
        register(Webservice.class);
        register(CORSResponseFilter.class);
    }
}
