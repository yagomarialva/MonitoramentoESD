namespace BiometricFaceApi.Models
{
    public class StationView
    {
        public StationModel Station { get; set; }
        public List<MonitorEsdModel> MonitorsEsd { get; set; }
        public StationView()
        {
            MonitorsEsd = new List<MonitorEsdModel>();
            Station = new StationModel();
        }
    }
}
