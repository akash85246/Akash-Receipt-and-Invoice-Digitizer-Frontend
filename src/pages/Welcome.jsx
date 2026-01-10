import GoogleLoginButton from "../components/GoogleLoginButton";
import {
  Cpu,
  Camera,
  FileUp,
  ChartNoAxesCombined,
  ShieldCheck,
} from "lucide-react";
import receiptImg from "../assets/receipt.png";
import avatar1 from "../assets/avatars/avatar1.png";
import avatar2 from "../assets/avatars/avatar2.png";
import avatar3 from "../assets/avatars/avatar3.png";

function Welcome() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-5 md:px-10">
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12 md:py-20">
        <div className="flex flex-col gap-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            Hybrid OCR Engine Live
          </div>
          <h1 className="text-5xl md:text-6xl font-black leading-[1.1] tracking-tight text-[#111418] ">
            Digitize Your Receipts &amp; Invoices in
            <span className="text-primary"> Seconds</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl">
            Stop manual data entry. Use our AI-powered Hybrid OCR to
            intelligently extract data from receipts and invoices, with accuracy
            that adapts to document quality. Review AI-suggested fields and
            export structured data in CSV or JSON formats.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-primary hover:bg-primary/90 text-white text-lg font-bold px-8 py-4 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5">
                Start Scanning
              </button>

              <button className="bg-white border border-gray-200 text-lg font-bold px-8 py-4 rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
                How It Works
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4 pt-4">
            <div className="flex -space-x-3">
              <img
                className="size-10 rounded-full border-2 border-white "
                data-alt="Trusted customer avatar 1"
                src={avatar1}
              />
              <img
                className="size-10 rounded-full border-2 border-white "
                data-alt="Trusted customer avatar 2"
                src={avatar2}
              />
              <img
                className="size-10 rounded-full border-2 border-white "
                data-alt="Trusted customer avatar 3"
                src={avatar3}
              />
            </div>
            <p className="text-sm font-medium text-gray-500">
              Actively building with feedback from early users
            </p>
          </div>
        </div>
        <div className="relative max-w-3xl w-full">
          <div className="absolute -inset-4 bg-primary/20 rounded-full blur-3xl"></div>

          <div className="relative glass-card rounded-2xl p-2 shadow-2xl overflow-hidden ">
            <div
              className="aspect-video w-full rounded-xl bg-gray-100 overflow-hidden bg-cover bg-center"
              style={{ backgroundImage: `url(${receiptImg})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-20 pb-10">
        <div className="flex flex-col items-center text-center gap-4">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Everything you need to go paperless
          </h2>
          <p className="text-gray-600 max-w-2xl text-lg">
            Our platform provides enterprise grade tools to manage your business
            expenses efficiently and accurately.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 py-10">
        <div className="group flex flex-col gap-4 rounded-2xl border border-gray-200  bg-white  p-6 hover:shadow-xl hover:border-primary/30 transition-all">
          <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <Camera className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">Scan</h3>
            <p className="text-gray-600  text-sm leading-relaxed">
              Mobile-friendly capture on the go with real-time feedback.
            </p>
          </div>
        </div>
        <div className="group flex flex-col gap-4 rounded-2xl border border-gray-200  bg-white  p-6 hover:shadow-xl hover:border-primary/30 transition-all">
          <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <FileUp className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">Upload</h3>
            <p className="text-gray-600  text-sm leading-relaxed">
              Batch upload PDFs and JPGs with simple drag-and-drop.
            </p>
          </div>
        </div>
        <div className="group flex flex-col gap-4 rounded-2xl border border-gray-200  bg-white p-6 hover:shadow-xl hover:border-primary/30 transition-all">
          <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <Cpu className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-gray-600 text-sm leading-relaxed">
              Instant data extraction for totals, tax, dates, and vendors.
            </p>
          </div>
        </div>
        <div className="group flex flex-col gap-4 rounded-2xl border border-gray-200  bg-white p-6 hover:shadow-xl hover:border-primary/30 transition-all">
          <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <ChartNoAxesCombined className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">Analytics</h3>
            <p className="text-gray-600  text-sm leading-relaxed">
              Visual spend tracking and monthly reporting dashboards.
            </p>
          </div>
        </div>
        <div className="group flex flex-col gap-4 rounded-2xl border border-gray-200 d bg-white  p-6 hover:shadow-xl hover:border-primary/30 transition-all">
          <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">Security</h3>
            <p className="text-gray-600  text-sm leading-relaxed">
              Secure authentication powered by JWT and Google sign-in.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-gray-200 ">
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            How It Works
          </h2>
          <p className="text-gray-600 max-w-2xl text-lg">
            Three simple steps to transform your financial workflows.
          </p>
        </div>
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 px-4">
          <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 border-t-2 border-dashed border-gray-200 -z-10"></div>
          <div className="flex flex-col items-center text-center gap-6">
            <div className="size-20 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-primary/30">
              1
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-xl font-bold">Upload Document</h4>
              <p className="text-gray-600 ">
                Snap a photo or upload a PDF,JPG,PNG OR JPEG from your computer
                or mobile device.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-6">
            <div className="size-20 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-primary/30">
              2
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-xl font-bold">AI Extraction</h4>
              <p className="text-gray-600 ">
                Our hybrid OCR engine processes the document and extracts
                detected line itemsefficiently.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-6">
            <div className="size-20 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-primary/30">
              3
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-xl font-bold">Review &amp; Export</h4>
              <p className="text-gray-600">
                Review the extracted results and export structured data in CSV
                or JSON formats for easy use in your accounting workflows.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="bg-primary rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 size-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 size-64 bg-black/10 rounded-full blur-3xl"></div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 relative z-10">
            Ready to save hours every week?
          </h2>
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto relative z-10">
            Eliminate manual data entry with an AI-powered Hybrid OCR platform.
            Get started today no setup, no cost.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <button className="bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-xl">
              Get Started
            </button>
            
            <span>Built as a free, evolving project</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Welcome;
