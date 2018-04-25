package skadistats.clarity.examples.entitymovement;

import java.io.*;
import java.util.Arrays;
import java.util.Hashtable;
import java.util.ArrayList;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import skadistats.clarity.event.Insert;
import skadistats.clarity.model.Entity;
import skadistats.clarity.model.FieldPath;
import skadistats.clarity.processor.runner.Context;
import skadistats.clarity.processor.runner.SimpleRunner;
import skadistats.clarity.processor.runner.ControllableRunner;
import skadistats.clarity.processor.entities.Entities;
import skadistats.clarity.processor.entities.OnEntityUpdated;
import skadistats.clarity.source.MappedFileSource;

public class Main {
    private Hashtable<Integer, String> listofheroes = new Hashtable<Integer, String>();
    
    private void setup() {
        listofheroes.put(5, "CrystalMaiden");
        listofheroes.put(14, "Pudge");
        listofheroes.put(26, "Lion");
        listofheroes.put(43, "DeathProphet");
        listofheroes.put(51, "Rattletrap");
        listofheroes.put(53, "Furion");
        listofheroes.put(59, "Huskar");
        listofheroes.put(71, "SpiritBreaker");
        listofheroes.put(97, "Magnataur");
        listofheroes.put(112, "Winter_Wyvern");
    }

    private final Logger log = LoggerFactory.getLogger(Main.class.getPackage().getClass());
    private ControllableRunner r;
    
    private ArrayList<String> players;
    private ArrayList<String> heroes;
    private ArrayList< Hashtable<String, int[]> > datapersecond;

    @Insert
    private Context ctx;
    
    private Entity getEntity(String entityName) {
        return r.getContext().getProcessor(Entities.class).getByDtName(getEngineDependentEntityName(entityName));
    }
    
    private String getEngineDependentEntityName(String entityName) {
        switch (r.getEngineType()) {
            case SOURCE1:
                return "DT_DOTA_" + entityName;
            case SOURCE2:
                return "CDOTA_" + entityName;
            default:
                throw new RuntimeException("invalid engine type");
        }
    }

    @OnEntityUpdated
    public void onEntityUpdated(Entity e, FieldPath[] fieldPaths, int num) {}
    
    private void updatestats(Integer tick) {
        if (r.getContext() == null) {
            return;
        }
        
        Integer second = tick / 30;
        Entity playerresource = r.getContext().getProcessor(Entities.class).getByDtName(getEngineDependentEntityName("PlayerResource"));
        
        //Create empty rows for each second, each row will contain location info for each hero, if it exists
        while (second >= datapersecond.size()) {
            Hashtable<String, int[]> temp = new Hashtable<String, int[]>();
            datapersecond.add(temp);
        }
        
        for (int i = 0; i < 10; i++) {
            //keep a list of players in the match
            String playername = playerresource.getProperty("m_iszPlayerNames.000" + i);
            if (players.contains(playername) != true) {
                players.add(playername);
            }
            
            //gather player info
            Integer heroid = playerresource.getProperty("m_nSelectedHeroID.000" + i);
            Integer team = playerresource.getProperty("m_iPlayerTeams.000" + i);
            Integer kills = playerresource.getProperty("m_iKills.000" + i);
            Integer assists = playerresource.getProperty("m_iAssists.000" + i);
            Integer deaths = playerresource.getProperty("m_iDeaths.000" + i);
            Integer respawnseconds = playerresource.getProperty("m_iRespawnSeconds.000" + i);
            Integer totalgold = (Integer)(playerresource.getProperty("m_iHeroKillGold.000" + i)) + (Integer)(playerresource.getProperty("m_iCreepKillGold.000" + i)) + (Integer)(playerresource.getProperty("m_iIncomeGold.000" + i));
            Integer lasthits = playerresource.getProperty("m_iLastHitCount.000" + i);
            Integer denies = playerresource.getProperty("m_iDenyCount.000" + i);
            
            String heroname = listofheroes.get(heroid);
            Entity hero = r.getContext().getProcessor(Entities.class).getByDtName(getEngineDependentEntityName("Unit_Hero_" + heroname));
            
            //keep a list of heroes in the match
            if (heroes.contains(heroname) != true) {
                heroes.add(heroname);
            }
            
            Integer xpos = -1;
            Integer ypos = -1;
            Integer hp = -1;
            
            if (hero != null) {
                //gather hero info
                xpos = hero.getProperty("m_cellX");
                ypos = hero.getProperty("m_cellY");
                hp = hero.getProperty("m_iHealth");
            }
            
            //put the info in the array
            int[] data = new int[]{heroid, team, kills, deaths, assists, lasthits, denies, respawnseconds, totalgold, xpos, ypos, hp};
            datapersecond.get(second).put(playername, data);
        }
    }
    
    private ArrayList<String> values = new ArrayList<String>(Arrays.asList(new String[]{"hn", "t", "k", "d", "a", "lh", "dn", "rs", "nw", "x", "y", "hp"}));

    public void run(String[] args) throws Exception {
        heroes = new ArrayList<String>();
        players = new ArrayList<String>();
        datapersecond = new ArrayList< Hashtable<String, int[]> >();
        setup();
        
        long tStart = System.currentTimeMillis();
        r = null;
        try {
            r = new ControllableRunner(new MappedFileSource(args[0])).runWith(this);
            Integer currenttick = 0;
            while (!r.isAtEnd()) {
                updatestats(currenttick);
                currenttick += 30;
                r.seek(currenttick);
            }
        } finally {
            long tMatch = System.currentTimeMillis() - tStart;
            log.info("total time taken: {}s", (tMatch) / 1000.0);
            if (r != null) {
                r.getSource().close();
            }
        }
        
        BufferedWriter writer = new BufferedWriter(new FileWriter("playerdata.csv"));
        writer.write("second");
        for (int i = 0; i < 10; i++) {
            writer.write(",p" + i + "pn");
            for (int j = 0; j < values.size(); j++) {
                writer.write(",p" + i + values.get(j));
            }
        }
        writer.write("\n");
        
        for (int i = 0; i < datapersecond.size(); i++) {
            Hashtable<String, int[]> temp = datapersecond.get(i);
            String line = String.format("%d", i);
            
            for (int j = 0; j < 10; j++) {
                String playername = players.get(j);
                
                int[] data = temp.get(playername);
                if (data == null) continue;
                
                line += "," + playername;
                line += "," + listofheroes.get(data[0]);
                
                for (int k = 1; k < values.size(); k++) {
                    line += "," + data[k];
                }
            }
            
            line += "\n";
            writer.write(line);
        }
        writer.close();
        return;
    }

    public static void main(String[] args) throws Exception {
        new Main().run(args);
    }

}
