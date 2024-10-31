namespace BiometricFaceApi.Models
{
    public class MonitorEsdView
    {
        public MonitorEsdModel MonitorsEsd { get; set; }
        public int PositionSequence { get; set; }
        public LogMonitorEsdModel LogOperator { get; set; }
        public LogMonitorEsdModel LogJig { get; set; }
       
        public MonitorEsdView()
        {
            LogOperator = new LogMonitorEsdModel();
            LogJig = new LogMonitorEsdModel();

        }
    }
}
