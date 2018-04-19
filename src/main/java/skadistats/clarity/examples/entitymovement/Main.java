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
    private ArrayList< Hashtable<String, int[]> > locationspersecond;

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
            while (second >= locationspersecond.size()) {
                Hashtable<String, int[]> temp = new Hashtable<String, int[]>();
                locationspersecond.add(temp);
            }
            
            //gather the info and put it in the array
            Integer xpos = e.getProperty("m_cellX");
            Integer ypos = e.getProperty("m_cellY");
            int[] pos = new int[]{xpos, ypos};
            locationspersecond.get(second).put(heroname, pos);
            
            /*
            try {
                writer.write(String.format("%d\t%s\t%d\t%d\n", tick, entityname.substring(18), xpos, ypos));
            } catch (IOException exception) {
                
            }
            */
        }
    }

    public void run(String[] args) throws Exception {
        writer = new BufferedWriter(new FileWriter("output2.txt"));
        heroes = new ArrayList<String>();
        locationspersecond = new ArrayList< Hashtable<String, int[]> >();
        
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
        
        for (int i = 0; i < locationspersecond.size(); i++) {
            Hashtable<String, int[]> temp = locationspersecond.get(i);
            String line = String.format("%d", i);
            
            for (int j = 0; j < heroes.size(); j++) {
                String hero = heroes.get(j);
                int[] pos;
                if (temp.get(hero) == null) {
                    pos = new int[]{0,0};
                }
                else {
                    pos = temp.get(hero);
                }
                line += String.format(",%s,%d,%d", hero, pos[0], pos[1]);
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
