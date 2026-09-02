import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { ShareNetwork, SealCheck, Briefcase, Certificate, CloudArrowUp, Database, X } from "@phosphor-icons/react";

const trustLabelClass = "text-xs px-2 py-0.5 rounded-full bg-pastel-blue text-pastel-blue-ink uppercase tracking-wide";

export default function SkillPassportTrustLevels() {
  const [shareModalOpen, setShareModalOpen] = useState(false);

  return (
    <DashboardLayout>
      {/*Header Section*/}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="font-editorial text-3xl text-ink tracking-tight mb-1">Arjun Mehta</h1>
          <p className="text-muted">Computer Science, M.S. • Skill Passport / Digital Portfolio</p>
        </div>
        <button
          onClick={() => setShareModalOpen(true)}
          className="bg-ink text-white py-2 px-4 rounded-md text-sm flex items-center gap-2 hover:bg-[#333333] active:scale-[0.98] transition-all cursor-pointer"
        >
          <ShareNetwork size={16} />
          Share Portfolio
        </button>
      </div>

      {/*Bento Grid Layout*/}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/*Left Column (Verified Skills)*/}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white border border-hairline rounded-xl p-6 flex flex-col h-full">
            <h2 className="text-base font-medium text-ink mb-4 flex items-center gap-2 border-b border-hairline pb-3">
              <SealCheck size={18} className="text-pastel-green-ink" />
              Verified Skills
            </h2>
            <div className="flex flex-col gap-3">
              {[
                { skill: "Python", tag: "Assessment-verified" },
                { skill: "React", tag: "Faculty-verified" },
                { skill: "Node.js", tag: "Assessment-verified" },
                { skill: "Machine Learning", tag: "Industry-verified" },
                { skill: "Data Structures", tag: "Assessment-verified" },
              ].map((item, i, arr) => (
                <div key={item.skill} className={`flex justify-between items-center py-2 ${i < arr.length - 1 ? "border-b border-hairline" : ""}`}>
                  <span className="text-sm font-medium text-charcoal">{item.skill}</span>
                  <span className={trustLabelClass}>{item.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/*Right Column (Projects & Certs)*/}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/*Projects*/}
          <div className="bg-white border border-hairline rounded-xl p-6">
            <h2 className="text-base font-medium text-ink mb-4 flex items-center gap-2 border-b border-hairline pb-3">
              <Briefcase size={18} />
              Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-hairline rounded-xl p-4 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-medium text-ink">Predictive Analytics Engine</h3>
                  <span className={trustLabelClass}>Industry-verified</span>
                </div>
                <p className="text-sm text-muted mb-4 flex-grow leading-relaxed">
                  Developed a scalable machine learning pipeline for analyzing real-time financial data streams in collaboration with FinTech Corp.
                </p>
                <div className="flex gap-2 mt-auto">
                  <span className="bg-bone px-2 py-1 rounded text-xs text-charcoal">Python</span>
                  <span className="bg-bone px-2 py-1 rounded text-xs text-charcoal">AWS</span>
                </div>
              </div>
              <div className="border border-hairline rounded-xl p-4 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-medium text-ink">University Registration Portal</h3>
                  <span className={trustLabelClass}>Faculty-verified</span>
                </div>
                <p className="text-sm text-muted mb-4 flex-grow leading-relaxed">
                  Led the frontend redesign of the student registration system, improving accessibility and reducing load times by 40%.
                </p>
                <div className="flex gap-2 mt-auto">
                  <span className="bg-bone px-2 py-1 rounded text-xs text-charcoal">React</span>
                  <span className="bg-bone px-2 py-1 rounded text-xs text-charcoal">Node.js</span>
                </div>
              </div>
            </div>
          </div>

          {/*Certifications*/}
          <div className="bg-white border border-hairline rounded-xl p-6">
            <h2 className="text-base font-medium text-ink mb-4 flex items-center gap-2 border-b border-hairline pb-3">
              <Certificate size={18} />
              Certifications &amp; Credentials
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4 border border-hairline p-4 rounded-xl">
                <div className="w-11 h-11 bg-bone flex items-center justify-center rounded-lg shrink-0">
                  <CloudArrowUp size={20} className="text-muted" />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-sm font-medium text-ink">AWS Certified Solutions Architect</h3>
                    <span className={trustLabelClass}>Credential Issued</span>
                  </div>
                  <p className="text-sm text-muted">Amazon Web Services (AWS) • Issued Jan 2024</p>
                </div>
              </div>
              <div className="flex items-start gap-4 border border-hairline p-4 rounded-xl">
                <div className="w-11 h-11 bg-bone flex items-center justify-center rounded-lg shrink-0">
                  <Database size={20} className="text-muted" />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-sm font-medium text-ink">Advanced Data Structures Assessment</h3>
                    <span className={trustLabelClass}>Assessment-verified</span>
                  </div>
                  <p className="text-sm text-muted">AcademiaLink Technical Assessments • Top 5% Percentile</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*Inline Share Modal/Overlay*/}
      <div className={`${shareModalOpen ? "flex" : "hidden"} fixed inset-0 bg-[#1A1A1A]/20 z-50 items-center justify-center p-4`}>
        <div className="bg-white border border-hairline rounded-xl p-8 max-w-sm w-full relative">
          <button onClick={() => setShareModalOpen(false)} className="absolute top-4 right-4 text-muted hover:text-ink">
            <X size={18} />
          </button>
          <h3 className="text-lg font-medium text-ink mb-4 text-center">Share Skill Passport</h3>
          <div className="border border-hairline p-4 rounded-xl flex flex-col items-center justify-center mb-4 bg-bone">
            <img
              alt="QR Code"
              className="w-48 h-48 mb-4 object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2sL6A45HFCK8-eI2mGXwpY8iXOIFc6mAA4kEowqMnY19qa_3TLlat5BHrKjaWkeheWKyvEvlZJ-_cTlGjj2ZklEvVebpSfspxn3lRPDmaY6WMqDM0N7c6xsebf2hK1JrvF6MK3Qdn7kZKQ-w3WJhz9Z-gMjpsp41_HOp06lBEgzwpuShsHr8oPyF13n0YkLTg8RXoHsmw5x6VLX1sPWw6y3DvCqsmilsIvTcjv6W4BeqCmDmQoxjK"
            />
            <p className="text-sm text-muted text-center">Scan to view verified portfolio</p>
          </div>
          <div className="flex gap-2">
            <input
              className="flex-grow border border-hairline bg-white rounded-md px-3 py-2 text-sm text-charcoal focus:outline-none focus:border-ink"
              readOnly
              type="text"
              defaultValue="https://academialink.edu/passport/amehta"
            />
            <button className="border border-hairline text-charcoal px-4 py-2 rounded-md text-sm hover:bg-bone transition-colors">Copy</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
