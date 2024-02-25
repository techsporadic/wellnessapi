using System;
using System.Collections.Generic;
using System.Text;
using System.ServiceModel.Configuration;
using System.Configuration;
using System.Xml;

namespace CustomBehaviors
{
    public class CustomBehaviorExtensionElement : BehaviorExtensionElement
    {
        protected override object CreateBehavior()
        {
            return new CustomBehaviorAttribute();
        }

        public override Type BehaviorType
        {
            get
            {
                return typeof(CustomBehaviorAttribute);
            }
        }
    }
}