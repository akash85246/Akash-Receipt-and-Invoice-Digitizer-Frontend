<div className="h-full overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 border-b flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-slate-800">
                   
                  </h2>
                  <p className="text-xs text-slate-500">
                   
                  </p>
                </div>

                <span className="text-xs px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 font-medium">
                  {document_type.toUpperCase()}
                </span>
              </div>

              
            </div>
            <div className="col-span-4 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                <h3 className="text-sm font-semibold text-slate-800 mb-4">
                  OCR Summary
                </h3>

                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-slate-500">Engine</p>
                    <p className="font-medium text-slate-800">
                      {document.ocr_metadata.engine_used}
                    </p>
                  </div>

                
                </div>
              </div>

              {/* PROCESSED IMAGE */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-5 py-4 border-b">
                  <h3 className="text-sm font-semibold text-slate-800">
                    Pre-Processed Image
                  </h3>
                  <p className="text-xs text-slate-500">
                    Input sent to OCR engine
                  </p>
                </div>

                <div className="p-4 bg-slate-50">
                  
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b">
              <h2 className="text-sm font-semibold text-slate-800">
                Extracted Text
              </h2>
              <p className="text-xs text-slate-500">
                Parsed & normalized OCR output
              </p>
            </div>

            <pre className="p-6 text-sm leading-relaxed text-slate-800 whitespace-pre-wrap max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 bg-slate-50">
              {Array.isArray(document.extracted_text)
                ? document.extracted_text.join("\n\n")
                : document.extracted_text || "No OCR text available"}
            </pre>
          </div>
        </div>