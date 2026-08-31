/**
 * Імітує оновлений флоу checkout:
 * Telegram → KeyCRM → Google Sheets → Wayforpay invoice
 * Після кожного кроку перевіряє, що замовлення вже є в KeyCRM.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env.local");
const env = fs.readFileSync(envPath, "utf8");
const getEnv = (key) => {
  const m = env.match(new RegExp(`^${key}=(.*)$`, "m"));
  if (!m) return "";
  let v = m[1].trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1);
  }
  return v;
};

const BASE_URL = getEnv("NEXT_PUBLIC_BASE_URL") || "http://localhost:3000/";
const CRM_API_KEY = getEnv("CRM_API_KEY");
const CRM_API_URL = "https://openapi.keycrm.app/v1";

const orderNumber = String(Math.floor(Math.random() * 900000 + 100000));
const now = new Date();
const orderDate = `${now.toLocaleDateString("uk-UA")} ${now.toLocaleTimeString("uk-UA")}`;
const orderedAtIso = now.toISOString();

const testOrder = {
  orderNumber,
  orderDate,
  orderedAtIso,
  name: "ТЕСТ",
  surname: "Флоу KeyCRM",
  phone: "+380000000099",
  city: "Київ",
  postOffice: "Відділення №1 (тест)",
  payment: "Онлайн оплата (Wayforpay)",
  promocode: null,
  totalSum: 1,
  product: {
    generalName: "ТЕСТ",
    name: "перевірка інтеграції",
    color: "—",
    code: "TEST-FLOW",
    actualPrice: 1,
    quantity: 1,
  },
};

const orderedListProducts = `- ${testOrder.product.generalName} ${testOrder.product.name}, колір: ${testOrder.product.color}`;

const dataTelegram =
  `<b>🧪 ТЕСТОВЕ ЗАМОВЛЕННЯ — можна ігнорувати</b>\n` +
  `<b>Замовлення #${orderNumber}</b>\n` +
  `<b>Дата замовлення:</b> ${orderDate}\n` +
  `<b>Ім'я:</b> ${testOrder.name}\n` +
  `<b>Прізвище:</b> ${testOrder.surname}\n` +
  `<b>Телефон:</b> ${testOrder.phone}\n` +
  `<b>Насeлений пункт:</b> ${testOrder.city}\n` +
  `<b>Відділення Нової пошти:</b> ${testOrder.postOffice}\n` +
  `<b>Промокод:</b> \n` +
  `<b>Оплата:</b> ${testOrder.payment}\n` +
  `<b>Список товарів:</b>\n${orderedListProducts}\n` +
  `<b>Сума замовлення:</b> ${testOrder.totalSum} грн\n` +
  `<b>Utm source:</b> test-flow\n`;

const crmOrderData = {
  source_id: 2,
  source_uuid: orderNumber,
  orderedAt: orderedAtIso,
  promocode: null,
  buyer: {
    full_name: `${testOrder.name} ${testOrder.surname}`,
    phone: testOrder.phone,
  },
  shipping: {
    shipping_service: "Нова пошта",
    shipping_address_city: testOrder.city,
    shipping_receive_point: testOrder.postOffice,
  },
  products: [
    {
      price: testOrder.product.actualPrice,
      quantity: testOrder.product.quantity,
      name: `${testOrder.product.generalName} ${testOrder.product.name}`,
      sku: testOrder.product.code,
    },
  ],
  payments: [
    {
      payment_method: testOrder.payment,
      amount: testOrder.totalSum,
      status: "not_paid",
    },
  ],
  marketing: { utm_source: "test-flow" },
};

const dataGoogle = {
  orderDate,
  orderNumber,
  name: testOrder.name,
  surname: testOrder.surname,
  phone: testOrder.phone,
  city: testOrder.city,
  postOffice: testOrder.postOffice,
  promocode: "",
  payment: testOrder.payment,
  orderedListProducts,
  totalSum: testOrder.totalSum,
};

const results = {
  orderNumber,
  steps: [],
  keycrmBeforeWayforpay: null,
  keycrmAfterFlow: null,
  wayforpayInvoice: null,
};

async function postJson(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  return { ok: res.ok, status: res.status, data };
}

async function getKeyCrmOrder(sourceUuid) {
  const url = new URL(`${CRM_API_URL}/order`);
  url.searchParams.set("filter[source_uuid]", sourceUuid);
  url.searchParams.set("include", "payments,products,buyer,marketing");
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${CRM_API_KEY}`,
      Accept: "application/json",
    },
  });
  const data = await res.json();
  return data?.data?.[0] ?? null;
}

function logStep(name, ok, detail = "") {
  const icon = ok ? "✅" : "❌";
  console.log(`${icon} ${name}${detail ? `: ${detail}` : ""}`);
  results.steps.push({ name, ok, detail });
}

try {
  console.log(`\n🧪 Тестове замовлення #${orderNumber}\n`);

  // 1. Telegram
  const telegram = await postJson(`${BASE_URL}api/telegram`, dataTelegram);
  logStep(
    "1. Telegram",
    telegram.ok,
    telegram.ok ? "повідомлення надіслано" : JSON.stringify(telegram.data)
  );
  if (!telegram.ok) throw new Error("Telegram failed");

  // 2. KeyCRM (має бути ДО Wayforpay)
  const keycrm = await postJson(`${BASE_URL}api/keycrm`, crmOrderData);
  logStep(
    "2. KeyCRM create",
    keycrm.ok,
    keycrm.ok
      ? `CRM id=${keycrm.data?.id}`
      : JSON.stringify(keycrm.data)
  );
  if (!keycrm.ok) throw new Error("KeyCRM create failed");

  const crmAfterCreate = await getKeyCrmOrder(orderNumber);
  results.keycrmBeforeWayforpay = crmAfterCreate;
  logStep(
    "2b. KeyCRM verify (до Wayforpay)",
    Boolean(crmAfterCreate),
    crmAfterCreate
      ? `source_uuid=${crmAfterCreate.source_uuid}, payment=${crmAfterCreate.payment_status}`
      : "не знайдено"
  );
  if (!crmAfterCreate) throw new Error("Order not in KeyCRM before Wayforpay");

  // 3. Google Sheets (best-effort)
  const sheets = await postJson(`${BASE_URL}api/googlesheet`, dataGoogle);
  logStep(
    "3. Google Sheets",
    sheets.ok,
    sheets.ok ? "записано" : JSON.stringify(sheets.data)
  );

  // 4. Wayforpay invoice (без реальної оплати)
  const wayforpay = await postJson(`${BASE_URL}api/wayforpay/invoice`, {
    orderReference: orderNumber,
    orderDate: Math.floor(Date.now() / 1000),
    amount: testOrder.totalSum,
    currency: "UAH",
    productName: [
      `${testOrder.product.generalName} ${testOrder.product.name} колір: ${testOrder.product.color}`,
    ],
    productPrice: [testOrder.product.actualPrice],
    productCount: [testOrder.product.quantity],
  });
  results.wayforpayInvoice = wayforpay.data;
  logStep(
    "4. Wayforpay invoice",
    wayforpay.ok && wayforpay.data?.status === "success",
    wayforpay.ok
      ? `orderReference=${wayforpay.data?.paymentData?.orderReference}`
      : JSON.stringify(wayforpay.data)
  );

  const crmAfterFlow = await getKeyCrmOrder(orderNumber);
  results.keycrmAfterFlow = crmAfterFlow;
  logStep(
    "5. KeyCRM verify (після флоу)",
    Boolean(crmAfterFlow),
    crmAfterFlow
      ? `id=${crmAfterFlow.id}, buyer=${crmAfterFlow.buyer?.full_name}, total=${crmAfterFlow.grand_total}`
      : "не знайдено"
  );

  const flowOrderCorrect =
    crmAfterCreate &&
    crmAfterFlow &&
    crmAfterCreate.id === crmAfterFlow.id &&
    crmAfterFlow.source_uuid === orderNumber &&
    crmAfterFlow.payment_status === "not_paid";

  logStep(
    "6. Порядок флоу",
    flowOrderCorrect,
    flowOrderCorrect
      ? "замовлення в CRM існувало ДО invoice Wayforpay і залишилось not_paid"
      : "перевірка не пройдена"
  );

  console.log("\n--- Підсумок ---");
  console.log(`Номер: #${orderNumber}`);
  console.log(`KeyCRM id: ${crmAfterFlow?.id}`);
  console.log(
    `Помітка: ТЕСТ / Флоу KeyCRM / 🧪 ТЕСТОВЕ ЗАМОВЛЕННЯ — можна ігнорувати`
  );
  console.log(
    flowOrderCorrect
      ? "\n✅ Флоу коректний: Telegram → KeyCRM → Sheets → Wayforpay invoice"
      : "\n❌ Флоу має проблеми — див. кроки вище"
  );

  process.exit(flowOrderCorrect ? 0 : 1);
} catch (error) {
  console.error("\n❌ Помилка тесту:", error.message);
  console.log(JSON.stringify(results, null, 2));
  process.exit(1);
}
