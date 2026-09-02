import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

export default function SkillPassportTrustLevels() {
  const [shareModalOpen, setShareModalOpen] = useState(false);

  return (
    <DashboardLayout>
      {/*Header Section*/}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-xl gap-lg">
        <div>
          <h1 className="font-display-lg text-display-lg text-on-surface mb-2">Arjun Mehta</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Computer Science, M.S. • Skill Passport / Digital Portfolio</p>
        </div>
        <button
          onClick={() => setShareModalOpen(true)}
          className="bg-primary-container text-on-primary border-none py-2 px-4 rounded font-label-md text-label-md flex items-center gap-2 hover:bg-primary transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined">share</span>
          Share Portfolio
        </button>
      </div>

      {/*Bento Grid Layout*/}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        {/*Left Column (Verified Skills)*/}
        <div className="lg:col-span-4 flex flex-col gap-lg">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-DEFAULT p-lg flex flex-col h-full">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md flex items-center gap-2 border-b border-outline-variant pb-2">
              <span className="material-symbols-outlined">verified</span>
              Verified Skills
            </h2>
            <div className="flex flex-col gap-md">
              {[
                { skill: "Python", tag: "Assessment-verified" },
                { skill: "React", tag: "Faculty-verified" },
                { skill: "Node.js", tag: "Assessment-verified" },
                { skill: "Machine Learning", tag: "Industry-verified" },
                { skill: "Data Structures", tag: "Assessment-verified" },
              ].map((item, i, arr) => (
                <div
                  key={item.skill}
                  className={`flex justify-between items-center py-2 ${i < arr.length - 1 ? "border-b border-outline-variant" : ""}`}
                >
                  <span className="font-body-md text-body-md font-medium text-on-surface">{item.skill}</span>
                  <span className="trust-label">{item.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/*Right Column (Projects & Certs)*/}
        <div className="lg:col-span-8 flex flex-col gap-lg">
          {/*Projects*/}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-DEFAULT p-lg">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md flex items-center gap-2 border-b border-outline-variant pb-2">
              <span className="material-symbols-outlined">work</span>
              Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div className="border border-outline-variant rounded-DEFAULT p-4 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-label-md text-label-md text-on-surface">Predictive Analytics Engine</h3>
                  <span className="trust-label">Industry-verified</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-4 flex-grow">
                  Developed a scalable machine learning pipeline for analyzing real-time financial data streams in collaboration with FinTech Corp.
                </p>
                <div className="flex gap-2 mt-auto">
                  <span className="bg-surface-container-high px-2 py-1 rounded text-label-sm font-label-sm text-on-surface-variant">Python</span>
                  <span className="bg-surface-container-high px-2 py-1 rounded text-label-sm font-label-sm text-on-surface-variant">AWS</span>
                </div>
              </div>
              <div className="border border-outline-variant rounded-DEFAULT p-4 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-label-md text-label-md text-on-surface">University Registration Portal</h3>
                  <span className="trust-label">Faculty-verified</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-4 flex-grow">
                  Led the frontend redesign of the student registration system, improving accessibility and reducing load times by 40%.
                </p>
                <div className="flex gap-2 mt-auto">
                  <span className="bg-surface-container-high px-2 py-1 rounded text-label-sm font-label-sm text-on-surface-variant">React</span>
                  <span className="bg-surface-container-high px-2 py-1 rounded text-label-sm font-label-sm text-on-surface-variant">Node.js</span>
                </div>
              </div>
            </div>
          </div>

          {/*Certifications*/}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-DEFAULT p-lg">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md flex items-center gap-2 border-b border-outline-variant pb-2">
              <span className="material-symbols-outlined">workspace_premium</span>
              Certifications &amp; Credentials
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4 border border-outline-variant p-4 rounded-DEFAULT">
                <div className="w-12 h-12 bg-surface-container-high flex items-center justify-center rounded border border-outline-variant shrink-0">
                  <span className="material-symbols-outlined text-secondary">cloud</span>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-label-md text-label-md text-on-surface">AWS Certified Solutions Architect</h3>
                    <span className="trust-label">Credential Issued</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Amazon Web Services (AWS) • Issued Jan 2024</p>
                </div>
              </div>
              <div className="flex items-start gap-4 border border-outline-variant p-4 rounded-DEFAULT">
                <div className="w-12 h-12 bg-surface-container-high flex items-center justify-center rounded border border-outline-variant shrink-0">
                  <span className="material-symbols-outlined text-secondary">database</span>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-label-md text-label-md text-on-surface">Advanced Data Structures Assessment</h3>
                    <span className="trust-label">Assessment-verified</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">AcademiaLink Technical Assessments • Top 5% Percentile</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*Inline Share Modal/Overlay*/}
      <div className={`${shareModalOpen ? "flex" : "hidden"} fixed inset-0 bg-[#1A1A1A]/20 z-50 items-center justify-center p-4`}>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg max-w-sm w-full relative">
          <button onClick={() => setShareModalOpen(false)} className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md text-center">Share Skill Passport</h3>
          <div className="border border-outline-variant p-4 rounded flex flex-col items-center justify-center mb-md bg-surface-container-low">
            <img
              alt="QR Code"
              className="w-48 h-48 mb-4 object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2sL6A45HFCK8-eI2mGXwpY8iXOIFc6mAA4kEowqMnY19qa_3TLlat5BHrKjaWkeheWKyvEvlZJ-_cTlGjj2ZklEvVebpSfspxn3lRPDmaY6WMqDM0N7c6xsebf2hK1JrvF6MK3Qdn7kZKQ-w3WJhz9Z-gMjpsp41_HOp06lBEgzwpuShsHr8oPyF13n0YkLTg8RXoHsmw5x6VLX1sPWw6y3DvCqsmilsIvTcjv6W4BeqCmDmQoxjK"
            />
            <p className="font-body-sm text-body-sm text-on-surface-variant text-center">Scan to view verified portfolio</p>
          </div>
          <div className="flex gap-2">
            <input
              className="flex-grow border border-outline-variant bg-surface-container-lowest rounded-DEFAULT px-3 py-2 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary-container"
              readOnly
              type="text"
              defaultValue="https://academialink.edu/passport/amehta"
            />
            <button className="bg-surface-container-lowest border border-outline-variant text-on-surface px-4 py-2 rounded-DEFAULT font-label-md text-label-md hover:bg-surface-container-low transition-colors">
              Copy
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
