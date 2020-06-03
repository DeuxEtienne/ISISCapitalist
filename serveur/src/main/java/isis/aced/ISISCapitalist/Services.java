package isis.aced.ISISCapitalist;

import isis.aced.ISISCapitalist.generated.World;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;
import java.io.*;

public class Services {
    public World readWorldFromXml() throws JAXBException {
        InputStream input = getClass().getClassLoader().getResourceAsStream("world.xml");
        JAXBContext jc = JAXBContext.newInstance(World.class);
        Unmarshaller u = jc.createUnmarshaller();
        return (World) u.unmarshal(input);
    }

    public void saveWorldToXml(World world) throws JAXBException, FileNotFoundException {
        Marshaller marsh = JAXBContext.newInstance(World.class).createMarshaller();
        marsh.marshal(world, new FileOutputStream("world.xml"));
    }

    public World getWorld() throws JAXBException{
        return readWorldFromXml();
    }
}
