package com.temauraaqui.blocosmalucos;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(PlacarOnlinePlugin.class); // placar mundial (Google Play Games)
        super.onCreate(savedInstanceState);
    }
}
