import { useState } from 'react';
import { PackageX, AlertTriangle, Trash2 } from 'lucide-react';
import type { DiscontinuedProduct } from '@/types';
import { gpcAudio } from '@/lib/audio/audio-engine';
import { DISCONTINUED_PRODUCTS } from '@/content';
import { ArchivePage } from '@/components/ui/archive-page';
import { ViewHeader } from '@/components/ui/view-header';
import { pickRecord, useRecordParam } from '@/hooks/use-record-param';

const products = DISCONTINUED_PRODUCTS;

export default function ProductsArchivePage() {
  const recordId = useRecordParam();
  const [selectedProduct, setSelectedProduct] = useState<DiscontinuedProduct | null>(() =>
    pickRecord(products, recordId, products[0])
  );

  return (
    <ArchivePage>
      <ViewHeader
        icon={PackageX}
        iconClassName="text-amber-400"
        title="DISCONTINUED & RECALLED PRODUCTS ARCHIVE"
        subtitle="Classified Incident Audits, Casualty Statistics & Concrete Sarcophagus Disposal Logs"
        aside={
          <span className="text-label px-2.5 py-1 bg-amber-950/40 border border-amber-600/60 rounded text-amber-300 font-bold self-start md:self-auto">
            8 WITHDRAWN HARDWARE LINES
          </span>
        }
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Selected Product Detail */}
        <div className="lg:col-span-2 space-y-4">
          {selectedProduct && (
            <div className="p-5 bg-panel border border-amber-500/40 rounded-lg shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line-strong pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-400 text-sm font-mono">
                      {selectedProduct.modelCode}
                    </span>
                    <span className="text-micro px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-600 font-bold">
                      RECALLED {selectedProduct.recallYear}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-white">{selectedProduct.name}</h2>
                </div>

                <div className="text-right">
                  <span className="text-caption text-slate-500 block">RELEASE DURATION:</span>
                  <span className="text-slate-300 font-bold">
                    {selectedProduct.releaseYear} — {selectedProduct.recallYear}
                  </span>
                </div>
              </div>

              {/* Product Metadata */}
              <div className="grid grid-cols-2 gap-2.5 bg-inset border border-line p-3 rounded text-caption">
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
                <span className="text-caption text-slate-400 font-bold block uppercase">
                  ADVERTISED COMMERCIAL FUNCTION:
                </span>
                <p className="text-label text-slate-300 bg-inset p-3 rounded border border-line leading-relaxed">
                  {selectedProduct.advertisedFunction}
                </p>
              </div>

              {/* Actual Discovered Anomaly */}
              <div className="space-y-1">
                <span className="text-caption text-rose-400 font-bold block uppercase flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  DISCOVERED OPERATIONAL ANOMALY & FAILURE MODE:
                </span>
                <p className="text-label text-rose-200 bg-rose-950/20 p-3 rounded border border-rose-600/40 leading-relaxed font-mono">
                  {selectedProduct.actualAnomaly}
                </p>
              </div>

              {/* Casualty & Settlement Figures */}
              <div className="p-3.5 bg-hover border-l-2 border-amber-500 rounded space-y-1">
                <span className="text-caption text-amber-400 font-bold block uppercase">
                  ESTIMATED CASUALTIES & LITIGATION SETTLEMENTS:
                </span>
                <p className="text-label text-slate-200 font-bold">{selectedProduct.casualtyEstimate}</p>
              </div>

              {/* Disposal Protocol */}
              <div className="space-y-1 border-t border-line pt-3">
                <span className="text-caption text-slate-400 font-bold block flex items-center gap-1.5">
                  <Trash2 className="w-3.5 h-3.5 text-slate-500" />
                  MANDATORY DISPOSAL & RETROACTIVE REDACTION PROTOCOL:
                </span>
                <p className="text-label text-slate-300 leading-relaxed">
                  {selectedProduct.disposalProtocol}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Product List */}
        <div className="space-y-2">
          <div className="p-2.5 bg-panel border border-line-strong rounded-lg font-bold text-xs text-white">
            RECALLED HARDWARE ({products.length})
          </div>

          <div className="space-y-1.5 max-h-[700px] overflow-y-auto pr-1 scrollbar-thin">
            {products.map((prod) => {
              const isSelected = selectedProduct?.id === prod.id;
              return (
                <button
                  type="button"
                  key={prod.id}
                  aria-pressed={isSelected}
                  onClick={() => {
                    gpcAudio.playUiSound('click');
                    setSelectedProduct(prod);
                  }}
                  className={`w-full text-left p-3 rounded-lg border cursor-pointer transition-all flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-amber-950/40 border-amber-400 text-white shadow-glow shadow-amber-500/20'
                      : 'bg-panel hover:bg-hover border-line-strong text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="block space-y-0.5 min-w-0">
                    <span className="font-bold text-amber-300 text-label font-mono">{prod.modelCode}</span>
                    <span className="block font-bold text-xs truncate text-slate-200">{prod.name}</span>
                    <span className="block text-caption text-slate-500 truncate">
                      {prod.recallYear} Recall
                    </span>
                  </span>

                  <span className="text-micro px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 shrink-0 font-bold">
                    RECALLED
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </ArchivePage>
  );
}
