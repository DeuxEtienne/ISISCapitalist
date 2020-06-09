package isis.aced.ISISCapitalist;

import isis.aced.ISISCapitalist.generated.PallierType;
import isis.aced.ISISCapitalist.generated.ProductType;
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
        File f;

        if (username != null) {
            f = new File(username + "-world.xml");
            if (f.exists()){
                input = new FileInputStream(f);
            } else {
                input = getClass().getClassLoader().getResourceAsStream("world.xml");
            }
        } else {
            input = getClass().getClassLoader().getResourceAsStream("world.xml");
        }

        World w = (World) u.unmarshal(input);
        input.close();
        return w;
    }

    public void saveWorldToXml(World world, String username) throws JAXBException,IOException {
        Marshaller marsh = JAXBContext.newInstance(World.class).createMarshaller();
        FileOutputStream fos = new FileOutputStream(username + "-world.xml");
        marsh.marshal(world, fos);
        fos.close();
    }

    public World getWorld(String username) throws IOException,JAXBException {
        return readWorldFromXml(username);
    }

    public Boolean updateProduct(String username, ProductType newProduct) throws IOException,JAXBException {
        World world = getWorld(username);
        ProductType product = world.getProducts().getProduct(newProduct.getId());
        if(product ==null){ return false;}

        int qtchange = newProduct.getQuantite() - product.getQuantite();
        if(qtchange >0){
            //TODO: Changer la quantité de produit et soustraire l'argent du joueur
        }
        else {
            //TODO: Initialiser le product.timeleft et lancer la production d'un objet
        }
        saveWorldToXml(world,username);
        return true;

    }

    public Boolean updateManager(String username, PallierType newManager) throws IOException,JAXBException{
        World world = getWorld(username);
        PallierType manager = world.getManagers().getPallier(newManager.getName());
        if(manager == null) return false;
        ProductType product = world.getProducts().getProduct(manager.getIdcible());
        if(product == null) return false;

        //TODO: Effectuer l'achat du manager

        saveWorldToXml(world,username);
        return true;
    }
}
