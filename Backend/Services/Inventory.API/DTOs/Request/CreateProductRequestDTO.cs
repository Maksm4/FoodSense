using System.ComponentModel.DataAnnotations;

namespace Inventory.API.DTOs.Request
{
    public class CreateProductRequestDTO
    {
        [Required]
        public string Name { get; set; }
        public string? Brand { get; set; }
        public string? Barcode { get; set; } // needed for public approval

        [Required]
        public int CategoryId { get; set; }
        public string? DefaultUnit { get; set; }

        /// <summary>
        /// If true, submits this product for public approval (pending).
        /// If false, creates it as a private product for the user.
        /// </summary>
        public bool SubmitForPublicApproval { get; set; } = false;
    }
}