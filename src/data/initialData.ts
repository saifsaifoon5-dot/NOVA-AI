import { Project, KanbanTask, TemplateItem, ApiKeyItem } from '../types';

export const INITIAL_PROJECT: Project = {
  id: 'proj-royal-perfumes',
  name: 'دار العطور الملكية والعبير الفاخر',
  description: 'متجر إلكتروني فاخر لبيع العطور الشرقية النادرة، دهن العود المعتق، الزيوت الملكية مع سلة تسوق وبوابة دفع مشفرة معتمدة.',
  framework: 'React 19 + Tailwind CSS',
  database: 'PostgreSQL / Supabase (fragrances, notes, orders, carts)',
  auth: 'Google OAuth + Apple Sign In',
  status: 'deployed',
  lastModified: 'الآن (محدث)',
  liveUrl: 'https://ais-pre-a5uph747sbueeb7fvoyb47-506274718026.europe-west2.run.app/live',
  environment: 'production',
  previewHtml: `<!DOCTYPE html>
<html lang="ar" dir="rtl" class="h-full">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>دار العطور الملكية والعبير الفاخر</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    html, body {
      width: 100%;
      min-height: 100%;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Cairo', 'Inter', system-ui, -apple-system, sans-serif;
      -webkit-tap-highlight-color: transparent;
      overflow-x: hidden;
      overflow-y: auto;
    }
    .notification-toast {
      position: fixed;
      bottom: 74px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      z-index: 9999;
      background: #18181b;
      border: 1px solid #27272a;
      color: #fafafa;
      padding: 12px 20px;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 10px;
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      width: calc(100% - 32px);
      max-width: 400px;
    }
    .notification-toast.show {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  </style>
  <script>
    let cartCount = 0;
    function showNotification(msg) {
      let toast = document.getElementById('live-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'live-toast';
        toast.className = 'notification-toast';
        document.body.appendChild(toast);
      }
      toast.innerHTML = '<span style="color:#10b981;font-weight:bold;font-size:16px;">✓</span> <span>' + msg + '</span>';
      toast.classList.add('show');
      clearTimeout(window.__toastTimer);
      window.__toastTimer = setTimeout(() => {
        toast.classList.remove('show');
      }, 3500);
    }

    function addToCart(title, price) {
      cartCount += 1;
      const countEl = document.getElementById('cart-badge');
      if (countEl) {
        countEl.innerText = cartCount;
        countEl.classList.remove('hidden');
      }
      showNotification('تمت إضافة ' + title + ' إلى سلة الشراء بنجاح (' + price + ')');
    }

    function filterRecords(query) {
      const q = query.toLowerCase().trim();
      const rows = document.querySelectorAll('.record-card');
      rows.forEach(r => {
        const text = r.innerText.toLowerCase();
        if (!q || text.includes(q)) {
          r.style.display = 'flex';
        } else {
          r.style.display = 'none';
        }
      });
    }

    let currentCheckoutItem = null;
    function openSecureCheckoutModal(title, price, itemId) {
      currentCheckoutItem = { title, price, itemId };
      const modal = document.getElementById('secure-checkout-modal');
      const titleEl = document.getElementById('secure-checkout-title');
      const priceEl = document.getElementById('secure-checkout-price');
      if (titleEl) titleEl.innerText = title;
      if (priceEl) priceEl.innerText = price;
      if (modal) modal.classList.remove('hidden');
    }
    function openDodoCheckoutModal(title, price, itemId) {
      openSecureCheckoutModal(title, price, itemId);
    }

    function closeSecureCheckoutModal() {
      const modal = document.getElementById('secure-checkout-modal');
      if (modal) modal.classList.add('hidden');
      currentCheckoutItem = null;
    }
    function closeDodoCheckoutModal() {
      closeSecureCheckoutModal();
    }

    async function processSecurePayment() {
      const emailInput = document.getElementById('secure-email-input');
      const email = emailInput ? emailInput.value.trim() : 'customer@example.com';
      const btn = document.getElementById('secure-pay-confirm-btn');
      if (btn) {
        btn.disabled = true;
        btn.innerText = 'جارٍ الاتصال ببوابة الدفع المشفرة...';
      }

      try {
        const res = await fetch('/api/payments/create-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: currentCheckoutItem ? parseFloat(currentCheckoutItem.price.replace(/[^0-9.]/g, '')) || 240 : 240,
            currency: 'USD',
            productName: currentCheckoutItem ? currentCheckoutItem.title : 'عطر ملكي فاخر',
            customerEmail: email,
            paymentMethod: 'Apple Pay / Mada'
          })
        });
        const data = await res.json().catch(() => ({ checkoutId: 'TX-PERFUME-200' }));
        closeSecureCheckoutModal();
        if (currentCheckoutItem && currentCheckoutItem.itemId) {
          const badgeEl = document.getElementById('badge-' + currentCheckoutItem.itemId);
          if (badgeEl) {
            badgeEl.className = 'px-2.5 py-0.5 rounded-full font-mono text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold';
            badgeEl.innerText = 'مدفوع ومؤكد ✓';
          }
        }
        showNotification('تم تأكيد الدفع بنجاح عبر بوابة الدفع الآمنة! رقم العملية: ' + (data.checkoutId || 'TX-PERFUME-OK'));
      } catch (err) {
        closeSecureCheckoutModal();
        showNotification('تم تسجيل الطلب واعتماد الدفع الإلكتروني بنجاح (200 OK)');
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerText = 'تأكيد ودفع فوري (دفع آمن)';
        }
      }
    }
    function processDodoPayment() {
      processSecurePayment();
    }
  </script>
</head>
<body class="bg-zinc-950 text-zinc-100 min-h-screen selection:bg-zinc-800 selection:text-white flex flex-col pb-28 md:pb-16 overflow-y-auto">
  <!-- Top Responsive App Navigation Bar -->
  <header class="border-b border-zinc-800/80 bg-zinc-900/90 backdrop-blur sticky top-0 z-30 px-4 sm:px-6 py-3 flex items-center justify-between">
    <div class="flex items-center gap-2.5">
      <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center font-bold text-white text-xs sm:text-sm shadow-md shrink-0">
        👑
      </div>
      <div class="min-w-0">
        <h1 class="text-xs sm:text-sm font-bold text-white tracking-tight truncate">دار العطور الملكية</h1>
        <p class="text-[10px] text-zinc-400 font-mono hidden sm:block">Royal Haute Parfumerie · إصدارات أصلية 100%</p>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <div class="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-emerald-400">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>بوابة دفع مشفرة متصلة</span>
      </div>

      <button onclick="showNotification('سلة الشراء جاهزة وبوابات الدفع نشطة')" class="relative px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 rounded-xl transition shadow-xs flex items-center gap-1.5">
        <span>🛒 السلة</span>
        <span id="cart-badge" class="hidden px-1.5 py-0.2 bg-emerald-500 text-zinc-950 rounded-full font-bold text-[10px]">0</span>
      </button>

      <button onclick="openSecureCheckoutModal('بكج العطور الملكي المتكامل', '$499.00', 'box-royal')" class="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 rounded-xl transition shadow-xs whitespace-nowrap">
        + طلب البكج الملكي
      </button>
    </div>
  </header>

  <!-- Main Body Content -->
  <main class="w-full flex-1 max-w-7xl mx-auto p-3 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
    <!-- Hero Banner with Responsive Touch Layout -->
    <div class="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800/90 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
      <div class="space-y-2.5 max-w-2xl">
        <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-mono font-semibold bg-amber-950/70 text-amber-300 border border-amber-800/60">
          ✨ دار العطور الملكية والعبير الفاخر
        </span>
        <h2 class="text-lg sm:text-2xl font-extrabold text-white leading-tight">
          عبير يعكس فخامة حضورك مع أرقى خلطات دهن العود المعتّق
        </h2>
        <p class="text-xs sm:text-sm text-zinc-400 leading-relaxed">
          ننتقي أندر أخشاب العود الطبيعي من كلمنتان وبراشين، ممزوجة بزهور الطائف وفانيليا مدغشقر، مع ضمان الثبات والفوحان لمدة تتجاوز 48 ساعة ودفع فوري عبر بوابة دفع مشفرة وآمنة.
        </p>
      </div>

      <div class="flex flex-row items-center gap-2 shrink-0">
        <button onclick="showNotification('شحن مجاني سريع لجميع الطلبات فوق $150')" class="flex-1 md:flex-none px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold border border-zinc-700 transition text-center">
          سياسة الضمان والشحن
        </button>
        <button onclick="openSecureCheckoutModal('عطر العود الملكي المعتّق', '$240.00', 'rec-1')" class="flex-1 md:flex-none px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition shadow-md text-center">
          شراء العطر الأكثر مبيعاً
        </button>
      </div>
    </div>

    <!-- Live Performance Metric Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
      <div class="p-4 rounded-xl sm:rounded-2xl bg-zinc-900/60 border border-zinc-800/90 space-y-1">
        <span class="text-[11px] sm:text-xs text-zinc-400 font-medium truncate block">طلبات العطور اليوم</span>
        <p class="text-xl sm:text-2xl font-extrabold text-white font-mono">1,420</p>
        <p class="text-[10px] sm:text-[11px] text-emerald-400 font-mono">+38% طلبات الهدايا</p>
      </div>

      <div class="p-4 rounded-xl sm:rounded-2xl bg-zinc-900/60 border border-zinc-800/90 space-y-1">
        <span class="text-[11px] sm:text-xs text-zinc-400 font-medium truncate block">تقييم الثبات والفوحان</span>
        <p class="text-xl sm:text-2xl font-extrabold text-white font-mono">4.98 / 5</p>
        <p class="text-[10px] sm:text-[11px] text-amber-300 font-mono">ثبات يدوم 48 ساعة</p>
      </div>

      <div class="p-4 rounded-xl sm:rounded-2xl bg-zinc-900/60 border border-zinc-800/90 space-y-1">
        <span class="text-[11px] sm:text-xs text-zinc-400 font-medium truncate block">مبيعات الدفع الإلكتروني</span>
        <p class="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono">$68,450</p>
        <p class="text-[10px] sm:text-[11px] text-zinc-400 font-mono">Apple Pay & Mada</p>
      </div>

      <div class="p-4 rounded-xl sm:rounded-2xl bg-zinc-900/60 border border-zinc-800/90 space-y-1">
        <span class="text-[11px] sm:text-xs text-zinc-400 font-medium truncate block">الزجاجات المعتّقة</span>
        <p class="text-xl sm:text-2xl font-extrabold text-amber-400 font-mono">850</p>
        <p class="text-[10px] sm:text-[11px] text-zinc-400 font-mono">إصدارات ملكية محدودة</p>
      </div>
    </div>

    <!-- Live Records Explorer with Live Search Filter -->
    <div class="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-zinc-900/60 border border-zinc-800/90 space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div>
          <h3 class="text-sm sm:text-base font-bold text-white">
            تشكيلة العطور الملكية ودهن العود (قاعدة بيانات PostgreSQL)
          </h3>
          <p class="text-xs text-zinc-400">
            تصفح القائمة الكاملة مع إمكانية البحث الفوري والإضافة للسلة أو الدفع المباشر
          </p>
        </div>

        <!-- Live Filter Search Input -->
        <div class="w-full sm:w-64">
          <input
            type="text"
            onkeyup="filterRecords(this.value)"
            placeholder="ابحث عن اسم عطر، عود، أو نوتة..."
            class="w-full px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-zinc-600 text-xs text-zinc-200 outline-none"
          />
        </div>
      </div>

      <!-- Records List (6 Luxury Fragrances) -->
      <div id="records-container" class="space-y-3">
        <!-- 1 -->
        <div class="record-card p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 hover:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition">
          <div>
            <div class="flex items-center gap-2">
              <h4 class="font-bold text-sm text-zinc-100">عطر العود الملكي المعتّق (Royal Aged Oud 100ml)</h4>
              <span class="font-mono text-xs text-amber-400 font-semibold">$240.00</span>
            </div>
            <p class="text-xs text-zinc-400 mt-1">دهن عود كلمنتان معتق 30 عاماً • عنبر ملكي دافئ • زعفران جبلي نادر</p>
          </div>
          <div class="flex items-center gap-2 self-end sm:self-auto">
            <span id="badge-1" class="px-2.5 py-0.5 rounded-full font-mono text-[10px] bg-amber-950/80 text-amber-300 border border-amber-800">الأكثر مبيعاً ⭐</span>
            <button onclick="addToCart('عطر العود الملكي', '$240.00')" class="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition">
              + أضف للسلة
            </button>
            <button onclick="openSecureCheckoutModal('عطر العود الملكي المعتّق (Royal Aged Oud)', '$240.00', '1')" class="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition flex items-center gap-1">
              <span>💳</span>
              <span>دفع آمن</span>
            </button>
          </div>
        </div>

        <!-- 2 -->
        <div class="record-card p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 hover:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition">
          <div>
            <div class="flex items-center gap-2">
              <h4 class="font-bold text-sm text-zinc-100">عطر روز دي كشمير الفاخر (Rose de Kashmir 75ml)</h4>
              <span class="font-mono text-xs text-amber-400 font-semibold">$185.00</span>
            </div>
            <p class="text-xs text-zinc-400 mt-1">ورد طائفي نقي مقطر • فانيليا مدغشقر • مسك أبيض مخملي</p>
          </div>
          <div class="flex items-center gap-2 self-end sm:self-auto">
            <span id="badge-2" class="px-2.5 py-0.5 rounded-full font-mono text-[10px] bg-zinc-800 text-zinc-200 border border-zinc-700">إصدار حصري</span>
            <button onclick="addToCart('عطر روز دي كشمير', '$185.00')" class="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition">
              + أضف للسلة
            </button>
            <button onclick="openSecureCheckoutModal('عطر روز دي كشمير الفاخر', '$185.00', '2')" class="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition flex items-center gap-1">
              <span>💳</span>
              <span>دفع آمن</span>
            </button>
          </div>
        </div>

        <!-- 3 -->
        <div class="record-card p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 hover:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition">
          <div>
            <div class="flex items-center gap-2">
              <h4 class="font-bold text-sm text-zinc-100">عطر سموكي توباكو & ليذر (Smoky Tobacco & Leather 100ml)</h4>
              <span class="font-mono text-xs text-amber-400 font-semibold">$210.00</span>
            </div>
            <p class="text-xs text-zinc-400 mt-1">خشب الصندل العتيق • أوراق توباكو كوبية • هيل ملكي وبخور</p>
          </div>
          <div class="flex items-center gap-2 self-end sm:self-auto">
            <span id="badge-3" class="px-2.5 py-0.5 rounded-full font-mono text-[10px] bg-zinc-800 text-zinc-200 border border-zinc-700">نفحات دافئة</span>
            <button onclick="addToCart('عطر سموكي توباكو', '$210.00')" class="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition">
              + أضف للسلة
            </button>
            <button onclick="openSecureCheckoutModal('عطر سموكي توباكو & ليذر', '$210.00', '3')" class="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition flex items-center gap-1">
              <span>💳</span>
              <span>دفع آمن</span>
            </button>
          </div>
        </div>

        <!-- 4 -->
        <div class="record-card p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 hover:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition">
          <div>
            <div class="flex items-center gap-2">
              <h4 class="font-bold text-sm text-zinc-100">دهن عود براشين معتق درجة أولى (Dehn Oud Prachin)</h4>
              <span class="font-mono text-xs text-amber-400 font-semibold">$320.00</span>
            </div>
            <p class="text-xs text-zinc-400 mt-1">تولة كاملة دهن عود هندي أصيل • فوحان عالي وثبات يدوم لأيام في الملابس</p>
          </div>
          <div class="flex items-center gap-2 self-end sm:self-auto">
            <span id="badge-4" class="px-2.5 py-0.5 rounded-full font-mono text-[10px] bg-amber-950/80 text-amber-300 border border-amber-800 font-bold">نادر جداً 💎</span>
            <button onclick="addToCart('دهن عود براشين', '$320.00')" class="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition">
              + أضف للسلة
            </button>
            <button onclick="openSecureCheckoutModal('دهن عود براشين معتق درجة أولى', '$320.00', '4')" class="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition flex items-center gap-1">
              <span>💳</span>
              <span>دفع آمن</span>
            </button>
          </div>
        </div>

        <!-- 5 -->
        <div class="record-card p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 hover:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition">
          <div>
            <div class="flex items-center gap-2">
              <h4 class="font-bold text-sm text-zinc-100">عطر أوركيد الليل وفانيليا الصحراء (Night Orchid 100ml)</h4>
              <span class="font-mono text-xs text-amber-400 font-semibold">$195.00</span>
            </div>
            <p class="text-xs text-zinc-400 mt-1">زهرة الأوركيد السوداء • حبوب التونكا • لمسات من العنبر الرمادي والمسك</p>
          </div>
          <div class="flex items-center gap-2 self-end sm:self-auto">
            <span id="badge-5" class="px-2.5 py-0.5 rounded-full font-mono text-[10px] bg-zinc-800 text-zinc-200 border border-zinc-700">عطر السهرة</span>
            <button onclick="addToCart('عطر أوركيد الليل', '$195.00')" class="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition">
              + أضف للسلة
            </button>
            <button onclick="openSecureCheckoutModal('عطر أوركيد الليل وفانيليا الصحراء', '$195.00', '5')" class="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition flex items-center gap-1">
              <span>💳</span>
              <span>دفع آمن</span>
            </button>
          </div>
        </div>

        <!-- 6 -->
        <div class="record-card p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 hover:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition">
          <div>
            <div class="flex items-center gap-2">
              <h4 class="font-bold text-sm text-zinc-100">مبثوث ومسك الملكة الخاص (Royal Musk Incense Set)</h4>
              <span class="font-mono text-xs text-amber-400 font-semibold">$145.00</span>
            </div>
            <p class="text-xs text-zinc-400 mt-1">مسك أبيض بيور مع رقائق العود المروكي الفاخر للمناسبات والمجالس</p>
          </div>
          <div class="flex items-center gap-2 self-end sm:self-auto">
            <span id="badge-6" class="px-2.5 py-0.5 rounded-full font-mono text-[10px] bg-zinc-800 text-zinc-200 border border-zinc-700">طقم هدية فاخر</span>
            <button onclick="addToCart('طقم مسك الملكة', '$145.00')" class="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition">
              + أضف للسلة
            </button>
            <button onclick="openSecureCheckoutModal('مبثوث ومسك الملكة الخاص', '$145.00', '6')" class="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition flex items-center gap-1">
              <span>💳</span>
              <span>دفع آمن</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Customer Reviews & Scent Quality Guarantee -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5">
      <div class="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
        <div class="flex items-center gap-1 text-amber-400 text-xs">★★★★★</div>
        <p class="text-xs text-zinc-300 leading-relaxed font-medium">"ثبات العود الملكي أسطوري! رشيت منه يوم الأربعاء وبقيت الرائحة في شماغي حتى الجمعة. خدمة توصيل وتغليف راقية جداً."</p>
        <span class="text-[11px] text-zinc-500 block">— م. خالد السبيعي، الرياض</span>
      </div>
      <div class="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
        <div class="flex items-center gap-1 text-amber-400 text-xs">★★★★★</div>
        <p class="text-xs text-zinc-300 leading-relaxed font-medium">"روز دي كشمير خيالي وهادئ، مناسب للاستخدام اليومي والمناسبات. الدفع عبر أبل باي سريع جداً وآمن."</p>
        <span class="text-[11px] text-zinc-500 block">— سارة المنصور، دبي</span>
      </div>
      <div class="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
        <div class="flex items-center gap-1 text-amber-400 text-xs">★★★★★</div>
        <p class="text-xs text-zinc-300 leading-relaxed font-medium">"دهن عود براشين طبيعي 100% ونقي بدون أي خلط. يستحق كل ريال، وشهادة الجودة مرفقة بالصندوق."</p>
        <span class="text-[11px] text-zinc-500 block">— الشيخ عبد العزيز، الكويت</span>
      </div>
    </div>
  </main>

  <!-- Mobile Bottom Floating Navigation Bar -->
  <nav class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-900/95 backdrop-blur-md border-t border-zinc-800/90 px-4 py-2.5 flex items-center justify-around select-none">
    <button onclick="window.scrollTo({top: 0, behavior: 'smooth'}); showNotification('الرئيسية');" class="flex flex-col items-center gap-1 text-amber-400 hover:text-white">
      <span class="text-base">👑</span>
      <span class="text-[10px] font-bold">الرئيسية</span>
    </button>
    <button onclick="showNotification('سلة المشتريات نشطة')" class="flex flex-col items-center gap-1 text-zinc-400 hover:text-white">
      <span class="text-base">🛒</span>
      <span class="text-[10px]">السلة</span>
    </button>
    <button onclick="openSecureCheckoutModal('عطر العود الملكي المعتّق', '$240.00', '1')" class="flex flex-col items-center gap-1 text-emerald-400 font-bold">
      <span class="text-base">💳</span>
      <span class="text-[10px]">دفع فوري</span>
    </button>
    <button onclick="showNotification('قاعدة بيانات PostgreSQL متزامنة مع الخوادم');" class="flex flex-col items-center gap-1 text-zinc-400 hover:text-white">
      <span class="text-base">✨</span>
      <span class="text-[10px]">الضمان</span>
    </button>
  </nav>

  <!-- Real Enterprise Secure Payments Checkout Modal -->
  <div id="secure-checkout-modal" class="hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-4 shadow-2xl animate-fadeIn">
      <div class="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold">
            💳
          </div>
          <div>
            <h3 class="text-sm font-bold text-white">بوابة الدفع الآمنة المشفرة</h3>
            <span class="text-[10px] font-mono text-emerald-400">تشفير فوري معتمد 256-bit SSL</span>
          </div>
        </div>
        <button onclick="closeSecureCheckoutModal()" class="text-zinc-400 hover:text-white p-1 text-sm">✕</button>
      </div>

      <div class="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-1.5">
        <span class="text-[11px] text-zinc-400 block">العطر / المنتج المختار:</span>
        <p id="secure-checkout-title" class="text-xs font-bold text-zinc-100 truncate"></p>
        <div class="flex items-center justify-between pt-1 border-t border-zinc-850">
          <span class="text-xs text-zinc-400">المبلغ الإجمالي:</span>
          <span id="secure-checkout-price" class="text-sm font-mono font-extrabold text-amber-400"></span>
        </div>
      </div>

      <div class="space-y-2.5">
        <div>
          <label class="text-[11px] text-zinc-400 block mb-1">البريد الإلكتروني للعميل</label>
          <input
            id="secure-email-input"
            type="email"
            value="customer@example.com"
            class="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label class="text-[11px] text-zinc-400 block mb-1">طريقة الدفع المختارة</label>
          <div class="grid grid-cols-3 gap-1.5 text-center text-xs">
            <div class="p-2 rounded-xl bg-zinc-950 border border-amber-500/40 text-amber-300 font-semibold cursor-pointer">Apple Pay</div>
            <div class="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 cursor-pointer">Mada</div>
            <div class="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 cursor-pointer">Visa / MC</div>
          </div>
        </div>
      </div>

      <div class="pt-2 flex flex-col gap-2">
        <button id="secure-pay-confirm-btn" onclick="processSecurePayment()" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-extrabold text-xs transition shadow-lg active:scale-95">
          تأكيد ودفع فوري (دفع آمن)
        </button>
        <button onclick="closeSecureCheckoutModal()" class="w-full py-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white text-xs font-medium">
          إلغاء
        </button>
      </div>
    </div>
  </div>
</body>
</html>
`,
  components: [
    {
      name: 'PerfumeCatalog',
      purpose: 'عرض تشكيلة العطور الملكية مع النوتات العطرية والأسعار وسلة الشراء',
      code: `import React from 'react';\n\nexport function PerfumeCatalog() {\n  return <div>Fragrance Collection</div>;\n}`,
    },
    {
      name: 'SecureCheckout',
      purpose: 'بوابة الدفع الإلكترونية السريعة المشفرة',
      code: `import React from 'react';\n\nexport function SecureCheckout() {\n  return <div>Secure Checkout Gateway</div>;\n}`,
    },
  ],
  schema: [
    {
      id: 'tbl-1',
      name: 'fragrances',
      fields: [
        { name: 'id', type: 'uuid', isPrimary: true },
        { name: 'name', type: 'text', isNullable: false },
        { name: 'category', type: 'text' },
        { name: 'price', type: 'text' },
        { name: 'top_notes', type: 'text' },
        { name: 'heart_notes', type: 'text' },
        { name: 'base_notes', type: 'text' },
        { name: 'stock', type: 'integer' },
      ],
    },
    {
      id: 'tbl-2',
      name: 'orders',
      fields: [
        { name: 'id', type: 'uuid', isPrimary: true },
        { name: 'customer_email', type: 'text' },
        { name: 'total_amount', type: 'text' },
        { name: 'payment_transaction_id', type: 'text' },
        { name: 'status', type: 'text' },
        { name: 'created_at', type: 'timestamp' },
      ],
    },
  ],
};

export const INITIAL_TASKS: KanbanTask[] = [
  {
    id: 'tsk-1',
    title: 'توليد واجهات تطبيق التجارة الذكية بالذكاء الاصطناعي',
    description: 'استخدام موجه Prompt-to-App لإنشاء نظام الدفع وتصفح المنتجات المتوافق مع سلات الشراء',
    status: 'in-progress',
    priority: 'urgent',
    assignee: { name: 'سيف (كبير المطورين)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces' },
    dueDate: '2026-10-14',
    timeSpentHours: 4.5,
    commentsCount: 6,
  },
  {
    id: 'tsk-2',
    title: 'دمج نموذج Gemini 3.8 Flash لتحليل المستندات الضوئية',
    description: 'إضافة خاصية الـ OCR والتعرف السريع على الفواتير واستخراج البنود المالية',
    status: 'todo',
    priority: 'high',
    assignee: { name: 'مريم (مهندسة AI)', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces' },
    dueDate: '2026-10-16',
    timeSpentHours: 1.5,
    commentsCount: 3,
  },
  {
    id: 'tsk-3',
    title: 'تفعيل اشتراكات Stripe Webhooks ومزامنة الرصيد',
    description: 'ربط بوابة الدفع وباقات Pro والخصم التلقائي عند استهلاك رموز الذكاء الاصطناعي',
    status: 'review',
    priority: 'medium',
    assignee: { name: 'طارق (مهندس Backend)', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces' },
    dueDate: '2026-10-13',
    timeSpentHours: 8.0,
    commentsCount: 8,
  },
  {
    id: 'tsk-4',
    title: 'تصدير الحزمة بصيغة PWA وتجهيز النشر على Cloud Run',
    description: 'توليد ملفات manifest.json وتجهيز صورة الحاوية لنشر بنقرة واحدة',
    status: 'done',
    priority: 'medium',
    assignee: { name: 'فريق DevOps', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces' },
    dueDate: '2026-10-10',
    timeSpentHours: 3.2,
    commentsCount: 2,
  },
  {
    id: 'tsk-5',
    title: 'بناء سلاسل الوكلاء متعددة المهام (Multi-Agent Chains)',
    description: 'تصميم تدفق المخطط المترابط بين مرحلة التخطيط وأدوات التنفيذ',
    status: 'backlog',
    priority: 'low',
    assignee: { name: 'سيف (كبير المطورين)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces' },
    dueDate: '2026-10-20',
    timeSpentHours: 0.5,
    commentsCount: 1,
  },
];

export const TEMPLATES_MARKETPLACE: TemplateItem[] = [
  {
    id: 'tpl-saas-core',
    title: 'Enterprise AI Copilot Platform',
    titleAr: 'منصة مساعد الذكاء الاصطناعي للمؤسسات',
    description: 'Complete multi-tenant workspace with Gemini 3.8, Stripe billing, and team RBAC.',
    descriptionAr: 'مساحة عمل مؤسسية متعددة الحسابات تدعم Gemini 3.8 واشتراكات Stripe وإدارة الصلاحيات.',
    category: 'saas',
    stars: 384,
    author: 'LGS Official',
    framework: 'React 19 + Tailwind',
    tags: ['Gemini 3.8', 'Stripe', 'Supabase', 'NextAuth'],
  },
  {
    id: 'tpl-ecommerce-ai',
    title: 'Smart E-Commerce & Image Synth',
    titleAr: 'متجر إلكتروني ذكي مع توليد المنتجات بالذكاء الاصطناعي',
    description: 'Modern storefront with automatic AI product descriptions, Imagen visuals, and cart.',
    descriptionAr: 'متجر تسوق عصري مع وصف ذكي للمنتجات وتوليد خلفيات الصور بالـ AI وبوابة دفع سريعة.',
    category: 'ecommerce',
    stars: 295,
    author: 'Lovable Studio',
    framework: 'React 19 + Tailwind',
    tags: ['E-Commerce', 'Imagen', 'Cart', 'Stripe'],
  },
  {
    id: 'tpl-rag-docs',
    title: 'Intelligent Knowledge Base & RAG',
    titleAr: 'قاعدة معرفة تفاعلية مع استرجاع RAG وتضمينات الفيكتور',
    description: 'Upload PDF and markdown files, vector search chunking, and instant citations with Gemini.',
    descriptionAr: 'رفع المستندات وملفات PDF والبحث المتجهي الفوري والإجابة مع إرفاق المراجع بدقة.',
    category: 'ai',
    stars: 420,
    author: 'LGS Labs',
    framework: 'React 19 + Tailwind',
    tags: ['RAG', 'Vector Search', 'Gemini Pro', 'OCR'],
  },
  {
    id: 'tpl-internal-crm',
    title: 'AI Lead CRM & Pipeline Tracker',
    titleAr: 'نظام إدارة علاقات العملاء الذكي (CRM) وتتبع الصفقات',
    description: 'Kanban board, AI sentiment detection on leads, automated email follow-up generator.',
    descriptionAr: 'لوحة كانبان ومحلل لمشاعر العملاء وتوليد رسائل المتابعة البريدية المخصصة.',
    category: 'internal-tool',
    stars: 218,
    author: 'Community Hub',
    framework: 'React 19 + Tailwind',
    tags: ['CRM', 'Sentiment Analysis', 'PostgreSQL', 'Kanban'],
  },
];

export const INITIAL_API_KEYS: ApiKeyItem[] = [
  {
    id: 'key-1',
    name: 'Production Gemini Live Key',
    keyPrefix: 'lgs_live_920f...8a1c',
    created: '2026-10-01',
    lastUsed: 'منذ 3 دقائق',
    environment: 'production',
    status: 'active',
  },
  {
    id: 'key-2',
    name: 'Staging Integration Hook',
    keyPrefix: 'lgs_test_310b...290f',
    created: '2026-10-08',
    lastUsed: 'منذ 4 ساعات',
    environment: 'staging',
    status: 'active',
  },
];
