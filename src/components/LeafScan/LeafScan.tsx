import { useMemo, useState } from 'react';
import { Camera, RotateCcw, Trash2, Upload } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const scanOptions = [
  {
    diagnosis: 'Tomato Early Blight',
    confidence: '94.8%',
    remedy: 'Trim infected sections, rotate crops, and apply copper fungicide every 10 days.'
  },
  {
    diagnosis: 'Healthy Rice Leaf',
    confidence: '98.2%',
    remedy: 'Maintain balanced irrigation, use zinc-rich fertilizer, and monitor for pests.'
  },
  {
    diagnosis: 'Sugarcane Leaf Spot',
    confidence: '91.4%',
    remedy: 'Remove affected leaves, avoid overhead watering, and spray with neem-based solutions.'
  }
];

export default function LeafScan() {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<typeof scanOptions[0] | null>(null);

  const currentResult = useMemo(() => {
    if (result) return result;
    return scanOptions[0];
  }, [result]);

  const handleFile = (selected: File) => {
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setResult(null);
  };

  const handleRemove = () => {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
  };

  const handleVerify = () => {
    if (!file) return;
    setIsLoading(true);
    setTimeout(() => {
      const randomResult = scanOptions[Math.floor(Math.random() * scanOptions.length)];
      setResult(randomResult);
      setIsLoading(false);
    }, 2000);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files.length) {
      handleFile(event.dataTransfer.files[0]);
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-emerald-700">{t('leafScanner')}</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">{t('verifyHealth')}</h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-3xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900 shadow-sm">
            <Camera className="h-4 w-4" />
            {t('takePhoto')}
          </div>
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={(event) => event.preventDefault()}
          className="rounded-[2rem] border-2 border-dashed border-emerald-200 bg-emerald-50/80 p-8 text-center transition hover:border-emerald-300"
        >
          <Upload className="mx-auto mb-4 h-11 w-11 text-emerald-600" />
          <p className="text-lg font-semibold text-slate-900">{t('dragDropHint')}</p>
          <p className="mt-2 text-sm text-slate-600">{t('noImageUploaded')}</p>
          <label className="mt-6 inline-flex cursor-pointer items-center justify-center rounded-3xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800">
            {t('uploadImage') || 'Upload Image'}
            <input
              type="file"
              accept="image/png, image/jpeg"
              capture="environment"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </label>
        </div>

        {previewUrl && (
          <div className="mt-8 grid gap-6 lg:grid-cols-[280px_auto]">
            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-4 shadow-sm">
              <img src={previewUrl} alt="Leaf preview" className="h-72 w-full rounded-[1.5rem] object-cover" />
              <div className="mt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleRemove}
                  className="inline-flex items-center gap-2 rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  <Trash2 className="h-4 w-4" />
                  {t('removeImage')}
                </button>
                <button
                  type="button"
                  onClick={handleVerify}
                  className="inline-flex items-center gap-2 rounded-3xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  <RotateCcw className="h-4 w-4" />
                  {t('verifyHealth')}
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              {isLoading ? (
                <div className="flex min-h-[280px] flex-col items-center justify-center gap-4">
                  <div className="h-14 w-14 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
                  <p className="text-center text-base font-medium text-slate-700">{t('analyzeLoading')}</p>
                </div>
              ) : result ? (
                <div className="space-y-5">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-emerald-700">{t('diagnosis')}</p>
                    <h3 className="mt-2 text-2xl font-semibold text-slate-900">{currentResult.diagnosis}</h3>
                  </div>
                  <div className="rounded-3xl bg-emerald-50 p-5 text-slate-700 shadow-sm">
                    <p className="text-sm font-semibold text-emerald-700">{t('confidenceScore')}</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">{currentResult.confidence}</p>
                  </div>
                  <div className="space-y-3 rounded-3xl bg-slate-50 p-5 text-slate-700 shadow-sm">
                    <p className="text-sm font-semibold text-emerald-700">{t('remedy')}</p>
                    <p className="leading-7">{currentResult.remedy}</p>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[240px] flex-col items-center justify-center gap-4 text-slate-500">
                  <p>{t('noImageUploaded')}</p>
                  <p className="text-sm">Upload a leaf image and click verify to see instant results.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
