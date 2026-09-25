import React, { useState } from 'react';
import { PackageX, AlertTriangle, ShieldAlert, FileText, Ban, Trash2, CheckCircle2 } from 'lucide-react';
import { DiscontinuedProduct } from '../../types';
import { gpcAudio } from '../../lib/audioEngine';

interface ProductsArchiveViewProps {
  products: DiscontinuedProduct[];
}

export const ProductsArchiveView: React.FC<ProductsArchiveViewProps> = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState<DiscontinuedProduct | null>(products[0]);

  return (
    <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 font-mono text-xs text-slate-200 bg-[#06080e] scrollbar-thin">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#182335] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <PackageX className="w-5 h-5 text-amber-400" />
            <h1 className="text-base md:text-lg font-bold text-white tracking-wider">
              DISCONTINUED & RECALLED PRODUCTS ARCHIVE
            </h1>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Classified Incident Audits, Casualty Statistics & Concrete Sarcophagus Disposal Logs
          </p>
        </div>

        <span className="text-[11px] px-2.5 py-1 bg-amber-950/40 border border-amber-600/60 rounded text-amber-300 font-bold self-start md:self-auto">
          8 WITHDRAWN HARDWARE LINES
        </span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Selected Product Detail */}
        <div className="lg:col-span-2 space-y-4">
          {selectedProduct && (
            <div className="p-5 bg-[#0a0e18] border border-amber-500/40 rounded-lg shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1c273c] pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-400 text-sm font-mono">
                      {selectedProduct.modelCode}
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-600 font-bold">
                      RECALLED {selectedProduct.recallYear}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-white">{selectedProduct.name}</h2>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">RELEASE DURATION:</span>
                  <span className="text-slate-300 font-bold">
                    {selectedProduct.releaseYear} — {selectedProduct.recallYear}
                  </span>
                </div>
              </div>

              {/* Product Metadata */}
              <div className="grid grid-cols-2 gap-2.5 bg-[#070b13] border border-[#182335] p-3 rounded text-[10px]">
                <div>
                  <span className="text-slate-500 block">INTENDED MARKET:</span>
                  <span className="text-slate-200">{selectedProduct.intendedMarket}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">PATENT REGISTRATION:</span>
                  <span className="text-cyan-300 font-mono">{selectedProduct.patentNumber}</span>
                </div>
              </div>

              {/* Advertised Function */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">
                  ADVERTISED COMMERCIAL FUNCTION:
                </span>
                <p className="text-[11px] text-slate-300 bg-[#070b13] p-3 rounded border border-[#182335] leading-relaxed">
                  {selectedProduct.advertisedFunction}
                </p>
              </div>

              {/* Actual Discovered Anomaly */}
              <div className="space-y-1">
                <span className="text-[10px] text-rose-400 font-bold block uppercase flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  DISCOVERED OPERATIONAL ANOMALY & FAILURE MODE:
                </span>
                <p className="text-[11px] text-rose-200 bg-rose-950/20 p-3 rounded border border-rose-600/40 leading-relaxed font-mono">
                  {selectedProduct.actualAnomaly}
                </p>
              </div>

              {/* Casualty & Settlement Figures */}
              <div className="p-3.5 bg-[#0e1422] border-l-2 border-amber-500 rounded space-y-1">
                <span className="text-[10px] text-amber-400 font-bold block uppercase">
                  ESTIMATED CASUALTIES & LITIGATION SETTLEMENTS:
                </span>
                <p className="text-[11px] text-slate-200 font-bold">
                  {selectedProduct.casualtyEstimate}
                </p>
              </div>

              {/* Disposal Protocol */}
              <div className="space-y-1 border-t border-[#182335] pt-3">
                <span className="text-[10px] text-slate-400 font-bold block flex items-center gap-1.5">
                  <Trash2 className="w-3.5 h-3.5 text-slate-500" />
                  MANDATORY DISPOSAL & RETROACTIVE REDACTION PROTOCOL:
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {selectedProduct.disposalProtocol}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Product List */}
        <div className="space-y-2">
          <div className="p-2.5 bg-[#0a0e18] border border-[#1b263b] rounded-lg font-bold text-xs text-white">
            RECALLED HARDWARE ({products.length})
          </div>

          <div className="space-y-1.5 max-h-[700px] overflow-y-auto pr-1 scrollbar-thin">
            {products.map((prod) => {
              const isSelected = selectedProduct?.id === prod.id;
              return (
                <div
                  key={prod.id}
                  onClick={() => {
                    gpcAudio.playUiSound('click');
                    setSelectedProduct(prod);
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-amber-950/40 border-amber-400 text-white shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : 'bg-[#0a0e18] hover:bg-[#0e1524] border-[#1b263b] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="space-y-0.5 min-w-0">
                    <span className="font-bold text-amber-300 text-[11px] font-mono">{prod.modelCode}</span>
                    <h3 className="font-bold text-xs truncate text-slate-200">{prod.name}</h3>
                    <p className="text-[10px] text-slate-500 truncate">{prod.recallYear} Recall</p>
                  </div>

                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 shrink-0 font-bold">
                    RECALLED
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
