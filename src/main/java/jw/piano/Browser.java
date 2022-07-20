package jw.piano;

import java.io.IOException;

public class Browser {
    public static void Open(String url) {
        String os = System.getProperty("os.name").toLowerCase();
        try
        {
            if (os.indexOf("win") >= 0) {
                Windows(url);
            }
            if (os.indexOf("mac") >= 0) {
                Mac(url);
            }
            if (os.indexOf("nix") >= 0 || os.indexOf("nux") >= 0) {
                Linux(url);
            }
        }
        catch (Exception e)
        {

        }
    }

    private static void Windows(String url) throws IOException {
        Runtime rt = Runtime.getRuntime();
        rt.exec("rundll32 url.dll,FileProtocolHandler " + url);
    }

    private static void Linux(String url) throws IOException {
        Runtime rt = Runtime.getRuntime();
        String[] browsers = { "google-chrome", "firefox", "mozilla", "epiphany", "konqueror",
                "netscape", "opera", "links", "lynx" };

        StringBuffer cmd = new StringBuffer();
        for (int i = 0; i < browsers.length; i++)
            if(i == 0)
                cmd.append(String.format(    "%s \"%s\"", browsers[i], url));
            else
                cmd.append(String.format(" || %s \"%s\"", browsers[i], url));
        // If the first didn't work, try the next browser and so on

        rt.exec(new String[] { "sh", "-c", cmd.toString() });
    }

    private static void Mac(String url) throws IOException {
        Runtime rt = Runtime.getRuntime();
        rt.exec("open " + url);
    }

}
