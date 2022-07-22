package jw.piano;



public class Main
{


    public static void main(String[] args)
    {


        try {
            new OggAudioData("C:\\Users\\jack\\PycharmProjects\\oggtest\\abba1.ogg").showInfo();
        } catch (Exception e) {
            e.printStackTrace();
        }

      /* String url ="https://raw.githubusercontent.com/jwdeveloper/JW_Piano_Desktop/master/website/index.html";
       String path = ClientDownloader.download(url);
       Browser.Open(path);*/
    }
}
