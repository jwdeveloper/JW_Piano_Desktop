package jw.piano;


        import java.io.File;
        import java.io.FileInputStream;
        import java.io.PushbackInputStream;
        import java.io.InputStream;
        import java.lang.Byte;
        import java.util.ArrayList;
        import java.util.zip.ZipEntry;
        import java.util.zip.ZipInputStream;

/**
 * Class to get the length of ogg files.
 *
 * @version 20030220
 * @author Jörg P. M. Haeger
 * Added to OggAudioData by Korynkai 20141217
 */

public class OggAudioData {

    // Public methods

    public static long getSeconds(InputStream stream, Long len) throws Exception {
        return (new OggAudioData(stream, len)).getSeconds();
    }

    public static long getSeconds(InputStream stream) throws Exception {
        return (new OggAudioData(stream)).getSeconds();
    }

    public static long getSeconds(ZipInputStream stream) throws Exception {
        return (new OggAudioData(stream)).getSeconds();
    }

    public static long getSeconds(String path) throws Exception {
        return (new OggAudioData(path)).getSeconds();
    }

    public static long getSeconds(File file) throws Exception {
        return (new OggAudioData(file)).getSeconds();
    }

    public static int getChannels(InputStream stream, Long len) throws Exception {
        return (new OggAudioData(stream, len)).audio_channels;
    }

    public static int getChannels(InputStream stream) throws Exception {
        return (new OggAudioData(stream)).audio_channels;
    }

    public static int getChannels(ZipInputStream stream) throws Exception {
        return (new OggAudioData(stream)).audio_channels;
    }

    public static int getChannels(String path) throws Exception {
        return (new OggAudioData(path)).audio_channels;
    }

    public static int getChannels(File file) throws Exception {
        return (new OggAudioData(file)).audio_channels;
    }

    public static int getSampleRate(InputStream stream, Long len) throws Exception {
        return (new OggAudioData(stream, len)).audio_sample_rate;
    }

    public static int getSampleRate(InputStream stream) throws Exception {
        return (new OggAudioData(stream)).audio_sample_rate;
    }

    public static int getSampleRate(ZipInputStream stream) throws Exception {
        return (new OggAudioData(stream)).audio_sample_rate;
    }

    public static int getSampleRate(String path) throws Exception {
        return (new OggAudioData(path)).audio_sample_rate;
    }

    public static int getSampleRate(File file) throws Exception {
        return (new OggAudioData(file)).audio_sample_rate;
    }

    public static int getVorbisVersion(InputStream stream, Long len) throws Exception {
        return (new OggAudioData(stream, len)).vorbis_version;
    }

    public static int getVorbisVersion(InputStream stream) throws Exception {
        return (new OggAudioData(stream)).vorbis_version;
    }

    public static int getVorbisVersion(ZipInputStream stream) throws Exception {
        return (new OggAudioData(stream)).vorbis_version;
    }

    public static int getVorbisVersion(String path) throws Exception {
        return (new OggAudioData(path)).vorbis_version;
    }

    public static int getVorbisVersion(File file) throws Exception {
        return (new OggAudioData(file)).vorbis_version;
    }

    // Virtually useless... Size already known at time of call... Implemented anyway for API uniformity.
    public static long getSizeInBytes(InputStream stream, Long len) throws Exception {
        return (new OggAudioData(stream, len)).dataLength;
    }

    public static long getSizeInBytes(InputStream stream) throws Exception {
        return (new OggAudioData(stream)).dataLength;
    }

    public static long getSizeInBytes(ZipInputStream stream) throws Exception {
        return (new OggAudioData(stream)).dataLength;
    }

    public static long getSizeInBytes(String path) throws Exception {
        return (new OggAudioData(path)).dataLength;
    }

    // Virtually useless... Size already known at time of call... Implemented anyway for API uniformity.
    public static long getSizeInBytes(File file) throws Exception {
        return (new OggAudioData(file)).dataLength;
    }

    public static void showInfo(InputStream stream, Long len) throws Exception {
        new OggAudioData(stream, len).showInfo();
    }

    public static void showInfo(InputStream stream) throws Exception {
        new OggAudioData(stream).showInfo();
    }

    public static void showInfo(ZipInputStream stream) throws Exception {
        new OggAudioData(stream).showInfo();
    }

    public static void showInfo(String path) throws Exception {
        new OggAudioData(path).showInfo();
    }

    public static void showInfo(File file) throws Exception {
        new OggAudioData(file).showInfo();
    }

    // Private Constructors

    private OggAudioData(File file) throws Exception {
        initValues((InputStream) (new FileInputStream(file)), file.length());
    }

    public OggAudioData(String file) throws Exception {
        this(new File(file));
    }

    private OggAudioData(InputStream is) throws Exception {
        PushbackInputStream stream = new PushbackInputStream(is, 20000000);
        long size = 0;
        int bt = 0;
        ArrayList<Byte> btList = new ArrayList<Byte>();

        while (bt != -1) {
            bt = stream.read();
            if (bt == -1) {
                break;
            }
            btList.add(new Byte((byte) bt));
            size++;
        }

        byte[] reset = new byte[btList.size()];
        int j=0;
        for(Byte y: btList) {
            reset[j++] = y.byteValue();
        }

        stream.unread(reset);
        initValues(stream, size);
    }

    private OggAudioData(InputStream stream, Long len) throws Exception {
        initValues(stream, len);
    }

    private OggAudioData(ZipInputStream stream) throws Exception {
        ZipEntry entry;
        if ((entry = stream.getNextEntry()) != null) {
            initValues(stream, entry.getSize());
        }
    }

    // Private methods

    private void initValues(InputStream stream, Long len) throws Exception {
        dataLength = len;
        int pos = 0;
        while (true) {
            int packet_type = 0;
            char[] capture_pattern1 = { 'v','o','r','b','i','s' };
            for (int i = 0; i < capture_pattern1.length; i++) {
                int b = stream.read();
                if (b == -1)
                    throw new Exception(
                            "no Vorbis identification header");
                pos++;
                if (b != capture_pattern1[i]) {
                    packet_type = b;
                    i = -1;
                }
            }

            if (packet_type == 1)
                break;
        }

        vorbis_version = read32Bits(stream);
        if (vorbis_version > 0)
            throw new Exception("unknown vorbis_version "
                    + vorbis_version);
        audio_channels = stream.read();
        audio_sample_rate = read32Bits(stream);
        pos += 4 + 1 + 4;

        headerStart = dataLength - 16 * 1024;
        stream.skip(headerStart - pos);
        int count = 0;
        while (true) {
            char[] capture_pattern = { 'O', 'g', 'g', 'S', 0 };
            int i;
            for (i = 0; i < capture_pattern.length; i++) {
                int b = stream.read();
                if (b == -1)
                    break;
                if (b != capture_pattern[i]) {
                    headerStart += i + 1;
                    i = -1;
                }
            }
            if (i < capture_pattern.length)
                break;

            count++;

            int header_type_flag = stream.read();
            if (header_type_flag == -1)
                break;

            long absolute_granule_position = 0;
            for (i = 0; i < 8; i++) {
                long b = stream.read();
                if (b == -1)
                    break;

                absolute_granule_position |= b << (8 * i);
            }
            if (i < 8)
                break;

            if ((header_type_flag & 0x06) != 0) {
                sampleNum = absolute_granule_position;
                System.out.println(sampleNum);
            }
        }
    }

    private int read32Bits(InputStream inStream) throws Exception {
        int n = 0;
        for (int i = 0; i < 4; i++) {
            int b = inStream.read();
            if (b == -1)
                throw new Exception("Unexpected end of input stream");
            n |= b << (8 * i);
        }
        return n;
    }

    private long getSeconds() {
        if (audio_sample_rate > 0)
            return sampleNum / audio_sample_rate;
        else
            return 0;
    }

    public void showInfo() {
        System.out.println("audio_channels = " + audio_channels);
        System.out.println("audio_sample_rate = " + audio_sample_rate);
        System.out.println("dataLength = " + dataLength);
        System.out.println("seconds = " + getSeconds());
        System.out.println("headerStart = " + headerStart);
        System.out.println("vorbis_version = " + vorbis_version);
    }

    // Private fields

    private int audio_channels;
    private int audio_sample_rate;
    private long dataLength;
    private long headerStart;
    private long sampleNum;
    private int vorbis_version;

}