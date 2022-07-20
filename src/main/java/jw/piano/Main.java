package jw.piano;



public class Main
{
    public static void main(String[] args)
    {
       var url ="https://raw.githubusercontent.com/jwdeveloper/JW_Piano_Client/master/src/index.html";
       var path = ClientDownloader.download(url);
       Browser.Open(path);
    }
}
