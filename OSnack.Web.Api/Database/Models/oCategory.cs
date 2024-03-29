﻿using Newtonsoft.Json;
using OSnack.Web.Api.AppSettings.CustomAttributes;
using OSnack.Web.Api.AppSettings.CustomTypes;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OSnack.Web.Api.Database.Models
{
    [Table("Categories")]
    public class oCategory
    {
        [Key]
        public int? Id { get; set; }

        #region nvarchar(256), Required, StringLength(256)
        [Column(TypeName = "nvarchar(256)")]
        [Required(ErrorMessage = "Name is Required \n")]
        [StringLength(256, ErrorMessage = "Must be less than 256 Characters \n")]
        #endregion
        public string Name { get { return _Name; } set { _Name = value.Trim(); } }
        private string _Name;


        #region decimal(7,2), Required, DataType(Currency), PositiveDecimalIncludingZero
        [Column(TypeName = "decimal(7,2)")]
        [Required(ErrorMessage = "Default Price is Required \n")]
        [DataType(DataType.Currency, ErrorMessage = "Invalid Currency \n")]
        [PositiveDecimalIncludingZero(ErrorMessage = "Invalid Currency \n")]
        #endregion
        public decimal Price { get; set; }

        [Required(ErrorMessage = "Unit Type is Required \n")]
        public ProductUnitType? Unit { get; set; }


        [Required(ErrorMessage = "Unit Quantity is Required \n")]
        public int UnitQuantity { get; set; }

        [Display(Name = "Display Image")]
        public string ImagePath { get; set; }

        public bool Status { get; set; } = false;

        [JsonIgnore]
        public ICollection<oProduct> Products { get; set; }

        [NotMapped]
        [Required(ErrorMessage = "Image is Required \n")]
        public string ImageBase64 { get; set; }
    }
}