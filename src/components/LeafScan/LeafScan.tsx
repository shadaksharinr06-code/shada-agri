import { useRef, useState } from 'react';
import { Camera, RotateCcw, ShieldCheck, Trash2, Upload } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { callGeminiVision, LeafDiagnosis } from '../../services/gemini';

const SEVERITY_STYLE: Record<string, string> = {
  None: 'bg-emerald-100 text-emerald-700',
  Mild: 'bg-yellow-100 text-yellow-700',
  Moderate: 'bg-orange-100 text-orange-700',
  Severe: 'bg-rose-100 text-rose-700',
};

function toBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.readAsDataURL(file);
    r.onload = () => res((r.result as string).split(',')[1]);
    r.onerror = rej;
  });
}

export default function LeafScan() {
  const { t, language } = useLanguage();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LeafDiagnosis | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setResult(null);
  };

  const handleVerify = async () => {
    if (!file) return;
    setLoading(true);
    const base64 = await toBase64(file);
    const res = await callGeminiVision(base64, file.type, language);
    setResult(res);
    setLoading(false);
  };

  const handleRemove = () => { setFile(null); setPreviewUrl(null); setResult(null); };

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-emerald-700">{t('leafScanner')}</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900">{t('verifyHealth')}</h2>
          </div>
          <button onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-3xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-sm font-medium text-emerald-800 hover:bg-emerald-100 transition">
            <Camera className="h-4 w-4" />{t('takePhoto')}
          </button>
        </div>

        {/* Drop zone */}
        {!previewUrl && (
          <div onDrop={e => { e.preventDefault(); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
            onDragOver={e => e.preventDefault()}
            className="cursor-pointer rounded-[2rem] border-2 border-dashed border-emerald-200 bg-emerald-50/60 p-10 text-center transition hover:border-emerald-400"
            onClick={() => inputRef.current?.click()}>
            <Upload className="mx-auto mb-4 h-12 w-12 text-emerald-500" />
            <p className="text-lg font-semibold text-slate-800">{t('dragDropHint')}</p>
            <p className="mt-2 text-sm text-slate-500">{t('noImageUploaded')}</p>
            <span className="mt-6 inline-flex items-center rounded-3xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white">
              {t('uploadImage')}
            </span>
          </div>
        )}

        <input ref={inputRef} type="file" accept="image/*" capture="environment" className="sr-only"
          onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />

        {/* Preview + result */}
        {previewUrl && (
          <div className="mt-4 grid gap-6 lg:grid-cols-[300px_1fr]">
            <div className="space-y-4">
              <img src={previewUrl} alt="Leaf preview" className="h-72 w-full rounded-[2rem] object-cover shadow-sm" />
              <div className="flex gap-3">
                <button onClick={handleRemove}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition">
                  <Trash2 className="h-4 w-4" />{t('removeImage')}
                </button>
                <button onClick={handleVerify} disabled={loading}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-3xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800 transition disabled:opacity-60">
                  <RotateCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />{t('verifyHealth')}
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-100 bg-slate-50 p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-4 h-full min-h-[200px]">
                  <div className="h-14 w-14 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
                  <p className="text-sm font-medium text-slate-600">{t('analyzeLoading')}</p>
                </div>
              ) : result ? (
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-emerald-700">{t('diagnosis')}</p>
                      <h3 className="mt-1 text-xl font-semibold text-slate-900">{result.disease}</h3>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${SEVERITY_STYLE[result.severity] ?? 'bg-slate-100 text-slate-700'}`}>
                      {result.severity}
                    </span>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-3">
                    <p className="text-xs font-semibold text-emerald-700">{t('confidenceScore')}</p>
                    <p className="mt-1 text-3xl font-bold text-slate-900">{result.confidence}</p>
                  </div>
                  <div className="rounded-2xl bg-white border border-slate-100 p-4">
                    <p className="text-xs font-semibold text-slate-500 mb-2">{result.description}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                      <ShieldCheck className="h-4 w-4" />{t('recoverySteps')}
                    </p>
                    {result.steps.map((step, i) => (
                      <div key={i} className="flex gap-3 rounded-2xl bg-white border border-slate-100 p-3 text-sm text-slate-700">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">{i + 1}</span>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 h-full min-h-[200px] text-slate-400">
                  <ShieldCheck className="h-12 w-12" />
                  <p className="text-sm">Click "Verify Health" to analyse the leaf.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
