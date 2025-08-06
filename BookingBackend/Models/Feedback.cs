
using System;
using System.ComponentModel.DataAnnotations;

namespace feedback.Models
{
    public class Feedback
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; } // Foreign key (optional: link to User table)

        [Required]
        [StringLength(1000)]
        public string Message { get; set; }

        [Range(1, 5)]
        public int Rating { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

