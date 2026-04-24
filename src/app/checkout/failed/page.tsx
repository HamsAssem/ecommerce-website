import Link from "next/link";

export default function FailedPage({ searchParams }: { searchParams: { order?: string } }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center font-almarai" dir="rtl">
      <div className="w-20 h-20 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-6 text-4xl">✕</div>
      <h1 className="text-3xl font-black mb-3">فشلت عملية الدفع</h1>
      {searchParams.order && <p className="text-gray-600 mb-6">رقم الطلب: <span className="font-bold">{searchParams.order}</span></p>}
      <p className="text-gray-600 mb-8">لم يتم خصم أي مبلغ. يرجى المحاولة مرة أخرى أو اختيار طريقة دفع مختلفة.</p>
      <Link href="/checkout" className="inline-block bg-black text-white font-bold px-8 py-3 rounded-full hover:bg-gray-800">المحاولة مرة أخرى</Link>
    </div>
  );
}
