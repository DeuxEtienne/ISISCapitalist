package isis.aced.ISISCapitalist;

import isis.aced.ISISCapitalist.generated.World;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;
import java.io.*;

public class Services {
    public World readWorldFromXml(String username) throws IOException,JAXBException{
        JAXBContext jc = JAXBContext.newInstance(World.class);
        Unmarshaller u = jc.createUnmarshaller();
        InputStream input;

        if (username != null) {
             input = new FileInputStream(username + "-world.xml");
        } else {
            input = getClass().getClassLoader().getResourceAsStream("world.xml");
        }
        World w = (World) u.unmarshal(input);
        input.close();
        return w;
    }

    public void saveWorldToXml(World world, String username) throws JAXBException,FileNotFoundException {
        Marshaller marsh = JAXBContext.newInstance(World.class).createMarshaller();
        marsh.marshal(world, new FileOutputStream(username + "-world.xml"));
    }

    public World getWorld(String username) throws IOException,JAXBException {
        return readWorldFromXml(username);
    }
}
