﻿using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OSnack.Web.Api.AppSettings
{
    /// <summary>
    /// Web API Only constant Functions
    /// </summary>
    public class oAppFunc
    {
        /// <summary>
        /// This method is used to extract the errors form model state
        /// </summary>
        /// <param name="ModelState">The instance of model state which contains the errors</param>
        /// <param name="errorList">the reference of error list to add the errors to </param>
        public static void ExtractErrors(ModelStateDictionary ModelState, ref List<oError> errorList)
        {
            int count = 0;
            // Loop through the Model state values
            foreach (var prop in ModelState.Values)
            {
                /// add each error in the model state to the error list
                Error(ref errorList,
                      prop.Errors.FirstOrDefault().ErrorMessage,
                      ModelState.Keys.ToArray()[count]);
                count++;
            }
        }

        /// <summary>
        /// Used to create a anonymous type and adding it to the referenced error list
        /// </summary>
        /// <param name="Key">Id of the error</param>
        /// <param name="Message">The error message</param>
        /// <param name="errors">Reference of the error list used to add the error</param>
        public static void Error(ref List<oError> errors, string value, string key = "") =>
            errors.Add(new oError(key, value));
        public class oError
        {
            /// <summary>
            /// Method to create an error object to be send to client side
            /// </summary>
            /// <summary>
            /// Constructor to create a new instance of error object
            /// </summary>
            /// <param name="key">The key value of the error (ID)</param>
            /// <param name="value">"The Value of the error (Message)"</param>
            public oError(string key, string value)
            {
                Key = key;
                Value = value;
            }
            /// <summary>
            /// Error Key (ID)
            /// </summary>
            public string Key { get; set; } = "0";
            /// <summary>
            /// Error Value (Message)
            /// </summary>
            public string Value { get; set; }
        }
    }
}