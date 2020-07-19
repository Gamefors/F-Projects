package de.gmf.lego;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.util.Log;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.gridlayout.widget.GridLayout;

import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.SearchView;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class MainActivity extends AppCompatActivity {
    int baseLeftMarginForKBox = 7;
    int baseTopMarginForKBox = 1090;

    int baseLeftMarginForGBox = 9;
    int baseTopMarginForGBox = 1551;

    private Boolean inShelfView = false;
    Button redIdentifier = null;
    ScrollView sV = null;
    SearchView seaV = null;
    JSONArray legos = null;
    GridLayout gL = null;
    ImageView wandImage = null;

    private LinearLayout createLegoLayout(final String box, String pictureName, String text, final String x, final String y, final ScrollView scrollView, final GridLayout gridLayout, final SearchView searchView){
        LinearLayout legoLayout = new LinearLayout(this);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        params.width = 400;
        params.setMargins(90,55,0,0);
        legoLayout.setLayoutParams(params);
        legoLayout.setOrientation(LinearLayout.VERTICAL);
        ImageView legoImage = new ImageView(this);
        legoImage.setBackgroundResource(R.drawable.ic_launcher_background);
        TextView legoText = new TextView(this);
        legoImage.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View view){
                scrollView.setVisibility(View.INVISIBLE);
                redIdentifier.setVisibility(View.VISIBLE);
                wandImage.setVisibility(View.VISIBLE);
                int kXOffset = 34;
                int kYOffset = 25;

                int gXOffset = 67;
                int gYOffset = 33;

                if(Integer.parseInt(x) > 2){
                    gXOffset = gXOffset + 5;
                }

                if(Integer.parseInt(y) > 2){
                    gYOffset = gYOffset + 5;
                }

                if(Integer.parseInt(x) > 5){
                    kXOffset = kXOffset + 2;
                }

                if(Integer.parseInt(y) > 4){
                    kYOffset = kYOffset + 2;
                }


                ConstraintLayout.LayoutParams p = (ConstraintLayout.LayoutParams) redIdentifier.getLayoutParams();
                if(box.equals("g")){
                    p.setMargins(baseLeftMarginForGBox + (gXOffset * Integer.parseInt(x)), baseTopMarginForGBox- (gYOffset * Integer.parseInt(y)), 0, 0);
                }else{
                    p.setMargins(baseLeftMarginForKBox  + (kXOffset * Integer.parseInt(x)), baseTopMarginForKBox - (kYOffset * Integer.parseInt(y)), 0, 0);
                }

                redIdentifier.setLayoutParams(p);

                inShelfView = true;
            }
        });
        legoText.setText(text);
        legoLayout.addView(legoImage);
        legoLayout.addView(legoText);
        return legoLayout;
    }

    @Override
    public void onBackPressed() {
        if(inShelfView){
            redIdentifier.setVisibility(View.INVISIBLE);
            wandImage.setVisibility(View.INVISIBLE);
            sV.setVisibility(View.VISIBLE);
            inShelfView = false;

        }
    }

    private void readData(GridLayout gridLayout, ScrollView scrollView, SearchView searchView) throws JSONException {


        String data = "[{\"box\": \"k\", \"pictureName\": \"1.png\", \"text\": \"Brick 1x1x5 2453\", \"x\": 0, \"y\": 29}, {\"box\": \"k\", \"pictureName\": \"2.png\", \"text\": \"Support 1x1x6 Solid Pillar 43888\", \"x\": 1, \"y\": 29}, {\"box\": \"k\", \"pictureName\": \"3.png\", \"text\": \"Brick 1x2x2 3245b\", \"x\": 2, \"y\": 29}, {\"box\": \"k\", \"pictureName\": \"5.png\", \"text\": \"Brick 2x2x3 30145\", \"x\": 4, \"y\": 29}, {\"box\": \"k\", \"pictureName\": \"6.png\", \"text\": \"Brick 2x4x3 30144\", \"x\": 5, \"y\": 29}, {\"box\": \"k\", \"pictureName\": \"7.png\", \"text\": \"Plate 3x3 Cross 15397\", \"x\": 0, \"y\": 28}, {\"box\": \"k\", \"pictureName\": \"8.png\", \"text\": \"Platze, Modified 4x4 with 2x2 Cutout 64799\", \"x\": 1, \"y\": 28}, {\"box\": \"k\", \"pictureName\": \"9.png\", \"text\": \"Plate, Modified 1x4 with 2 Studs 92593\", \"x\": 2, \"y\": 28}, {\"box\": \"k\", \"pictureName\": \"10.png\", \"text\": \"Tile, Modified 2x2 with Studs on Edge\", \"x\": 3, \"y\": 28}, {\"box\": \"k\", \"pictureName\": \"11.png\", \"text\": \"Tile 2x4 87079\", \"x\": 4, \"y\": 28}, {\"box\": \"k\", \"pictureName\": \"12.png\", \"text\": \"Tile, Modified 2x2 Inverted 11203\", \"x\": 5, \"y\": 28}, {\"box\": \"k\", \"pictureName\": \"13.png\", \"text\": \"Brick, Modified 1x2 with Groove 4216\", \"x\": 0, \"y\": 27}, {\"box\": \"k\", \"pictureName\": \"14.png\", \"text\": \"Brick, Modified 1x2x5 with Groove \", \"x\": 1, \"y\": 27}, {\"box\": \"k\", \"pictureName\": \"15.png\", \"text\": \"Brick, Modified 1x2 with Masonry Profile (Brick Profile) 98283\", \"x\": 2, \"y\": 27}, {\"box\": \"k\", \"pictureName\": \"16.png\", \"text\": \"Brick, Modified 1x4 with Masonry Profile (Brick Profile) 15533\", \"x\": 3, \"y\": 27}, {\"box\": \"k\", \"pictureName\": \"17.png\", \"text\": \"Brick, Modified 1x4 Log 30137\", \"x\": 4, \"y\": 27}, {\"box\": \"k\", \"pictureName\": \"17.png\", \"text\": \"Brick, Modified 1x4 Log 30137\", \"x\": 5, \"y\": 27}, {\"box\": \"k\", \"pictureName\": \"18.png\", \"text\": \"Brick, Modified 1x1 with Scroll with Hollow Stud 20310\", \"x\": 0, \"y\": 26}, {\"box\": \"k\", \"pictureName\": \"19.png\", \"text\": \"Plate, Modified 1x2 with Ladder 4175\", \"x\": 1, \"y\": 26}, {\"box\": \"k\", \"pictureName\": \"20.png\", \"text\": \"Door Frame 1x4x6 with Two Holes on Top and Bottom 60596/30179\", \"x\": 2, \"y\": 26}, {\"box\": \"k\", \"pictureName\": \"21.png\", \"text\": \"Window 1x4x6 Frame with 3 Panes 57894\", \"x\": 3, \"y\": 26}, {\"box\": \"k\", \"pictureName\": \"22.png\", \"text\": \"Door 1x4x6 with 4 Panes and Stud Handle 60623\", \"x\": 4, \"y\": 26}, {\"box\": \"k\", \"pictureName\": \"23.png\", \"text\": \"Fence 1x4x2 Spindled with 4 Studs 15332/30055\", \"x\": 5, \"y\": 26}]";

        JSONArray result = new JSONArray(data);
        legos = result;
        for (int i=0; i < result.length(); i++)
        {
            try {
                JSONObject lego = result.getJSONObject(i);
                final String box = lego.getString("box");
                final String pictureName = lego.getString("pictureName");
                final String text = lego.getString("text");
                final String x = lego.getString("x");
                final String y = lego.getString("y");

                gridLayout.addView(createLegoLayout(box, pictureName, text, x, y, scrollView, gridLayout, searchView));
            } catch (JSONException e) {
                Log.e("readData", e.toString());
            }
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        final GridLayout gridLayout = findViewById(R.id.gridLayout);
        final ScrollView scrollView = findViewById(R.id.scrollView);
        wandImage = findViewById(R.id.wandImage);
        wandImage.setVisibility(View.INVISIBLE);
        redIdentifier = findViewById(R.id.redIdentifier);
        redIdentifier.setVisibility(View.INVISIBLE);
        sV = scrollView;
        gL = gridLayout;


        scrollView.setBackgroundResource(0);

        final SearchView search = findViewById(R.id.search);
        seaV = search;
        search.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String s) {
                return false;
            }

            @Override
            public boolean onQueryTextChange(String s) {
                if(s.length() == 0){
                    gridLayout.removeAllViews();
                    try {
                        readData(gridLayout, scrollView, search);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }else{
                    gridLayout.removeAllViews();
                    for (int i =0; i < legos.length(); i++){
                        try {
                            JSONObject lego = legos.getJSONObject(i);
                            final String box = lego.getString("box");
                            final String pictureName = lego.getString("pictureName");
                            final String text = lego.getString("text");
                            final String x = lego.getString("x");
                            final String y = lego.getString("y");
                            if(text.toLowerCase().contains(s.toLowerCase())){
                                gridLayout.addView(createLegoLayout(box, pictureName, text, x, y, scrollView, gridLayout, search));
                            }
                        } catch (JSONException e) {
                            Log.e("readData", e.toString());
                        }
                    }
                }
                return false;
            }
        });
        try {
            readData(gridLayout, scrollView, search);
        } catch (JSONException e) {
            e.printStackTrace();
        }

    }
}