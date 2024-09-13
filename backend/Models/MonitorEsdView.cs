namespace BiometricFaceApi.Models
{
    public class MonitorEsdView
    {
        public int PositionSequence { get; set; }
        public MonitorEsdModel MonitorsEsd { get; set; }

        public MonitorEsdView()
        {
            MonitorsEsd = new MonitorEsdModel();

        }
    }
}
