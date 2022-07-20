package jw.piano;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

public class ClientDownloader
{
    public static String download(String url)
    {
        Path currentRelativePath = Paths.get("");
        var output = Path.of(currentRelativePath.toAbsolutePath().toString(),"index.html");
        try {
            URL website = null;
            website = new URL(url);
            InputStream in = website.openStream();
             Files.copy(in,output, StandardCopyOption.REPLACE_EXISTING);
             return output.toString();
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
         return null;
    }
}
