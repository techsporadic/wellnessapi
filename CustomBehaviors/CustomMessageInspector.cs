using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel.Dispatcher;
using System.ServiceModel;
using System.ServiceModel.Channels;
using System.Security.Cryptography.X509Certificates;

using System.Net;

using System.Globalization;


namespace CustomBehaviors
{

    public class CustomMessageInspector : IDispatchMessageInspector, IClientMessageInspector
    {
        #region Message Inspector of the Service

        public object AfterReceiveRequest(ref Message request, IClientChannel channel, InstanceContext instanceContext)
        {
              return null;
        }

        public void BeforeSendReply(ref Message reply, object correlationState)
        {

        }



        #endregion

        #region Message Inspector of the Consumer

        public void AfterReceiveReply(ref Message reply, object correlationState)
        {

        }

        public object BeforeSendRequest(ref Message request, IClientChannel channel)
        {
            var headerCompanyID = new MessageHeader<string>(Wellness.Properties.Settings1.Default.CompanyId);
            var untypedCompanyID = headerCompanyID.GetUntypedHeader(Wellness.Constants.SecurityHeaderComanyName, Wellness.Constants.Namespace);
            request.Headers.Add(untypedCompanyID);


            return null;
        }

        #endregion

    }

}
