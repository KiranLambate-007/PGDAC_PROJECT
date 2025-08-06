namespace BookingBackend.DTO
{
    public class RouteDto
    {
        public int RouteId { get; set; }
        public string Source { get; set; }
        public string Destination { get; set; }
        public float DistanceKm { get; set; }
        public string EstimatedTime { get; set; }
        public DateTime DateTime { get; set; }
        public float Price { get; set; }
    }
}