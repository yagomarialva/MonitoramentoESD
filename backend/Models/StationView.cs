namespace BiometricFaceApi.Models
{
    public class StationView
    {
        public StationModel Station { get; set; }
        public List<MonitorEsdView> MonitorsEsd { get; set; }
        public StationView()
        {
            MonitorsEsd = new List<MonitorEsdView>();
            Station = new StationModel();
        }
    }
}
