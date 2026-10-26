// Offline contract tests. No real Telegram calls, reviews, or credentials.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function compile(file, dependencies, env = {}) {
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(source, {
    module, exports: module.exports, Buffer, console: { error() {}, warn() {} },
    process: { env },
    require(name) { if (name in dependencies) return dependencies[name]; throw Error(`Unexpected dependency ${name}`); },
  }, { filename: file });
  return module.exports;
}
const escapeHtml = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const formatting = compile('src/lib/reviewMessage.ts', { './telegram': { escapeHtml } });

function fixture(status = 'pending') {
  const docs = new Map([['review-1', {
    _id: 'review-1', _rev: '1', _type: 'review', status, author: 'Тест', rating: 5,
    text: '<original>', itemName: 'Orion 2', itemSlug: 'orion', categorySlug: 'keyboards', telegramMessageId: 50,
  }]]);
  const state = { role: 'administrator', calls: [], writes: 0, invalidations: 0, failWrite: false, failEdit: false, race: false };
  const clone = x => x ? JSON.parse(JSON.stringify(x)) : null;
  const writeClient = {
    async fetch(query, { id }) { return clone(docs.get(id)); },
    patch(id) {
      let rev, changes;
      return {
        ifRevisionId(value) { rev = value; return this; },
        set(value) { changes = value; return this; },
        async commit() {
          if (state.failWrite) throw Object.assign(Error('Unavailable'), { statusCode: 503 });
          if (state.race) { docs.get(id).status = 'rejected'; docs.get(id)._rev = 'race'; state.race = false; }
          if (docs.get(id)._rev !== rev) throw Object.assign(Error('Conflict'), { statusCode: 409 });
          docs.set(id, { ...docs.get(id), ...changes, _rev: String(Number(rev) + 1) }); state.writes++;
        },
      };
    },
    async createOrReplace(value) { docs.set(value._id, { ...value, _rev: 'session' }); },
    async delete(id) { docs.delete(id); },
  };
  const telegram = {
    isConfiguredChat: chat => chat?.id === -100,
    async telegramCall(method, payload) {
      state.calls.push({ method, payload });
      if (method === 'getChatMember') return { status: state.role };
      if (method === 'getMe') return { username: 'review_test_bot' };
      if (method === 'sendMessage') return { message_id: 100 + state.calls.length };
      if (method === 'editMessageText' && state.failEdit) throw Error('Temporary failure');
      return true;
    },
  };
  const route = compile('src/app/api/telegram/webhook/route.ts', {
    'next/server': { NextResponse: { json: (body, options) => ({ body, status: options?.status ?? 200 }) } },
    'node:crypto': require('node:crypto'),
    '@/lib/sanityWriteClient': { writeClient }, '@/lib/telegram': telegram,
    '@/lib/reviewMessage': formatting,
    '@/lib/revalidate': { async revalidateProductWithRating() { state.invalidations++; } },
  }, { TELEGRAM_WEBHOOK_SECRET: 'offline-test-secret', TELEGRAM_CHAT_ID: '-100', VERCEL_BRANCH_URL: 'preview.example' });
  const post = (update, secret = 'offline-test-secret') => route.POST({ headers: { get: () => secret }, json: async () => update });
  const callback = (action = 'a', userId = 7, chatId = -100) => ({
    update_id: 10, callback_query: { id: 'callback', data: `rv:${action}:review-1`, from: { id: userId }, message: { message_id: 50, chat: { id: chatId } } },
  });
  const privateMessage = (text, replyId, update_id = 20) => ({ update_id, message: {
    message_id: update_id, from: { id: 7 }, chat: { id: 7, type: 'private' }, text,
    ...(replyId ? { reply_to_message: { message_id: replyId } } : {}),
  } });
  const startReply = async () => {
    await post(privateMessage('/start reply_review-1'));
    return docs.get('reviewReplySession.7')?.promptMessageId;
  };
  return { docs, state, post, callback, privateMessage, startReply };
}

test('wrong or missing secret rejects before API calls', async () => {
  const f = fixture();
  assert.equal((await f.post(f.callback(), '')).status, 401);
  assert.equal((await f.post(f.callback(), 'wrong')).status, 401);
  assert.equal(f.state.calls.length, 0);
});
test('signed no-op health update does not mutate or send messages', async () => {
  const f = fixture(); assert.equal((await f.post({ update_id: -1 })).status, 200);
  assert.equal(f.state.calls.length, 0); assert.equal(f.state.writes, 0);
});
test('approves old callback and replaces buttons with private reply link', async () => {
  const f = fixture(); assert.equal((await f.post(f.callback())).status, 200);
  assert.equal(f.docs.get('review-1').status, 'approved');
  const edit = f.state.calls.find(c => c.method === 'editMessageText').payload;
  assert.equal(edit.reply_markup.inline_keyboard[0][0].url, 'https://t.me/review_test_bot?start=reply_review-1');
  assert.match(edit.text, /&lt;original&gt;/); assert.equal(f.state.invalidations, 1);
});
test('reject removes moderation buttons', async () => {
  const f = fixture(); await f.post(f.callback('r'));
  assert.equal(f.docs.get('review-1').status, 'rejected');
  assert.equal(f.state.calls.find(c => c.method === 'editMessageText').payload.reply_markup.inline_keyboard.length, 0);
});
test('repeated and conflicting clicks cannot overwrite decision', async () => {
  const f = fixture(); await f.post(f.callback()); await f.post(f.callback('r'));
  assert.equal(f.docs.get('review-1').status, 'approved'); assert.equal(f.state.writes, 1);
  assert.equal(f.state.invalidations, 2);
});
test('subscriber and wrong chat cannot moderate', async () => {
  const f = fixture(); f.state.role = 'member'; await f.post(f.callback());
  f.state.role = 'administrator'; await f.post(f.callback('a', 7, -200));
  assert.equal(f.state.writes, 0); assert.equal(f.docs.get('review-1').status, 'pending');
});
test('concurrent moderation preserves first committed decision', async () => {
  const f = fixture(); f.state.race = true; await f.post(f.callback());
  assert.equal(f.docs.get('review-1').status, 'rejected'); assert.equal(f.state.writes, 0);
});
test('real write failures return 500 for Telegram retry', async () => {
  const f = fixture(); f.state.failWrite = true;
  assert.equal((await f.post(f.callback())).status, 500);
  assert.equal(f.docs.get('review-1').status, 'pending');
});
test('retry recovers Telegram edit after decision already saved', async () => {
  const f = fixture(); f.state.failEdit = true;
  assert.equal((await f.post(f.callback())).status, 500);
  f.state.failEdit = false; assert.equal((await f.post(f.callback())).status, 200);
  assert.equal(f.state.writes, 1);
});
test('private reply saves text and replaces channel reply button with edit', async () => {
  const f = fixture('approved'); const prompt = await f.startReply();
  assert.ok(prompt); assert.equal((await f.post(f.privateMessage('Дякуємо <3', prompt, 21))).status, 200);
  assert.equal(f.docs.get('review-1').reply.text, 'Дякуємо <3');
  const edit = f.state.calls.find(c => c.method === 'editMessageText').payload;
  assert.match(edit.text, /Дякуємо &lt;3/); assert.match(edit.reply_markup.inline_keyboard[0][0].text, /Змінити/);
});
test('reply retry is idempotent after channel update failure', async () => {
  const f = fixture('approved'); const prompt = await f.startReply(); f.state.failEdit = true;
  const update = f.privateMessage('Дякуємо!', prompt, 21);
  assert.equal((await f.post(update)).status, 500); f.state.failEdit = false;
  assert.equal((await f.post(update)).status, 200); assert.equal(f.state.writes, 1);
});
test('pending and rejected reviews cannot receive replies', async () => {
  for (const status of ['pending', 'rejected']) { const f = fixture(status); await f.startReply(); assert.equal(f.docs.has('reviewReplySession.7'), false); }
});
test('non-admin cannot start reply or use an existing session', async () => {
  const f = fixture('approved'); const prompt = await f.startReply(); f.state.role = 'member';
  await f.post(f.privateMessage('Unauthorized', prompt, 21)); assert.equal(f.state.writes, 0);
});
test('stale prompt cannot overwrite another moderator reply', async () => {
  const f = fixture('approved'); const prompt = await f.startReply();
  f.docs.get('review-1')._rev = 'other'; f.docs.get('review-1').reply = { text: 'Existing' };
  await f.post(f.privateMessage('Replace', prompt, 21));
  assert.equal(f.docs.get('review-1').reply.text, 'Existing'); assert.equal(f.state.writes, 0);
});
test('wrong prompt, oversized and expired replies do not publish', async () => {
  const f = fixture('approved'); const prompt = await f.startReply();
  await f.post(f.privateMessage('Wrong prompt', 999, 21));
  await f.post(f.privateMessage('x'.repeat(1001), prompt, 22));
  f.docs.get('reviewReplySession.7').expiresAt = '2000-01-01';
  await f.post(f.privateMessage('Expired', prompt, 23)); assert.equal(f.state.writes, 0);
});
test('cancel clears pending reply', async () => {
  const f = fixture('approved'); await f.startReply(); await f.post(f.privateMessage('/cancel'));
  assert.equal(f.docs.has('reviewReplySession.7'), false);
});
test('reply rendering uses text nodes and translated store label', () => {
  const React = require('react');
  const Empty = () => null;
  const Wrapper = ({ children }) => React.createElement('div', null, children);
  const Reviews = compile('src/components/productPage/reviews/Reviews.tsx', {
    react: React, 'react/jsx-runtime': require('react/jsx-runtime'),
    'next-intl': { useLocale: () => 'uk', useTranslations: () => key => key === 'storeReply' ? 'Відповідь Kondor' : key },
    '@/components/homePage/hero/AnimationWrapper': { default: Wrapper },
    '@/components/shared/buttons/Button': { default: Wrapper }, '@/components/shared/StarRating': { default: Empty },
    '@/components/shared/icons/IconStar': { default: Empty },
    '@/utils/productSectionNavigation': { scrollToProductSection() {} },
    '@/store/modalStore': { useModalStore: () => () => {} }, '@/utils/formatRating': { formatRating: n => n || 0 },
    './WriteReviewForm': { default: Empty },
  }).default;
  const html = require('react-dom/server').renderToStaticMarkup(React.createElement(Reviews, {
    itemId: 'item', ratingCount: 1, ratingAvg: 5, reviews: [{ id: '1', author: 'Test', rating: 5,
      text: 'Review', date: '2026-10-25', reply: { text: '<script>alert(1)</script>', date: '2026-10-25' } }],
  }));
  assert.match(html, /Відповідь Kondor/); assert.match(html, /&lt;script&gt;/); assert.doesNotMatch(html, /<script>/);
});
