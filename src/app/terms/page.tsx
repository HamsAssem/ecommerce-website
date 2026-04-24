export const metadata = { title: "شروط الاستخدام | Terms of Use" };

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 font-almarai leading-8" dir="rtl">
      <h1 className="text-4xl font-black mb-6">شروط الاستخدام</h1>
      <p className="text-gray-700">
        باستخدامك لموقع يلا ستور فإنك توافق على الشروط والأحكام الموضحة أدناه.
      </p>
      <h2 className="text-2xl font-bold mt-8 mb-3">الطلبات والدفع</h2>
      <p className="text-gray-700">
        تخضع جميع الطلبات للتوفر. نقبل الدفع عند الاستلام ومدفوعات Paymob (بطاقات ائتمان، محافظ إلكترونية).
      </p>
      <h2 className="text-2xl font-bold mt-8 mb-3">الشحن</h2>
      <p className="text-gray-700">يتم الشحن خلال 2-5 أيام عمل بعد تأكيد الطلب.</p>
      <h2 className="text-2xl font-bold mt-8 mb-3">الإرجاع والاستبدال</h2>
      <p className="text-gray-700">يمكنك إرجاع المنتج خلال 14 يوماً من تاريخ الاستلام بشرط أن يكون بحالته الأصلية.</p>
    </div>
  );
}
