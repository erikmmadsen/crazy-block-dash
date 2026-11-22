package com.temauraaqui.blocosmalucos;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.gms.games.PlayGames;
import com.google.android.gms.games.PlayGamesSdk;

/**
 * Placar mundial pelo Google Play Games (Play Games Services v2).
 * Os IDs ficam em res/values/strings.xml:
 *   game_services_project_id = ID do projeto do Play Games (Play Console > Play Games Services > Configuração)
 *   leaderboard_pontos       = ID do placar (Play Console > Play Games Services > Placares)
 * Enquanto os IDs não forem preenchidos, o plugin fica desligado e o jogo mostra um aviso.
 */
@CapacitorPlugin(name = "PlacarOnline")
public class PlacarOnlinePlugin extends Plugin {
    private static final int RC_PLACAR = 9004;
    private boolean ready = false;

    private String placarId() {
        return getContext().getString(R.string.leaderboard_pontos);
    }

    private boolean configurado() {
        String app = getContext().getString(R.string.game_services_project_id);
        return !app.startsWith("0000") && !placarId().startsWith("COLE");
    }

    @Override
    public void load() {
        if (!configurado()) return;
        try {
            PlayGamesSdk.initialize(getContext());
            ready = true;
        } catch (Exception e) {
            ready = false;
        }
    }

    @PluginMethod
    public void status(PluginCall call) {
        if (!ready) {
            JSObject r = new JSObject();
            r.put("available", false);
            r.put("signedIn", false);
            call.resolve(r);
            return;
        }
        PlayGames.getGamesSignInClient(getActivity()).isAuthenticated().addOnCompleteListener(t -> {
            JSObject r = new JSObject();
            r.put("available", true);
            r.put("signedIn", t.isSuccessful() && t.getResult().isAuthenticated());
            call.resolve(r);
        });
    }

    @PluginMethod
    public void submitScore(PluginCall call) {
        if (!ready) {
            call.resolve();
            return;
        }
        long pontos = Math.round(call.getDouble("score", 0.0));
        PlayGames.getGamesSignInClient(getActivity()).isAuthenticated().addOnCompleteListener(t -> {
            if (t.isSuccessful() && t.getResult().isAuthenticated() && pontos > 0) {
                PlayGames.getLeaderboardsClient(getActivity()).submitScore(placarId(), pontos);
            }
            call.resolve();
        });
    }

    @PluginMethod
    public void showLeaderboard(PluginCall call) {
        if (!ready) {
            call.reject("not_configured");
            return;
        }
        PlayGames.getGamesSignInClient(getActivity()).isAuthenticated().addOnCompleteListener(a -> {
            if (a.isSuccessful() && a.getResult().isAuthenticated()) {
                abrir(call);
                return;
            }
            // ainda não entrou no Play Games: pede para entrar e depois abre o placar
            PlayGames.getGamesSignInClient(getActivity()).signIn().addOnCompleteListener(b -> {
                if (b.isSuccessful() && b.getResult().isAuthenticated()) abrir(call);
                else call.reject("not_signed_in");
            });
        });
    }

    private void abrir(PluginCall call) {
        PlayGames.getLeaderboardsClient(getActivity())
            .getLeaderboardIntent(placarId())
            .addOnSuccessListener(intent -> {
                getActivity().startActivityForResult(intent, RC_PLACAR);
                call.resolve();
            })
            .addOnFailureListener(e -> call.reject("open_failed"));
    }
}
