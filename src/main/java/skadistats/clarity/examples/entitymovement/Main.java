package skadistats.clarity.examples.entitymovement;

import java.io.*;
import java.util.Hashtable;
import java.util.ArrayList;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import skadistats.clarity.event.Insert;
import skadistats.clarity.model.Entity;
import skadistats.clarity.model.FieldPath;
import skadistats.clarity.processor.runner.Context;
import skadistats.clarity.processor.runner.SimpleRunner;
import skadistats.clarity.processor.entities.Entities;
import skadistats.clarity.processor.entities.OnEntityUpdated;
import skadistats.clarity.source.MappedFileSource;

public class Main {

    private final Logger log = LoggerFactory.getLogger(Main.class.getPackage().getClass());
    
    private BufferedWriter writer;
    private ArrayList<String> heroes;
    private ArrayList< Hashtable<String, int[]> > datapersecond;

    @Insert
    private Context ctx;

    @OnEntityUpdated
    public void onEntityUpdated(Entity e, FieldPath[] fieldPaths, int num) {
        String entityname = e.getDtClass().getDtName();
        Integer tick = ctx.getTick();
        Integer second = tick / 30;
        
        //if entity is a hero and has the location property
        if (e.hasProperty("m_cellX") && entityname.contains("DT_DOTA_Unit_Hero")) {
            String heroname = entityname.substring(18);
            
            //keep a list of heroes in the match
            if (heroes.contains(heroname) != true) {
                heroes.add(heroname);
            }
            
            //Create empty rows for each second, each row will contain location info for each hero, if it exists
            while (second >= datapersecond.size()) {
                Hashtable<String, int[]> temp = new Hashtable<String, int[]>();
                datapersecond.add(temp);
            }
            
            //gather the info and put it in the array
            Integer xpos = e.getProperty("m_cellX");
            Integer ypos = e.getProperty("m_cellY");
            Integer team = e.getProperty("m_iTeamNum");
            Integer hp = e.getProperty("m_iHealth");
            int[] data = new int[]{xpos, ypos, team, hp};
            datapersecond.get(second).put(heroname, data);
        }
    }

    public void run(String[] args) throws Exception {
        writer = new BufferedWriter(new FileWriter("data.csv"));
        heroes = new ArrayList<String>();
        datapersecond = new ArrayList< Hashtable<String, int[]> >();
        
        long tStart = System.currentTimeMillis();
        SimpleRunner r = null;
        try {
            r = new SimpleRunner(new MappedFileSource(args[0])).runWith(this);
        } finally {
            long tMatch = System.currentTimeMillis() - tStart;
            log.info("total time taken: {}s", (tMatch) / 1000.0);
            if (r != null) {
                r.getSource().close();
            }
        }
        
        //At the moment the api only returns data if the entity had a property change, so there are a bunch of "holes" in the data. This here attempts to fill those holes by using previous data.
        Hashtable<String, int[]> prevdata = new Hashtable<String, int[]>();
        
        writer.write("second,hero1,h1x,h1y,h1t,h1hp,hero2,h2x,h2y,h2t,h2hp,hero3,h3x,h3y,h3t,h3hp,hero4,h4x,h4y,h4t,h4hp,hero5,h5x,h5y,h5t,h5hp,hero6,h6x,h6y,h6t,h6hp,hero7,h7x,h7y,h7t,h7hp,hero8,h8x,h8y,h8t,h8hp,hero9,h9x,h9y,h9t,h9hp,hero10,h10x,h10y,h10t,h10hp\n");
        for (int i = 0; i < datapersecond.size(); i++) {
            Hashtable<String, int[]> temp = datapersecond.get(i);
            String line = String.format("%d", i);
            
            for (int j = 0; j < heroes.size(); j++) {
                String hero = heroes.get(j);
                
                int[] data;
                if (temp.get(hero) == null) {
                    if (prevdata.containsKey(hero)) {
                        data = prevdata.get(hero);
                    }
                    else {
                        data = new int[]{0,0,0,0};
                    }
                }
                else {
                    data = temp.get(hero);
                    prevdata.put(hero, data);
                }
                
                line += String.format(",%s,%d,%d,%d,%d", hero, data[0], data[1], data[2], data[3]);
            }
            
            line += "\n";
            writer.write(line);
        }
        
        writer.close();
    }

    public static void main(String[] args) throws Exception {
        new Main().run(args);
    }

}
