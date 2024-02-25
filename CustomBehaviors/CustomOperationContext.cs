using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;

namespace CustomBehaviors
{
    public class CustomOperationContext : IExtension<OperationContext>
    {

        public static CustomOperationContext Current
        {
            get { return OperationContext.Current.Extensions.Find<CustomOperationContext>(); }
        }

        #region IExtension<OperationContext> Members


        public void Attach(OperationContext owner)
        {
        }


        public void Detach(OperationContext owner)
        {
        }

        #endregion


    }

}
