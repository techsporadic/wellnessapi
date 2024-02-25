using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography.X509Certificates;
using System.Web;
using System.Web.Mvc;
using System.Xml;

namespace Wellness.Controllers
{
    public class HomeController : Controller
    {

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public ActionResult Index()
        {
            var _url = "https://compete-dataservice.cert-jfisoftware.com:8232/v2_0/ClassService.svc?singleWsdl";
            var _action = "http://JonasFitness.com/CompeteDataService/v2_0/ClassService";

            XmlDocument soapEnvelopeXml = CreateSoapEnvelope();
            HttpWebRequest webRequest = CreateWebRequest(_url, _action);
            InsertSoapEnvelopeIntoWebRequest(soapEnvelopeXml, webRequest);

            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
            // begin async call to web request.
            IAsyncResult asyncResult = webRequest.BeginGetResponse(null, null);

            // suspend this thread until call is complete. You might want to
            // do something usefull here like update your UI.
            asyncResult.AsyncWaitHandle.WaitOne();

            // get the response from the completed web request.
            string soapResult;
            using (WebResponse webResponse = webRequest.EndGetResponse(asyncResult))
            {
                using (StreamReader rd = new StreamReader(webResponse.GetResponseStream()))
                {
                    soapResult = rd.ReadToEnd();
                }
                Console.Write(soapResult);
            }

            ViewBag.SR = soapResult;
            return View();
        }

        private static HttpWebRequest CreateWebRequest(string url, string action)
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
            HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(url);
            webRequest.Headers.Add("SOAPAction", action);

            X509Certificate2Collection certificates = new X509Certificate2Collection();
            certificates.Import("C:/Users/Quantumball/Documents/Visual Studio 2013/Projects/Wellness/Wellness/TheWellnessInstitute-CERT-JFI.pfx", "Jonas2020!", X509KeyStorageFlags.MachineKeySet | X509KeyStorageFlags.PersistKeySet);


            //var Cert = new X509Certificate2("C:/Users/Quantumball/Documents/Visual Studio 2013/Projects/Wellness/Wellness/JonasFitnessIncCA.cer");

            webRequest.ClientCertificates = certificates;
            webRequest.ContentType = "text/xml;charset=\"utf-8\"";
            webRequest.Accept = "text/xml";
            webRequest.Method = "POST";
            return webRequest;
        }

        private static XmlDocument CreateSoapEnvelope()
        {
            XmlDocument soapEnvelopeDocument = new XmlDocument();
            soapEnvelopeDocument.LoadXml(
            @"<?xml version='1.0' encoding='utf-8'?>
            <soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/'
            xmlns:clas='http://JonasFitness.com/CompeteDataService/v2_0/ClassService'
            xmlns:com='http://JonasFitness.com/CompeteDataService/v2_0/Common'
            xmlns:req='http://JonasFitness.com/CompeteDataService/v2_0/Requests'>
            <soapenv:Header>
            <CompanyID xmlns='http://JonasFitness.com/CompeteDataService/2013/04/01'>21</CompanyID>
            </soapenv:Header>
            <soapenv:Body>
            <clas:GetClasses>
               <!--Optional:-->
               <clas:GetClassesRequest>
                  <req:Clubs />
                  <req:StartEndDateTime>
                     <com:Start>2017-11-01</com:Start>
                     <com:End>2017-11-30</com:End>
                  </req:StartEndDateTime>
                  <req:ClientDateTime>2017-11-08</req:ClientDateTime>
                  <req:PageInfo>
                     <req:Page>1</req:Page>
                     <req:PageSize>10</req:PageSize>
                  </req:PageInfo>
               </clas:GetClassesRequest>
            </clas:GetClasses>
            </soapenv:Body>
            </soapenv:Envelope>");
            return soapEnvelopeDocument;
        }

        private static void InsertSoapEnvelopeIntoWebRequest(XmlDocument soapEnvelopeXml, HttpWebRequest webRequest)
        {
            using (Stream stream = webRequest.GetRequestStream())
            {
                soapEnvelopeXml.Save(stream);
            }
        }

    }
}