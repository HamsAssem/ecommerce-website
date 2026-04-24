export const metadata = { title: "سياسة الخصوصية | Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 font-almarai leading-8" dir="rtl">
      <h1 className="text-4xl font-black mb-6">سياسة الخصوصية</h1>
      <p className="text-gray-700">
        نحن في يلا ستور نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضح هذه السياسة الطريقة
        التي نجمع بها بياناتك ونستخدمها ونحميها.
      </p>
      <h2 className="text-2xl font-bold mt-8 mb-3">البيانات التي نجمعها</h2>
      <p className="text-gray-700">الاسم، رقم الهاتف، البريد الإلكتروني، وعنوان الشحن لإتمام الطلبات.</p>
      <h2 className="text-2xl font-bold mt-8 mb-3">كيف نستخدم بياناتك</h2>
      <p className="text-gray-700">لتنفيذ الطلبات، تحسين الخدمة، والتواصل معك بخصوص طلباتك.</p>
      <h2 className="text-2xl font-bold mt-8 mb-3">المدفوعات</h2>
      <p className="text-gray-700">
        نعتمد على بوابة Paymob لمعالجة المدفوعات الإلكترونية بأعلى معايير الأمان (PCI-DSS).
        لا نقوم بتخزين بيانات بطاقتك الائتمانية على خوادمنا.
      </p>
    </div>
  );
}
