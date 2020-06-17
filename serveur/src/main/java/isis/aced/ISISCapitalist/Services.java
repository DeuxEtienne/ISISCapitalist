package isis.aced.ISISCapitalist;

import isis.aced.ISISCapitalist.generated.PallierType;
import isis.aced.ISISCapitalist.generated.ProductType;
import isis.aced.ISISCapitalist.generated.ProductsType;
import isis.aced.ISISCapitalist.generated.World;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;
import java.io.*;
import java.util.List;

public class Services {
    public World readWorldFromXml(String username) throws IOException, JAXBException {
        JAXBContext jc = JAXBContext.newInstance(World.class);
        Unmarshaller u = jc.createUnmarshaller();
        InputStream input;
        File f;
        if (username != null) {
            f = new File(username + "-world.xml");
            if (f.exists()) {
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

    public void saveWorldToXml(World world, String username) throws JAXBException, IOException, IllegalArgumentException {
        if (username == null) throw new IllegalArgumentException("Nom de l'utilisateur null");
        Marshaller marsh = JAXBContext.newInstance(World.class).createMarshaller();
        FileOutputStream fos = new FileOutputStream(username + "-world.xml");
        marsh.marshal(world, fos);
        fos.close();
    }

    public World getWorld(String username) throws IOException, JAXBException, IllegalArgumentException {
        World world = readWorldFromXml(username);
        if (world.getLastupdate() != 0) {
            calcProduction(world);
            world.setLastupdate(System.currentTimeMillis());
        } else {
            world.setLastupdate(System.currentTimeMillis());
        }
        saveWorldToXml(world, username);
        return world;
    }

    public Boolean updateProduct(String username, ProductType newProduct) throws IOException, JAXBException {
        World world = getWorld(username);
        ProductType product = world.getProducts().getProduct(newProduct.getId());

        if (product == null || newProduct.getQuantite() < 0) {
            return false;
        }
        int qtchange = newProduct.getQuantite() - product.getQuantite();
        if (qtchange > 0) {
            // Coût total de l'achat des produits de l'utilisateur
            double totalAchat = product.getCout() * (1 - Math.pow(product.getCroissance(), qtchange)) / (1 - product.getCroissance());

            // On vérifie si le joueur possède bien suffisament d'argent pour effectuer l'achat
            if (totalAchat > world.getMoney()) return false;

            world.setMoney(world.getMoney() - totalAchat);
            product.setQuantite(newProduct.getQuantite());

            // Application des unlocks du produit
            for (PallierType p : product.getPalliers().getPallier()) {
                if (!p.isUnlocked()) this.calcUpgrade(p, product);
            }

            // Recherche du débloquage de unlocks globaux
            List<ProductType> products = world.getProducts().getProduct();
            int qttMini = products.get(0).getQuantite();
            for (ProductType p: products) {
                if (p.getQuantite() < qttMini) qttMini = p.getQuantite();
            }
            for (PallierType pallier: world.getAllunlocks().getPallier()) {
                if (!pallier.isUnlocked() && pallier.getSeuil()<qttMini)
                    calcUpgrade(pallier, product);
            }
        } else {
            // Met en production un produit
            if (product.getTimeleft() <= 0) product.setTimeleft(product.getVitesse());
        }

        saveWorldToXml(world, username);
        return true;
    }

    public Boolean updateManager(String username, PallierType newManager) throws IOException, JAXBException {
        World world = getWorld(username);
        PallierType manager = world.getManagers().getPallier(newManager.getName());
        if (manager == null) return false;
        ProductType product = world.getProducts().getProduct(manager.getIdcible());
        if (product == null) return false;

        // On vérifie la capacité d'achat de l'utilisateur puis on effectue l'achat
        if (manager.getSeuil() > world.getMoney()) return false;
        world.setMoney(world.getMoney() - manager.getSeuil());

        // Débloquage du manager pour le produit donné
        manager.setUnlocked(true);
        product.setManagerUnlocked(true);

        saveWorldToXml(world, username);
        return true;
    }

    public Boolean updateUpgrade(String username, PallierType newUpgrade) throws IOException, JAXBException {
        World world = getWorld(username);
        PallierType upgrade = world.getUpgrades().getPallier(newUpgrade.getName());
        if (upgrade == null) return false;
        if (upgrade.isUnlocked()) return false;
        ProductType product = world.getProducts().getProduct(upgrade.getIdcible());
        if (product == null) return false;

        // On vérifie la capacité d'achat de l'utilisateur puis on effectue l'achat
        if (upgrade.getSeuil() > world.getMoney()) return false;
        world.setMoney(world.getMoney() - upgrade.getSeuil());
        switch (upgrade.getTyperatio().value()) {
            case "gain":
                product.setRevenu(product.getRevenu()*upgrade.getRatio());
                break;
            case "vitesse":
                product.setVitesse((int) (product.getVitesse()/upgrade.getRatio()));
                product.setTimeleft((int) (product.getTimeleft()/upgrade.getRatio()));
                break;
            case "ange":
                return false;
            default:
                return false;
        }
        upgrade.setUnlocked(true);

        saveWorldToXml(world, username);
        return true;
    }

    private void calcProduction(World w) {
        long timeSinseUpdate = System.currentTimeMillis() - w.getLastupdate();

        for (ProductType p : w.getProducts().getProduct()) {
            int qttProduite;
            if (p.isManagerUnlocked()) {
                qttProduite = (int) ((timeSinseUpdate - p.getTimeleft() + p.getVitesse()) / p.getVitesse());
                if (qttProduite == 0) {
                    p.setTimeleft(p.getTimeleft() - timeSinseUpdate);
                } else {
                    p.setTimeleft((timeSinseUpdate - p.getTimeleft()) % p.getVitesse());
                }

            } else {
                qttProduite = 0;
                if (p.getTimeleft() == 0) {
                } else if (p.getTimeleft() < timeSinseUpdate) {
                    qttProduite = 1;
                    p.setTimeleft(0);
                } else {
                    p.setTimeleft(p.getTimeleft() - timeSinseUpdate);
                }
            }
            double revenus = qttProduite * p.getQuantite() * p.getRevenu();
            revenus += revenus * (w.getActiveangels() * w.getAngelbonus() / 100);
            w.setMoney(w.getMoney() + revenus);
        }
    }

    private void calcUpgrade(PallierType p, ProductType product) {
        if (p.getSeuil() <= product.getQuantite()) {
            switch (p.getTyperatio().value()) {
                case "vitesse":
                    product.setVitesse((int) (product.getVitesse() / p.getRatio()));
                    product.setTimeleft((int) (product.getTimeleft() / p.getRatio()));
                    break;
                case "gain":
                    product.setRevenu(product.getRevenu() * p.getRatio());
                    break;
            }
            p.setUnlocked(true);
        }
    }
}
