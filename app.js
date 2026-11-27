{
'use strict';
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const newId = () => Math.random().toString(36).slice(2, 10);
const KEY = 'introcard-maker-v2';
const OLD_KEY = 'introcard-maker-v1';

/* ───────── 테마 ───────── */
const P = (bg, surface, text, sub, accent, chip, chipText, line, deco) => ({bg, surface, text, sub, accent, chip, chipText, line, deco});
const THEMES = {
  simple:{name:'심플', desc:'여백과 가는 선의 깔끔한 기본형', font:'Noto Sans KR', tfont:'Outfit', ktf:'', pals:[
    ['화이트', P('#ffffff','#f5f5f7','#1c1c1f','#7a7a83','#1c1c1f','#1c1c1f','#ffffff','#e6e6ea','#1c1c1f')],
    ['차콜',  P('#17171a','#222226','#f2f2f4','#9a9aa3','#ffffff','#f2f2f4','#17171a','#303036','#f2f2f4')],
    ['스카이', P('#f6f8fd','#ffffff','#18233a','#6d7891','#3d6bff','#3d6bff','#ffffff','#dfe6f5','#3d6bff')],
    ['로즈',  P('#fdf6f7','#ffffff','#3a2329','#9a7a82','#e0587f','#fde1e8','#b23a5e','#f1dbe1','#e0587f')],
    ['세이지', P('#f4f6f1','#ffffff','#253020','#74806c','#5f7f52','#e2ead9','#3f5a35','#dce2d4','#5f7f52')],
  ]},
  diary:{name:'다이어리', desc:'줄 노트, 폴라로이드, 마스킹테이프', font:'Gowun Dodum', tfont:'Gaegu', ktf:'', pals:[
    ['크림',  P('#e8dfcf','#fffdf7','#3d3530','#9a8c80','#ff8fa3','#ffe1e7','#b04a63','#dde7f1','#f7c8d2')],
    ['라벤더', P('#ddd7ea','#fdfcff','#35304a','#8c86a3','#8f7cf0','#ebe6ff','#5b49c2','#e7e3f5','#c9bff7')],
    ['민트',  P('#d6e6dd','#fbfffc','#2a3c34','#7d958a','#2fb38a','#dcf5ea','#1d7a5d','#dcefe6','#a5e3cc')],
    ['밤 일기', P('#18171e','#27262f','#eeeaf6','#a29fb3','#ffcf6e','#3a3846','#ffcf6e','#34323d','#7d7594')],
  ]},
  cinema:{name:'시네마', desc:'레터박스와 필름 스트립, 엔딩 크레딧', font:'Noto Sans KR', tfont:'Oswald', ktf:'', pals:[
    ['누아르', P('#0e0e0f','#050505','#ececec','#8d8d90','#ffffff','#ececec','#0e0e0f','#2a2a2c','#000000')],
    ['골드',  P('#14100b','#070503','#f3e9d2','#a8977a','#d9b25f','#d9b25f','#14100b','#3a2f20','#000000')],
    ['네온',  P('#0b1016','#04070a','#e6f2f5','#7f98a3','#3fe0cf','#ff8a4c','#0b1016','#1d2a33','#000000')],
    ['세피아', P('#1b150f','#0d0a07','#f0e2c6','#a7926f','#e3b672','#f0e2c6','#1b150f','#3b2f22','#0a0806')],
  ]},
  board:{name:'디텍티브 보드', desc:'코르크 보드에 핀과 붉은 실', font:'IBM Plex Sans KR', tfont:'Special Elite', ktf:'', pals:[
    ['코르크',    P('#b9895b','#fbf8f0','#2b2622','#7d736a','#d1362f','#2b2622','#fbf8f0','#e3dccd','#5b3b23')],
    ['다크 펠트',  P('#2c3a36','#f3efe4','#26221e','#7a7166','#e6c34a','#26221e','#f3efe4','#ddd5c4','#1a1614')],
    ['화이트보드', P('#e9edf1','#ffffff','#1f2731','#6e7a88','#2d6cdf','#1f2731','#ffffff','#dfe5ec','#9aa5b1')],
  ]},
  mag:{name:'매거진', desc:'큰 제목과 굵은 선의 에디토리얼', font:'Noto Sans KR', tfont:'Playfair Display', ktf:'Hahmlet', pals:[
    ['클래식', P('#f5f1ea','#ebe5da','#161412','#6f675d','#c41e3a','#161412','#f5f1ea','#161412','#c41e3a')],
    ['모노',  P('#ffffff','#f2f2f2','#000000','#666666','#000000','#000000','#ffffff','#000000','#000000')],
    ['인디고', P('#f3f4f8','#e5e8f1','#141a33','#5f6685','#3346c8','#141a33','#f3f4f8','#141a33','#3346c8')],
    ['다크',  P('#121212','#1d1d1d','#f1ede6','#9a958d','#ff5a36','#f1ede6','#121212','#f1ede6','#ff5a36')],
  ]},
};
THEMES.sns = {name:'SNS 화면', desc:'앱 상단바, 게시물 카드, 해시태그', font:'Noto Sans KR', tfont:'Noto Sans KR', ktf:'', pals:[
    ['라이트', P('#f5f7f9','#ffffff','#0f1419','#6b7680','#3a8dff','#e8f2ff','#1f6fe0','#e3e8ec','#0f1419')],
    ['딤',    P('#15202b','#1c2733','#f2f5f7','#8b98a5','#4aa3ff','#22364a','#9fd0ff','#2c3a47','#f2f5f7')],
    ['블랙',  P('#000000','#121316','#e9ecef','#7d848c','#3a8dff','#16263b','#8ec2ff','#25282d','#e9ecef')],
    ['핑크',  P('#fff6f9','#ffffff','#2b1720','#94707f','#ff5c93','#ffe3ee','#d63a72','#f5dfe7','#2b1720')],
    ['그린',  P('#f4faf7','#ffffff','#10241b','#62786d','#00a86b','#dff5ea','#008653','#dcebe3','#10241b')],
  ]};
THEMES.museum = {name:'미술관', desc:'전시 벽면과 조명, 이미지마다 액자 선택', font:'Gowun Batang', tfont:'DM Serif Display', ktf:'Hahmlet', pals:[
    ['아이보리', P('#ece6dc','#fbf9f5','#2a2622','#857c70','#8a6a2f','#2a2622','#fbf9f5','#c9bfae','#d8cfbf')],
    ['그레이',  P('#dedede','#fafafa','#1e1e1e','#767676','#1e1e1e','#1e1e1e','#fafafa','#b9b9b9','#c9c9c9')],
    ['딥 그린', P('#1f3029','#f6f2e8','#f1ece1','#a9b6ad','#d8b86a','#d8b86a','#1f3029','#3c5148','#172520')],
    ['버건디',  P('#45191f','#f8f1ea','#f6ebe3','#cfa6a8','#e2c27a','#e2c27a','#45191f','#64303a','#36121a')],
  ]};
THEMES.space = {name:'우주', desc:'별이 찍힌 검은 우주, 위성과 우주비행사', font:'IBM Plex Sans KR', tfont:'Space Grotesk', ktf:'', pals:[
    ['딥 스페이스', P('#05060a','#0f131d','#e8ecf5','#8b93a7','#9fb7ff','#1a2135','#cfdaff','#232b3f','#e9ecf2')],
    ['화성',      P('#08060a','#16110f','#f3e9e2','#a2938a','#ff8a5c','#2a1a14','#ffc3a8','#33251f','#e9e3de')],
    ['문라이트',   P('#060607','#131316','#f0f0f2','#8e8e96','#ffffff','#232327','#f0f0f2','#2a2a2f','#e9e9ec')],
    ['지구광',    P('#03080c','#0b161d','#e4f2f5','#86a0a8','#5fd3e8','#10242d','#bdf2fb','#1c3039','#e6eef0')],
  ]};
const FRAMES = {theme:'테마 기본', none:'액자 없음', gold:'금색 클래식', silver:'은색', wood:'원목', black:'블랙 + 매트', white:'화이트 + 매트', round:'원형 금테', oval:'타원 금테'};
const COLOR_KEYS = [['bg','배경'],['surface','면·카드'],['text','글자'],['sub','보조 글자'],['accent','포인트'],['chip','키워드 배경'],['chipText','키워드 글자'],['line','선·무늬'],['deco','장식']];

/* ───────── 글꼴 ───────── */
const FONTS = {
  'Noto Sans KR':['본고딕','wght@400;700;900'], 'IBM Plex Sans KR':['IBM Plex','wght@400;700'], 'Gowun Dodum':['고운돋움',''],
  'Nanum Myeongjo':['나눔명조','wght@400;700;800'], 'Gowun Batang':['고운바탕','wght@400;700'], 'Hahmlet':['함렛','wght@400;700'],
  'Gaegu':['개구 (손글씨)','wght@400;700'], 'Nanum Pen Script':['나눔손글씨 펜',''], 'Do Hyeon':['도현',''], 'Jua':['주아',''], 'Black Han Sans':['검은고딕',''],
  'Outfit':['Outfit','wght@400;700;800'], 'Bebas Neue':['Bebas Neue',''], 'Oswald':['Oswald','wght@500;700'], 'Cinzel':['Cinzel','wght@600;700'],
  'Playfair Display':['Playfair Display','wght@700'], 'DM Serif Display':['DM Serif Display',''], 'Special Elite':['Special Elite (타자기)',''],
  'Courier Prime':['Courier Prime','wght@400;700'], 'Space Grotesk':['Space Grotesk','wght@500;700'],
};
const KR_FONTS = Object.keys(FONTS).slice(0, 11);
const RATIOS = {'2:1':2, '16:9':16/9, '3:2':1.5, '4:3':4/3, '1:1':1, '4:5':.8, '3:4':.75};
const TAG_KEYS = ['account','genre','dream'];
const CAP_SCALE = [1.15, 1, .92, .84, .76, .7];
const KIND_NAMES = {plain:'텍스트', bubble:'말풍선', line:'외곽선 말풍선', quote:'인용구', memo:'메모지', tape:'테이프'};
const KIND_DEF = {
  plain: {w:440, size:40, rot:0,  align:'left',   bold:true,  text:'텍스트를 입력하세요'},
  bubble:{w:360, size:28, rot:0,  align:'left',   bold:false, text:'말풍선 대사를 적어 주세요!', tail:'bl', tl:80, tw:90, tip:-20, tx:15},
  line:  {w:360, size:28, rot:0,  align:'left',   bold:false, text:'외곽선 말풍선이에요', tail:'br', tl:80, tw:90, tip:20, tx:15},
  quote: {w:520, size:30, rot:0,  align:'left',   bold:false, text:'좋아하는 대사나 문장을 넣어 보세요.', by:'출처'},
  memo:  {w:280, size:24, rot:-3, align:'left',   bold:false, text:'메모지에 한마디'},
  tape:  {w:300, size:24, rot:-4, align:'center', bold:true,  text:'LABEL'},
};

const mkTags = (list, on = []) => list.map(t => ({t, on:on.includes(t)}));
const DEFAULT_TAGS = {account:['RT','마음','구독'], genre:['1차','2차','드림'], dream:['ONLY','CBC','OPEN','ALL','HL','GL','BL','CP','NCP']};
function defaults(){
  return {
    v:2,
    profile:null, header:null, showHeader:true, headerH:220, headerPos:50, headerX:50, headerZoom:100, pfShape:'circle', pfSize:150, pfX:50, pfY:50, pfZoom:100,
    nick:'닉네임', uid:'@your_id', align:'left',
    titles:{account:'ACCOUNT',genre:'GENRE',dream:'DREAM',about:'ABOUT',caution:'CAUTION',ng:'NG',fav:'FAVORITE'},
    tags:{
      account:mkTags(DEFAULT_TAGS.account, ['RT','마음']),
      genre:  mkTags(DEFAULT_TAGS.genre, ['2차','드림']),
      dream:  mkTags(DEFAULT_TAGS.dream, ['OPEN','HL']),
    },
    tagLayout:'list', tagFix1:true,
    about:'주력 장르, 트윗 성향 등',
    caution:'계정 관련 주의사항 등',
    ng:'못 보는 요소 등',
    pairNG:true,
    favs:[], favCols:2, favRatio:'3/4', cap:'below', favCenter:true, frameDef:'theme', decoOn:true, srcPos:'right',
    objs:[],
    theme:'simple', pal:0, c:{...THEMES.simple.pals[0][1]},
    font:'', tfont:'', fs:100, chipStyle:'theme', radius:18,
    layout:'left', split:42, galign:'center', width:1600, ratio:'16:9',
  };
}
let S = defaults();
let sel = null;
let scale = 1;
const T = () => THEMES[S.theme] || THEMES.simple;
const W = () => S.width;

/* ───────── 이미지 유틸 ───────── */
function dataToURL(d){
  const [h, b] = d.split(',');
  const mime = (h.match(/:(.*?);/) || [,'image/png'])[1];
  const bin = atob(b); const u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return URL.createObjectURL(new Blob([u], {type:mime}));
}
function loadImage(file, max){
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onerror = rej;
    r.onload = () => {
      const im = new Image();
      im.onerror = rej;
      im.onload = () => {
        const k = Math.min(1, max / Math.max(im.width, im.height));
        if (k === 1 && file.size < 1.5e6 && /^image\/(png|jpeg|webp|gif)$/.test(file.type)) return res({data:r.result, ratio:im.height / im.width});
        const c = document.createElement('canvas');
        c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        const alpha = /png|gif|webp|svg/.test(file.type);  // SVG 등은 PNG로 변환해 저장
        res({data:c.toDataURL(alpha ? 'image/png' : 'image/jpeg', .92), ratio:im.height / im.width});
      };
      im.src = r.result;
    };
    r.readAsDataURL(file);
  });
}
const imgObj = d => ({data:d, url:dataToURL(d)});
const dropURL = () => {};   // 되돌리기에서 다시 쓸 수 있도록 이미지 주소를 해제하지 않음
function alpha(hex, a){
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map(x => x + x).join('') : h.slice(0, 6), 16);
  return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`;
}

/* ───────── 글꼴 스택 ───────── */
const bodyFont = () => S.font || T().font;
const titleFont = () => S.tfont || T().tfont;
const q = f => `'${f}'`;
function stackBody(){ return `${q(bodyFont())}, 'Noto Sans KR', sans-serif`; }
function stackTitle(){
  const t = titleFont(), k = T().ktf;
  return [t, k, bodyFont(), 'Noto Sans KR'].filter((x, i, a) => x && a.indexOf(x) === i).map(q).join(', ') + ', sans-serif';
}
function objFont(o){
  if (o.font === 'body' || !o.font) return stackBody();
  if (o.font === 'title') return stackTitle();
  return `${q(o.font)}, ${stackBody()}`;
}

/* ───────── 카드 렌더 ───────── */
function sec(k, inner, cls = ''){
  const t = S.titles[k].trim();
  return `<section class="sec s-${k} ${cls}">${t ? `<h3>${esc(t)}</h3>` : ''}<div class="bd">${inner}</div></section>`;
}
function tagHTML(k){
  const on = S.tags[k].filter(x => x.on);
  if (!on.length) return '';
  return sec(k, `<div class="chips">${on.map(x => `<span class="chip">${esc(x.t)}</span>`).join('')}</div>`);
}
const txtHTML = k => S[k].trim() ? sec(k, `<p class="txt">${esc(S[k].replace(/\s+$/, ''))}</p>`, 'tsec') : '';
function capHTML(f){
  if (S.cap === 'none' || !(f.genre || f.name || f.source)) return '';
  const main = f.genre || f.name ? `<span class="cl">${f.genre ? `<span class="g">${esc(f.genre)}</span>` : ''}${f.name ? `<b>${esc(f.name)}</b>` : ''}</span>` : '';
  return `<figcaption class="src-${S.srcPos}">${main}${f.source ? `<small>${esc(f.source)}</small>` : ''}</figcaption>`;
}
function frameOf(f){
  let fr = f.frame && f.frame !== 'auto' ? f.frame : S.frameDef;
  if (fr === 'theme') fr = S.theme === 'museum' ? 'gold' : 'theme';
  return FRAMES[fr] ? fr : 'theme';
}
const FRAME_W = [30, 26, 22, 18, 16, 14];
function boxRatio(f){   // 이미지 칸의 세로/가로
  const fr = frameOf(f);
  if (fr === 'round') return 1;
  if (fr === 'oval') return 4 / 3;
  const [w, h] = S.favRatio.split('/').map(Number);
  return h / w;
}
function bgSize(f){
  const z = f.zoom || 100;
  if (!f.ar) return z === 100 ? 'cover' : `${z}% auto`;
  return f.ar >= boxRatio(f) ? `${z}% auto` : `auto ${z}%`;
}
const bgPos = f => `${f.px ?? 50}% ${f.pos ?? 50}%`;
function galHTML(){
  const t = S.titles.fav.trim();
  if (!S.favs.length) return `<div class="gal">${t ? `<h3 class="sec-t gal-t ed">${esc(t)}</h3>` : ''}<div class="gal-empty ed">이미지 영역<br><small>이미지 탭에서 추가하거나, 꾸미기 탭에서 스티커·텍스트를 자유롭게 올려 보세요.<br>이 안내는 저장한 이미지에 나오지 않아요.</small></div></div>`;
  const items = S.favs.map(f => `<figure class="fv fr-${frameOf(f)}" data-id="${f.id}"><div class="frm"><div class="im" style="background-image:url(${f.url});background-size:${bgSize(f)};background-position:${bgPos(f)};aspect-ratio:${S.favRatio}">${S.cap === 'over' ? capHTML(f) : ''}</div></div>${S.cap === 'below' ? capHTML(f) : ''}</figure>`).join('');
  return `<div class="gal cap-${S.cap}">${t ? `<h3 class="gal-t">${esc(t)}</h3>` : ''}<div class="strip"><div class="grid${S.favCenter ? ' ctr' : ''}" style="--cols:${S.favCols};--cs:${CAP_SCALE[S.favCols - 1]};--fw:${FRAME_W[S.favCols - 1]}px">${items}</div></div></div>`;
}
function renderCard(){
  const card = $('#card'), st = card.style;
  for (const [k] of COLOR_KEYS) st.setProperty('--' + k, S.c[k]);
  st.setProperty('--accent-a', alpha(S.c.accent, .32));
  st.setProperty('--surface-a', alpha(S.c.surface, .78));
  st.setProperty('--k', S.fs / 100);
  st.setProperty('--r', S.radius + 'px');
  st.setProperty('--W', W() + 'px');
  st.setProperty('--minh', Math.round(W() / RATIOS[S.ratio]) + 'px');
  st.setProperty('--split', S.split + '%');
  st.setProperty('--galign', S.galign);
  st.setProperty('--pfs', S.pfSize + 'px');
  st.setProperty('--font', stackBody());
  st.setProperty('--tfont', stackTitle());
  const hasHd = !!(S.header && S.showHeader);
  card.className = `th-${S.theme} lay-${S.layout} chip-${S.chipStyle} al-${S.align} pf-${S.pfShape} tl-${S.tagLayout}${hasHd ? ' has-hd' : ''}${S.decoOn ? '' : ' nodeco'}`;

  const hd = hasHd ? `<div class="hd" style="height:${S.headerH}px;background-image:url(${S.header.url});background-position:${S.headerX}% ${S.headerPos}%"></div>` : '';
  const pf = S.profile
    ? `<div class="pf" style="background-image:url(${S.profile.url});background-position:${S.pfX}% ${S.pfY}%"></div>`
    : `<div class="pf ph">${esc([...S.nick.trim()][0] || '?')}</div>`;
  const tags = TAG_KEYS.map(tagHTML).filter(Boolean);
  const tagBlock = tags.length ? `<div class="tags" style="--n:${tags.length}">${tags.join('')}</div>` : '';
  const cn = [txtHTML('caution'), txtHTML('ng')].filter(Boolean);
  const cnBlock = S.pairNG && cn.length === 2 ? `<div class="row" style="--n:2">${cn.join('')}</div>` : cn.join('');
  const nick = esc(S.nick), uid = esc(S.uid);

  $('#cb').innerHTML = `<div class="deco">
      <div class="lbt"><span>Now showing</span><span>${uid}</span></div><div class="lbb"><span>${nick}</span><span>a profile in motion</span></div>
      <div class="curl"></div><div class="curr"></div><div class="val"></div><div class="floor"></div><div class="rings"></div>
      <div class="appbar"><span class="ar">←</span><span><b>${nick}</b><small>미디어 ${S.favs.length}</small></span><span class="dots">···</span></div>
      <div class="dado"></div><div class="planet"></div>${spaceArt()}
      <div class="hud">MISSION LOG&nbsp;&nbsp;·&nbsp;&nbsp;${uid}&nbsp;&nbsp;·&nbsp;&nbsp;ORBIT 408 KM</div>
    </div>
    <div class="sheet">
      <div class="info">${hd}<div class="head">${pf}<div class="nm"><div class="nick">${nick}</div>${S.uid.trim() ? `<div class="uid">${uid}</div>` : ''}</div><span class="fbtn">팔로우</span></div>
        <div class="secs">${tagBlock}${txtHTML('about')}${cnBlock}</div></div>
      ${galHTML()}
    </div>
    <svg class="strings" aria-hidden="true"></svg>`;
  $('#sizeInfo').textContent = `현재 ${W()} × ${Math.round(W() / RATIOS[S.ratio])}px 기준. 내용이 더 길면 세로가 자동으로 늘어나요.`;
  fit();
}

/* 우주: 위성·우주선·우주비행사 일러스트 */
function spaceArt(){
  const a = S.c.accent, hi = '#eef1f6', mid = '#c9cfdc', lo = '#9aa3b5', dk = '#1b2235';
  const sat = `<svg class="sat" viewBox="0 0 220 100"><rect x="2" y="30" width="70" height="40" rx="2" fill="#26304a" stroke="#9fb0d6" stroke-width="2"/><path d="M25 30v40M48 30v40M2 50h70" stroke="#9fb0d6" stroke-width="1.5"/><rect x="148" y="30" width="70" height="40" rx="2" fill="#26304a" stroke="#9fb0d6" stroke-width="2"/><path d="M171 30v40M194 30v40M148 50h70" stroke="#9fb0d6" stroke-width="1.5"/><path d="M72 50h18M130 50h18" stroke="${mid}" stroke-width="3"/><rect x="90" y="30" width="40" height="40" rx="5" fill="${hi}"/><rect x="90" y="30" width="40" height="11" rx="4" fill="${mid}"/><path d="M110 30V14" stroke="${mid}" stroke-width="2.5"/><path d="M97 14a13 8 0 0 0 26 0z" fill="${hi}"/><circle cx="110" cy="56" r="5" fill="${a}"/></svg>`;
  const ship = `<svg class="ship" viewBox="0 0 220 90"><path d="M22 38 L0 45 L22 52z" fill="#ffb36b"/><path d="M22 41 L9 45 L22 49z" fill="#fff3d6"/><rect x="20" y="34" width="12" height="22" rx="2" fill="${lo}"/><path d="M70 58 L122 58 L96 86 L58 86z" fill="${mid}"/><path d="M40 32 L72 32 L52 8 L36 8z" fill="${mid}"/><path d="M30 30 H150 Q206 32 214 45 Q206 58 150 60 H30z" fill="${hi}"/><rect x="40" y="43" width="100" height="4" fill="${a}" opacity=".8"/><circle cx="162" cy="42" r="5" fill="${dk}"/><circle cx="178" cy="42" r="5" fill="${dk}"/></svg>`;
  const astro = `<svg class="astro" viewBox="-30 0 150 165"><path d="M30 100 C 0 118, 6 148, -28 162" stroke="${lo}" stroke-width="2" fill="none"/><rect x="28" y="52" width="64" height="66" rx="12" fill="${mid}"/><rect x="14" y="64" width="24" height="15" rx="7.5" fill="#e3e7ef" transform="rotate(-30 26 71)"/><rect x="82" y="60" width="24" height="15" rx="7.5" fill="#e3e7ef" transform="rotate(35 94 67)"/><rect x="38" y="106" width="19" height="34" rx="9" fill="#e3e7ef" transform="rotate(8 47 123)"/><rect x="63" y="106" width="19" height="34" rx="9" fill="#e3e7ef" transform="rotate(-12 72 123)"/><rect x="34" y="58" width="52" height="58" rx="16" fill="${hi}"/><rect x="48" y="76" width="24" height="14" rx="3" fill="${mid}"/><circle cx="54" cy="83" r="2.6" fill="${a}"/><circle cx="60" cy="42" r="28" fill="${hi}"/><ellipse cx="60" cy="44" rx="19" ry="15" fill="${dk}"/><ellipse cx="60" cy="44" rx="19" ry="15" fill="${a}" opacity=".22"/><ellipse cx="53" cy="38" rx="6" ry="4" fill="#fff" opacity=".55"/></svg>`;
  return sat + ship + astro;
}

/* 디텍티브 보드: 핀과 붉은 실 */
function drawStrings(){
  const svg = $('#cb .strings'); if (!svg) return;
  if (S.theme !== 'board') { svg.innerHTML = ''; return; }
  const card = $('#card').getBoundingClientRect();
  const pt = el => { const r = el.getBoundingClientRect(); return [(r.left + r.width / 2 - card.left) / scale, (r.top - card.top) / scale + 16]; };
  const pts = [];
  const head = $('#cb .head'); if (head) pts.push(pt(head));
  $$('#cb .fv').forEach(f => pts.push(pt(f)));
  let d = '';
  for (let i = 1; i < pts.length; i++) {
    const [x1, y1] = pts[i - 1], [x2, y2] = pts[i];
    const sag = Math.min(90, Math.hypot(x2 - x1, y2 - y1) * .12 + 14);
    d += `M${x1} ${y1} Q${(x1 + x2) / 2} ${(y1 + y2) / 2 + sag} ${x2} ${y2} `;
  }
  const pins = pts.slice(1).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="11" fill="${S.c.accent}"/><circle cx="${x - 3}" cy="${y - 3}" r="3.5" fill="rgba(255,255,255,.65)"/>`).join('');
  svg.innerHTML = `<path d="${d}" fill="none" stroke="${S.c.accent}" stroke-width="3" stroke-linecap="round" opacity=".9" style="filter:drop-shadow(0 3px 2px rgba(0,0,0,.35))"/>${pins}`;
}

/* ───────── 오브젝트 (스티커 + 텍스트) ───────── */
function objHTML(o){
  const base = `left:${o.x}px;top:${o.y}px;width:${o.w}px;transform:rotate(${o.rot}deg)`;
  const s = o.id === sel ? ' sel' : '';
  if (o.type === 'sticker')
    return `<div class="obj stk${s}" data-id="${o.id}" style="${base}"><img src="${o.url}" alt="" draggable="false" style="transform:scaleX(${o.flip ? -1 : 1});opacity:${o.op / 100}"><i class="h"></i></div>`;
  const fixH = o.hFix ? `;height:${o.h || 120}px;--va:${{top:'flex-start', middle:'center', bottom:'flex-end'}[o.valign || 'middle']}` : '';
  const st = `${base}${fixH};font-size:${o.size}px;text-align:${o.align};font-family:${objFont(o).replace(/"/g, "'")};font-weight:${o.bold ? 700 : 400};opacity:${o.op / 100}${o.custom ? `;--cfg:${o.fg};--cbg:${o.bg}` : ''}`;
  const bub = o.kind === 'bubble' || o.kind === 'line';
  const tail = bub ? ` tail-${o.tail || 'bl'}` : '';
  const tv = '';
  return `<div class="obj tx k-${o.kind}${tail}${o.custom ? ' custom' : ''}${o.hFix ? ' fixh' : ''}${s}" data-id="${o.id}" style="${st}${tv}">${bub ? tailSVG(o) : ''}<div class="tb">${esc(o.text)}</div>${o.kind === 'quote' && o.by ? `<div class="by">— ${esc(o.by)}</div>` : ''}<i class="h"></i></div>`;
}
function tailSVG(o){
  const pos = o.tail || 'bl'; if (pos === 'none') return '';
  const fs = o.size, line = o.kind === 'line', b = line ? .12 * fs : 0;
  const tl = (o.tl ?? 80) / 100 * fs, tw = (o.tw ?? 90) / 100 * fs;
  const H = tl + b + 1, tip = tw / 2 + Math.tan((o.tip ?? 0) * Math.PI / 180) * tl;
  const top = pos[0] === 't', side = pos[1], tx = o.tx ?? 15;
  const left = side === 'c' ? `calc(50% - ${tw / 2}px)` : side === 'l' ? `calc(${tx}% - ${tw / 2}px)` : `calc(${100 - tx}% - ${tw / 2}px)`;
  const y0 = top ? H : 0, y1 = top ? 0 : H;
  const fi = line ? .12 * fs : 0;
  const pts = `${fi},${y0} ${tw - fi},${y0} ${tip},${y1}`;
  // 채움을 먼저 그려 말풍선 테두리를 덮고, 그 위에 양쪽 변만 테두리 두께로 그어 이음새가 끊기지 않게 함
  const ins = line ? b / 2 : 0;
  const stroke = line ? `<path d="M${ins} ${y0} L${tip} ${y1} L${tw - ins} ${y0}" fill="none" stroke="var(--ofg)" stroke-width="${b}" stroke-linejoin="miter" stroke-miterlimit="12" stroke-linecap="butt"/>` : '';
  return `<svg class="tail" width="${tw}" height="${H}" viewBox="0 0 ${tw} ${H}" style="left:${left};${top ? `bottom:calc(100% - 1px)` : `top:calc(100% - 1px)`}"><polygon points="${pts}" fill="var(--obg)"/>${stroke}</svg>`;
}
function renderObjs(){ $('#layer').innerHTML = S.objs.map(objHTML).join(''); }

const fontOpts = cur => `<option value="body"${cur === 'body' ? ' selected' : ''}>본문 글꼴</option><option value="title"${cur === 'title' ? ' selected' : ''}>제목 글꼴</option>` +
  Object.keys(FONTS).map(f => `<option value="${f}"${cur === f ? ' selected' : ''}>${FONTS[f][0]}</option>`).join('');
// 슬라이더 + 숫자 직접 입력 (옆에 회색으로 범위 표시)
function rng(label, k, min, max, v, step = 1, unit = ''){
  return `<div class="rng"><div class="rh"><span class="rl">${label}</span><span class="rr"><span class="rhint">${min}–${max}</span><input type="number" class="num" min="${min}" max="${max}" step="${step}" value="${v}" aria-label="${label} 값">${unit ? `<i>${unit}</i>` : ''}</span></div><input type="range" min="${min}" max="${max}" step="${step}" value="${v}" data-k="${k}" aria-label="${label}"></div>`;
}
const openObjs = new Set();
const GRIP = '<span class="grip" tabindex="0" role="button" aria-label="끌어서 순서 바꾸기 (방향키로도 이동)" title="끌어서 순서 바꾸기">⠿</span>';
const preview = o => (o.text || '').replace(/\s+/g, ' ').trim().slice(0, 28) || '(빈 텍스트)';
function renderObjList(){
  const L = $('#objList');
  $('#objTools').hidden = !S.objs.length;
  if (!S.objs.length) { L.innerHTML = '<p class="empty">아직 스티커나 텍스트가 없어요.</p>'; return; }
  const n = S.objs.length;
  L.innerHTML = S.objs.map((o, i) => ({o, i})).reverse().map(({o, i}) => {
    const btns = `<div class="btns"><button data-a="dup">복제</button>${o.type === 'sticker' ? '<button data-a="flip">좌우 반전</button>' : ''}<button data-a="del" class="danger">삭제</button></div>`;
    const head = o.type === 'sticker'
      ? `<summary>${GRIP}<img class="sum-th" src="${o.url}" alt=""><span class="badge">스티커</span><span class="sum-tx">${Math.round(o.w)}px</span></summary>`
      : `<summary>${GRIP}<span class="sum-ic k-${o.kind}"></span><span class="badge">${KIND_NAMES[o.kind]}</span><span class="sum-tx">${esc(preview(o))}</span></summary>`;
    const wrap = body => `<details class="item oitem${o.id === sel ? ' sel' : ''}" data-id="${o.id}"${openObjs.has(o.id) ? ' open' : ''}>${head}<div class="ctl obody">${body}</div></details>`;
    if (o.type === 'sticker') return wrap(`${rng('크기', 'w', 30, 1600, Math.round(o.w), 1, 'px')}<div class="two">${rng('회전', 'rot', -180, 180, o.rot, 1, '°')}${rng('투명도', 'op', 10, 100, o.op, 1, '%')}</div>${btns}`);
    const bub = o.kind === 'bubble' || o.kind === 'line';
    const alignSel = `<select data-k="align">${[['left','왼쪽 정렬'],['center','가운데 정렬'],['right','오른쪽 정렬']].map(([k, v]) => `<option value="${k}"${k === o.align ? ' selected' : ''}>${v}</option>`).join('')}</select>`;
    return wrap(`
      <textarea data-k="text" rows="2">${esc(o.text)}</textarea>
      ${o.kind === 'quote' ? `<input type="text" data-k="by" value="${esc(o.by || '')}" placeholder="출처·화자 (비우면 숨김)">` : ''}
      <div class="two">
        <select data-k="kind">${Object.entries(KIND_NAMES).map(([k, v]) => `<option value="${k}"${k === o.kind ? ' selected' : ''}>${v}</option>`).join('')}</select>
        <select data-k="font">${fontOpts(o.font)}</select>
        ${bub ? `<select data-k="tail">${[['bl','꼬리 왼쪽 아래'],['bc','꼬리 가운데 아래'],['br','꼬리 오른쪽 아래'],['tl','꼬리 왼쪽 위'],['tc','꼬리 가운데 위'],['tr','꼬리 오른쪽 위'],['none','꼬리 없음']].map(([k, v]) => `<option value="${k}"${k === (o.tail || 'bl') ? ' selected' : ''}>${v}</option>`).join('')}</select>` : ''}
        ${alignSel}
      </div>
      ${bub && o.tail !== 'none' ? `<div class="two">${rng('꼬리 길이', 'tl', 20, 400, o.tl ?? 80, 1, '%')}${rng('꼬리 너비', 'tw', 20, 300, o.tw ?? 90, 1, '%')}</div>
      <div class="two">${rng('꼬리 기울기', 'tip', -60, 60, o.tip ?? 0, 1, '°')}${o.tail === 'bc' || o.tail === 'tc' ? '<span></span>' : rng('꼬리 위치', 'tx', 0, 80, o.tx ?? 15, 1, '%')}</div>` : ''}
      <div class="two">${rng('글자 크기', 'size', 12, 140, o.size, 1, 'px')}${rng('너비', 'w', 60, 1800, Math.round(o.w), 1, 'px')}</div>
      <div class="boxh"><label class="chk"><input type="checkbox" data-k="hFix"${o.hFix ? ' checked' : ''}> 꾸밈 높이 직접 정하기</label>
        ${o.hFix ? `<div class="two">${rng('높이', 'h', 20, 1600, Math.round(o.h || 120), 1, 'px')}<label class="field"><span class="lb">글자 세로 정렬</span><select data-k="valign">${[['top','위'],['middle','가운데'],['bottom','아래']].map(([k, v]) => `<option value="${k}"${(o.valign || 'middle') === k ? ' selected' : ''}>${v}</option>`).join('')}</select></label></div>` : ''}</div>
      <div class="two">${rng('회전', 'rot', -180, 180, o.rot, 1, '°')}${rng('투명도', 'op', 10, 100, o.op, 1, '%')}</div>
      <div class="clr"><label class="chk"><input type="checkbox" data-k="bold"${o.bold ? ' checked' : ''}> 굵게</label>
        <label class="chk"><input type="checkbox" data-k="custom"${o.custom ? ' checked' : ''}> 색 직접 지정</label>
        ${o.custom ? `<label>글자 <input type="color" data-k="fg" value="${o.fg}"></label><label>배경 <input type="color" data-k="bg" value="${o.bg}"></label>` : ''}</div>
      ${btns}`);
  }).join('');
}
$('#objList').addEventListener('toggle', e => {
  const d = e.target; if (!d.matches || !d.matches('details.oitem')) return;
  if (d.open) openObjs.add(d.dataset.id); else openObjs.delete(d.dataset.id);
}, true);
$('#objOpenAll').onclick = () => { S.objs.forEach(o => openObjs.add(o.id)); renderObjList(); };
$('#objCloseAll').onclick = () => { openObjs.clear(); renderObjList(); };
function selectObj(id, reveal){
  sel = id;
  $$('#layer .obj').forEach(el => el.classList.toggle('sel', el.dataset.id === id));
  $$('#objList .item').forEach(el => el.classList.toggle('sel', el.dataset.id === id));
  if (id && reveal) {
    openTab('deco');
    const it = $(`#objList .item[data-id="${id}"]`);
    if (it) { if (!it.open) { openObjs.add(id); it.open = true; } it.scrollIntoView({block:'nearest', behavior:'smooth'}); }
  }
}
function centerPos(w){
  const card = $('#card'), stage = $('#stage');
  const midY = (stage.scrollTop + stage.clientHeight / 2 - $('#wrap').offsetTop) / scale;
  const y = Math.max(40, Math.min(card.offsetHeight - 120, midY - 60));
  const n = S.objs.length % 6;
  return {x:Math.round((W() - w) / 2 + (n % 3 - 1) * 160), y:Math.round(y + (n - 2.5) * 50)};
}
$('#addText').addEventListener('click', e => {
  const b = e.target.closest('[data-kind]'); if (!b) return;
  const d = KIND_DEF[b.dataset.kind];
  const o = {id:newId(), type:'text', kind:b.dataset.kind, ...d, font:b.dataset.kind === 'tape' ? 'title' : 'body', op:100, custom:false,
    fg:S.c.text, bg:b.dataset.kind === 'memo' ? '#ffe98a' : S.c.surface, ...centerPos(d.w)};
  S.objs.push(o); sel = o.id; openObjs.add(o.id);
  renderObjs(); renderObjList(); save();
  const ta = $(`#objList .item[data-id="${o.id}"] textarea`); if (ta) { ta.focus(); ta.select(); }
});
$('#stkIn').addEventListener('change', async e => {
  const files = [...e.target.files]; e.target.value = '';
  for (const file of files) {
    try {
      const {data} = await loadImage(file, 900);
      const o = {id:newId(), type:'sticker', ...imgObj(data), w:240, rot:0, op:100, flip:false, ...centerPos(240)};
      S.objs.push(o); sel = o.id; openObjs.add(o.id);
    } catch { toast(`${file.name} 파일을 읽지 못했어요`); }
  }
  renderObjs(); renderObjList(); save();
});
$('#objList').addEventListener('input', e => {
  const t = e.target, it = t.closest('.item'); if (!it || !t.dataset.k) return;
  const o = S.objs.find(x => x.id === it.dataset.id), k = t.dataset.k;
  if (t.type === 'checkbox') {
    o[k] = t.checked;
    if (k === 'hFix' && t.checked && !o.h) { const el = $(`#layer .obj[data-id="${o.id}"]`); o.h = el ? Math.round(el.offsetHeight) : 120; }
  }
  else if (t.type === 'range') o[k] = +t.value;
  else o[k] = t.value;
  sel = o.id;
  if (k === 'text') { const st = it.querySelector('.sum-tx'); if (st) st.textContent = preview(o); }
  renderObjs(); save();
  if (k === 'kind' || k === 'custom' || k === 'tail' || k === 'hFix') renderObjList();
});
$('#objList').addEventListener('click', e => {
  const it = e.target.closest('.item'); if (!it) return;
  const b = e.target.closest('button[data-a]');
  const arr = S.objs, i = arr.findIndex(x => x.id === it.dataset.id);
  if (!b) { if (sel !== it.dataset.id) selectObj(it.dataset.id); return; }
  const a = b.dataset.a;
  if (a === 'del') { dropURL(arr[i]); arr.splice(i, 1); sel = null; }
  else if (a === 'flip') arr[i].flip = !arr[i].flip;
  else if (a === 'dup') {
    const c = {...arr[i], id:newId(), x:arr[i].x + 30, y:arr[i].y + 30};
    if (c.type === 'sticker') c.url = dataToURL(c.data);
    arr.splice(i + 1, 0, c); sel = c.id; openObjs.add(c.id);
  } else { const j = a === 'front' ? i + 1 : i - 1; [arr[i], arr[j]] = [arr[j], arr[i]]; }
  renderObjs(); renderObjList(); save();
});

// 미리보기 드래그 / 크기 조절
let drag = null;
$('#layer').addEventListener('pointerdown', e => {
  const el = e.target.closest('.obj'); if (!el) return;
  e.preventDefault(); e.stopPropagation();
  const o = S.objs.find(x => x.id === el.dataset.id);
  selectObj(o.id, true);
  drag = {o, el, mode:e.target.classList.contains('h') ? 'size' : 'move', x0:e.clientX, y0:e.clientY, sx:o.x, sy:o.y, sw:o.w, sh:o.h || el.offsetHeight, moved:false};
  el.setPointerCapture(e.pointerId);
});
window.addEventListener('pointermove', e => {
  if (!drag) return;
  const dx = (e.clientX - drag.x0) / scale, dy = (e.clientY - drag.y0) / scale, {o, el} = drag;
  drag.moved = true;
  if (drag.mode === 'move') { o.x = Math.round(drag.sx + dx); o.y = Math.round(drag.sy + dy); el.style.left = o.x + 'px'; el.style.top = o.y + 'px'; }
  else {
    o.w = Math.max(30, Math.round(drag.sw + dx)); el.style.width = o.w + 'px';
    if (o.type === 'text' && o.hFix) { o.h = Math.max(20, Math.round(drag.sh + dy)); el.style.height = o.h + 'px'; }
  }
});
window.addEventListener('pointerup', () => { if (!drag) return; const m = drag.moved; drag = null; if (m) { renderObjList(); save(); } });
$('#stage').addEventListener('pointerdown', e => { if (!e.target.closest('.obj') && sel) selectObj(null); });
document.addEventListener('keydown', e => {
  if (!sel || /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName)) return;
  const o = S.objs.find(x => x.id === sel); if (!o) return;
  const step = e.shiftKey ? 10 : 1;
  const mv = {ArrowLeft:[-step,0], ArrowRight:[step,0], ArrowUp:[0,-step], ArrowDown:[0,step]}[e.key];
  if (mv) { e.preventDefault(); o.x += mv[0]; o.y += mv[1]; renderObjs(); save(); }
  else if (e.key === 'Delete' || e.key === 'Backspace') {
    e.preventDefault(); dropURL(o); S.objs = S.objs.filter(x => x !== o); sel = null; renderObjs(); renderObjList(); save();
  }
});

/* ───────── 미리보기 맞춤 ───────── */
function fit(){
  const stage = $('#stage'), card = $('#card');
  const cs = getComputedStyle(stage);
  const avail = stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const fitScale = Math.min(1, avail / W());
  scale = zoomMode === 'fit' ? fitScale : +zoomMode;
  $('#scaler').style.width = W() + 'px';
  $('#scaler').style.transform = `scale(${scale})`;
  $('#wrap').style.width = W() * scale + 'px';
  $('#wrap').style.height = card.offsetHeight * scale + 'px';
  applyBgAll();
  drawStrings();
  const pr = +$('#pr').value;
  $('#sizeOut').textContent = `${W() * pr} × ${card.offsetHeight * pr}px`;
}
let zoomMode = 'fit';
$('#zoomSel').addEventListener('change', e => { zoomMode = e.target.value; fit(); });
$('#pr').addEventListener('change', () => fit());
const ro = new ResizeObserver(() => fit());
ro.observe($('#stage')); ro.observe($('#card'));

/* ───────── 편집기: 성향 ───────── */
function renderTagEd(){
  $('#tagEd').innerHTML = TAG_KEYS.map(k => `<div class="tagbox" data-k="${k}">
    <input type="text" class="ttl" data-title="${k}" aria-label="${k} 제목">
    <div class="tchips">${S.tags[k].map((x, i) => `<span class="tg${x.on ? ' on' : ''}"><button type="button" class="t" data-i="${i}" aria-pressed="${x.on}">${esc(x.t)}</button><button type="button" class="x" data-i="${i}" aria-label="${esc(x.t)} 삭제">✕</button></span>`).join('')}</div>
    <form class="tadd"><input type="text" placeholder="키워드 추가 (쉼표로 여러 개)" maxlength="80"><button class="btn">추가</button></form>
    ${DEFAULT_TAGS[k].some(t => !S.tags[k].find(x => x.t === t)) ? `<button type="button" class="linkbtn" data-restore="${k}">지운 기본 키워드 다시 넣기</button>` : ''}
  </div>`).join('');
  bindTitles($('#tagEd'));
}
function restoreTags(k){
  const list = S.tags[k];
  DEFAULT_TAGS[k].forEach((t, di) => {
    if (list.find(x => x.t === t)) return;
    // 기본 순서에서 바로 앞에 있는 키워드 뒤에 끼워 넣기
    let at = 0;
    for (let p = di - 1; p >= 0; p--) { const j = list.findIndex(x => x.t === DEFAULT_TAGS[k][p]); if (j >= 0) { at = j + 1; break; } }
    list.splice(at, 0, {t, on:false});
  });
}
$('#tagEd').addEventListener('click', e => {
  const r = e.target.closest('[data-restore]');
  if (r) { restoreTags(r.dataset.restore); renderTagEd(); update(); return; }
  const b = e.target.closest('button[data-i]'); if (!b) return;
  const k = b.closest('.tagbox').dataset.k, i = +b.dataset.i;
  if (b.classList.contains('x')) S.tags[k].splice(i, 1); else S.tags[k][i].on = !S.tags[k][i].on;
  renderTagEd(); update();
});
$('#tagEd').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target, k = f.closest('.tagbox').dataset.k, inp = f.querySelector('input');
  for (const w of inp.value.split(',').map(s => s.trim()).filter(Boolean)) {
    const ex = S.tags[k].find(x => x.t === w);
    if (ex) ex.on = true; else S.tags[k].push({t:w, on:true});
  }
  renderTagEd(); update();
  $(`.tagbox[data-k="${k}"] .tadd input`).focus();
});

/* ───────── 편집기: 이미지 ───────── */
const openFavs = new Set();
function renderFavList(){
  const L = $('#favList');
  $('#favTools').hidden = !S.favs.length;
  if (!S.favs.length) { L.innerHTML = '<p class="empty">아직 이미지가 없어요. 좋아하는 캐릭터·페어 이미지를 넣어 보세요.</p>'; return; }
  L.innerHTML = S.favs.map((f, i) => `<details class="item oitem" data-id="${f.id}"${openFavs.has(f.id) ? ' open' : ''}>
    <summary><span class="grip" tabindex="0" role="button" aria-label="끌어서 순서 바꾸기 (방향키로도 이동)" title="끌어서 순서 바꾸기">⠿</span><img class="sum-th cover" src="${f.url}" alt="" style="object-position:${bgPos(f)}"><span class="sum-no">${i + 1}</span><span class="sum-tx">${esc([f.genre, f.name].filter(Boolean).join(' · ') || '캡션 없음')}</span></summary>
    <div class="ctl obody">
      <input type="text" data-k="genre" value="${esc(f.genre)}" placeholder="장르명">
      <input type="text" data-k="name" value="${esc(f.name)}" placeholder="캐릭터명 / 페어명">
      <input type="text" data-k="source" value="${esc(f.source)}" placeholder="출처 (예: @artist 님)">
      <select data-k="frame" aria-label="액자"><option value="auto">액자: 기본 설정 따름</option>${Object.entries(FRAMES).map(([k, v]) => `<option value="${k}"${f.frame === k ? ' selected' : ''}>액자: ${v}</option>`).join('')}</select>
      <div class="two">${rng('가로 위치', 'px', 0, 100, Math.round(f.px ?? 50), 1, '%')}${rng('세로 위치', 'pos', 0, 100, Math.round(f.pos ?? 50), 1, '%')}</div>
      ${rng('확대', 'zoom', 100, 400, f.zoom || 100, 5, '%')}
      <div class="btns"><button data-a="reset">위치 초기화</button><button data-a="del" class="danger">삭제</button></div>
    </div></details>`).join('');
}
$('#favList').addEventListener('toggle', e => {
  const d = e.target; if (!d.matches || !d.matches('details.oitem')) return;
  if (d.open) openFavs.add(d.dataset.id); else openFavs.delete(d.dataset.id);
}, true);
$('#favOpenAll').onclick = () => { S.favs.forEach(f => openFavs.add(f.id)); renderFavList(); };
$('#favCloseAll').onclick = () => { openFavs.clear(); renderFavList(); };
function revealFav(id){
  openTab('fav');
  const it = $(`#favList details[data-id="${id}"]`); if (!it) return;
  openFavs.add(id); it.open = true;
  it.scrollIntoView({block:'nearest', behavior:'smooth'});
  it.classList.add('flash'); setTimeout(() => it.classList.remove('flash'), 900);
}
$('#favList').addEventListener('input', e => {
  const t = e.target, it = t.closest('.item'); if (!it || !t.dataset.k) return;
  const f = S.favs.find(x => x.id === it.dataset.id);
  f[t.dataset.k] = t.type === 'range' ? +t.value : t.value;
  if (t.dataset.k === 'pos' || t.dataset.k === 'px') it.querySelector('.th').style.objectPosition = bgPos(f);
  if (t.dataset.k === 'genre' || t.dataset.k === 'name') it.querySelector('.sum-tx').textContent = [f.genre, f.name].filter(Boolean).join(' · ') || '캡션 없음';
  update();
});
$('#favList').addEventListener('click', e => {
  const b = e.target.closest('button[data-a]'); if (!b) return;
  const i = S.favs.findIndex(x => x.id === b.closest('.item').dataset.id);
  if (b.dataset.a === 'del') { dropURL(S.favs[i]); S.favs.splice(i, 1); }
  else if (b.dataset.a === 'reset') Object.assign(S.favs[i], {px:50, pos:50, zoom:100});
  else { const j = b.dataset.a === 'up' ? i - 1 : i + 1; [S.favs[i], S.favs[j]] = [S.favs[j], S.favs[i]]; }
  renderFavList(); update();
});
$('#favIn').addEventListener('change', async e => {
  const files = [...e.target.files]; e.target.value = '';
  if (!files.length) return;
  toast(`이미지 ${files.length}장 불러오는 중…`);
  for (const file of files) {
    try {
      const {data, ratio} = await loadImage(file, 1400);
      const f = {id:newId(), ...imgObj(data), genre:'', name:'', source:'', pos:50, px:50, zoom:100, ar:ratio, frame:'auto'};
      S.favs.push(f); if (files.length <= 3) openFavs.add(f.id);
    }
    catch { toast(`${file.name} 파일을 읽지 못했어요`); }
  }
  renderFavList(); update(); toast('이미지를 추가했어요');
});

// 미리보기에서 이미지(대표 이미지·프로필·헤더)를 끌어서 위치 조절, 휠로 확대
const PAN_SEL = '.fv .im, .pf:not(.ph), .hd';
function panTarget(el){
  const fv = el.closest('.fv');
  if (fv && el.classList.contains('im')) {
    const f = S.favs.find(x => x.id === fv.dataset.id);
    return f && {o:f, kx:'px', ky:'pos', kz:'zoom', ar:f.ar, after:renderFavList};
  }
  if (el.classList.contains('pf') && S.profile) return {o:S, kx:'pfX', ky:'pfY', kz:'pfZoom', ar:S.profile.ar, after:syncInputs};
  if (el.classList.contains('hd') && S.header) return {o:S, kx:'headerX', ky:'headerPos', kz:'headerZoom', ar:S.header.ar, after:syncInputs};
  return null;
}
function sizeFor(t, el){
  const z = t.o[t.kz] || 100;
  if (!t.ar) return z === 100 ? 'cover' : `${z}% auto`;
  return t.ar >= el.clientHeight / el.clientWidth ? `${z}% auto` : `auto ${z}%`;
}
function applyBg(el, t){
  el.style.backgroundSize = sizeFor(t, el);
  el.style.backgroundPosition = `${t.o[t.kx] ?? 50}% ${t.o[t.ky] ?? 50}%`;
}
function applyBgAll(){ $$('#cb ' + PAN_SEL.split(', ').join(', #cb ')).forEach(el => { const t = panTarget(el); if (t) applyBg(el, t); }); }
function overflowOf(t, el){
  const bw = el.clientWidth, bh = el.clientHeight, z = (t.o[t.kz] || 100) / 100, ar = t.ar || bh / bw;
  let dw, dh;
  if (ar >= bh / bw) { dw = bw * z; dh = dw * ar; } else { dh = bh * z; dw = dh / ar; }
  return [dw - bw, dh - bh];
}
let pan = null;
$('#cb').addEventListener('pointerdown', e => {
  const el = e.target.closest(PAN_SEL); if (!el) return;
  const t = panTarget(el); if (!t) return;
  e.preventDefault();
  const [ox, oy] = overflowOf(t, el);
  pan = {t, el, x0:e.clientX, y0:e.clientY, px:t.o[t.kx] ?? 50, py:t.o[t.ky] ?? 50, ox, oy, moved:false};
  el.setPointerCapture(e.pointerId);
  el.style.cursor = 'grabbing';
});
window.addEventListener('pointermove', e => {
  if (!pan) return;
  const {t, el} = pan, dx = (e.clientX - pan.x0) / scale, dy = (e.clientY - pan.y0) / scale;
  const cl = v => Math.round(Math.max(0, Math.min(100, v)));
  if (pan.ox > 1) t.o[t.kx] = cl(pan.px - dx / pan.ox * 100);
  if (pan.oy > 1) t.o[t.ky] = cl(pan.py - dy / pan.oy * 100);
  pan.moved = true;
  applyBg(el, t);
});
let panMovedAt = 0;
window.addEventListener('pointerup', () => {
  if (!pan) return;
  pan.el.style.cursor = ''; const {moved, t} = pan; pan = null;
  if (moved) panMovedAt = Date.now();
  if (moved) { t.after(); save(); }
});
// 미리보기의 각 부분을 누르면 해당 편집 탭으로 이동
function focusField(sel){ const el = $(sel); if (el) { el.focus({preventScroll:true}); el.scrollIntoView({block:'center', behavior:'smooth'}); } }
$('#cb').addEventListener('click', e => {
  if (Date.now() - panMovedAt < 300) return;
  const fv = e.target.closest('.fv');
  if (fv) return revealFav(fv.dataset.id);
  if (e.target.closest('.gal')) return openTab('fav');
  if (e.target.closest('.head, .hd')) return openTab('info');
  if (e.target.closest('.tags')) return openTab('tags');
  const s = e.target.closest('.s-about, .s-caution, .s-ng');
  if (s) { openTab('text'); focusField(`textarea[data-bind="${s.className.match(/s-(about|caution|ng)/)[1]}"]`); }
});
let wheelTimer;
$('#cb').addEventListener('wheel', e => {
  const el = e.target.closest(PAN_SEL); if (!el) return;
  const t = panTarget(el); if (!t) return;
  e.preventDefault();
  t.o[t.kz] = Math.max(100, Math.min(400, (t.o[t.kz] || 100) + (e.deltaY < 0 ? 10 : -10)));
  applyBg(el, t);
  clearTimeout(wheelTimer); wheelTimer = setTimeout(() => { t.after(); save(); }, 300);
}, {passive:false});

/* ───────── 슬라이더 숫자 입력 동기화 ───────── */
const pairOf = el => { const r = el.closest('.rng'); return r ? [r.querySelector('input[type=range]'), r.querySelector('.num')] : []; };
function pushNum(n, clampIt){
  const [r] = pairOf(n); if (!r || n.value === '') return;
  let v = Number(n.value); if (!Number.isFinite(v)) return;
  const lo = +r.min, hi = +r.max;
  if (v < lo || v > hi) { if (!clampIt) return; v = Math.min(hi, Math.max(lo, v)); n.value = v; }
  if (+r.value === v) return;
  r.value = v; r.dispatchEvent(new Event('input', {bubbles:true}));
}
document.addEventListener('input', e => {
  const t = e.target;
  if (t.classList && t.classList.contains('num')) pushNum(t, false);
  else if (t.type === 'range') { const [, n] = pairOf(t); if (n && document.activeElement !== n) n.value = t.value; }
});
document.addEventListener('change', e => { if (e.target.classList && e.target.classList.contains('num')) { pushNum(e.target, true); const [r] = pairOf(e.target); if (r) e.target.value = r.value; } });
document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.classList && e.target.classList.contains('num')) e.target.blur(); });
function syncNums(){ $$('.rng').forEach(g => { const r = g.querySelector('input[type=range]'), n = g.querySelector('.num'); if (r && n && document.activeElement !== n) n.value = r.value; }); }

/* ───────── 목록 끌어서 순서 바꾸기 (이미지·꾸미기 공통) ───────── */
function sortable(list, getArr, setArr, reversed, after){
  let d = null;
  const ids = () => [...list.querySelectorAll(':scope > .oitem')].map(el => el.dataset.id);
  const apply = order => {
    if (reversed) order.reverse();
    const arr = getArr(), byId = new Map(arr.map(x => [x.id, x]));
    setArr(order.map(id => byId.get(id)).filter(Boolean));
    after(); save();
  };
  list.addEventListener('click', e => { if (e.target.closest('.grip')) e.preventDefault(); });
  list.addEventListener('pointerdown', e => {
    const g = e.target.closest('.grip'); if (!g) return;
    e.preventDefault();
    const item = g.closest('.oitem');
    d = {item, before:ids().join()};
    item.classList.add('dragging'); list.classList.add('sorting');
    g.setPointerCapture(e.pointerId);
  });
  window.addEventListener('pointermove', e => {
    if (!d) return;
    const y = e.clientY;
    const others = [...list.querySelectorAll(':scope > .oitem:not(.dragging)')];
    const next = others.find(el => { const r = el.getBoundingClientRect(); return y < r.top + r.height / 2; });
    if (next) { if (next !== d.item.nextElementSibling) list.insertBefore(d.item, next); }
    else if (d.item !== list.lastElementChild) list.appendChild(d.item);
    // 목록 끝에 가까우면 패널 자동 스크롤
    const p = $('.panel'), pr = p.getBoundingClientRect();
    if (y < pr.top + 70) p.scrollTop -= 12; else if (y > pr.bottom - 50) p.scrollTop += 12;
  });
  const end = () => {
    if (!d) return;
    d.item.classList.remove('dragging'); list.classList.remove('sorting');
    const order = ids(), changed = order.join() !== d.before; d = null;
    if (changed) apply(order);
  };
  window.addEventListener('pointerup', end); window.addEventListener('pointercancel', end);
  // 키보드: 손잡이에 초점을 두고 ↑↓
  list.addEventListener('keydown', e => {
    const g = e.target.closest('.grip'); if (!g || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return;
    e.preventDefault();
    const item = g.closest('.oitem'), id = item.dataset.id, order = ids(), i = order.indexOf(id), j = e.key === 'ArrowUp' ? i - 1 : i + 1;
    if (j < 0 || j >= order.length) return;
    [order[i], order[j]] = [order[j], order[i]];
    apply(order);
    list.querySelector(`.oitem[data-id="${id}"] .grip`)?.focus();
  });
}
sortable($('#favList'), () => S.favs, v => { S.favs = v; }, false, () => { renderFavList(); renderCard(); });
sortable($('#objList'), () => S.objs, v => { S.objs = v; }, true, () => { renderObjList(); renderObjs(); });

/* ───────── 편집기: 테마 ───────── */
function renderThemeEd(){
  $('#themeGrid').innerHTML = Object.entries(THEMES).map(([id, t]) =>
    `<button type="button" class="tc${S.theme === id ? ' on' : ''}" data-t="${id}"><div class="mini m-${id}"></div><div class="txt"><b>${t.name}</b><small>${t.desc}</small></div></button>`).join('');
  $('#palGrid').innerHTML = T().pals.map(([n, c], i) =>
    `<button type="button" class="pal${S.pal === i ? ' on' : ''}" data-p="${i}"><i><span style="background:${c.bg}"></span><span style="background:${c.surface}"></span><span style="background:${c.accent}"></span><span style="background:${c.deco}"></span></i>${n}</button>`).join('') +
    (S.pal === -1 ? `<span class="pal on" style="cursor:default"><i><span style="background:${S.c.bg}"></span><span style="background:${S.c.accent}"></span></i>직접 지정</span>` : '');
  $('#themeCur').textContent = T().name;
  $('#palCur').textContent = S.pal === -1 ? '직접 지정' : T().pals[S.pal][0];
  $('#decoRow').hidden = S.theme !== 'space';
  $('#colorEd').innerHTML = COLOR_KEYS.map(([k, n]) => `<label><input type="color" data-color="${k}" value="${S.c[k]}">${n}</label>`).join('');
  $('#frameSel').innerHTML = Object.entries(FRAMES).map(([k, v]) => `<option value="${k}">${v}</option>`).join('');
  $('#frameSel').value = S.frameDef;
  $('#fontSel').innerHTML = `<option value="">테마 기본 (${FONTS[T().font][0]})</option>` + KR_FONTS.map(f => `<option value="${f}">${FONTS[f][0]}</option>`).join('');
  $('#tfontSel').innerHTML = `<option value="">테마 기본 (${FONTS[T().tfont][0]})</option>` + Object.keys(FONTS).map(f => `<option value="${f}">${FONTS[f][0]}</option>`).join('');
  $('#fontSel').value = S.font; $('#tfontSel').value = S.tfont;
}
$('#themeGrid').addEventListener('click', e => {
  const b = e.target.closest('[data-t]'); if (!b) return;
  S.theme = b.dataset.t; S.pal = 0; S.c = {...T().pals[0][1]}; S.font = ''; S.tfont = ''; S.chipStyle = 'theme';
  syncInputs(); renderThemeEd(); update();
});
$('#palGrid').addEventListener('click', e => {
  const b = e.target.closest('[data-p]'); if (!b) return;
  S.pal = +b.dataset.p; S.c = {...T().pals[S.pal][1]};
  renderThemeEd(); update(); renderObjs();
});
$('#colorEd').addEventListener('input', e => {
  const k = e.target.dataset.color; if (!k) return;
  S.c[k] = e.target.value;
  if (S.pal !== -1) { S.pal = -1; $$('#palGrid .pal').forEach(p => p.classList.remove('on')); $('#palCur').textContent = '직접 지정'; }
  update();
});
$('#colorEd').addEventListener('change', () => renderThemeEd());

/* ───────── 레이아웃 ───────── */
function renderLaySeg(){ $$('#laySeg button').forEach(b => b.classList.toggle('on', b.dataset.lay === S.layout)); }
$('#laySeg').addEventListener('click', e => {
  const b = e.target.closest('[data-lay]'); if (!b) return;
  S.layout = b.dataset.lay;
  if (S.layout === 'vert' && RATIOS[S.ratio] > 1) { S.ratio = '4:5'; if (S.width > 1200) S.width = 1200; }
  if (S.layout !== 'vert' && RATIOS[S.ratio] < 1) { S.ratio = '16:9'; if (S.width < 1600) S.width = 1600; }
  syncInputs(); renderLaySeg(); update(); renderObjs();
});

/* ───────── 기본 입력 바인딩 ───────── */
function showVal(k){ $$(`[data-v="${k}"]`).forEach(o => o.textContent = S[k]); }
$$('[data-bind]').forEach(el => {
  const k = el.dataset.bind;
  const set = () => {
    S[k] = el.type === 'checkbox' ? el.checked : (el.type === 'range' || 'num' in el.dataset) ? +el.value : el.value;
    showVal(k); update();
    if (k === 'width') renderObjs();
  };
  el.addEventListener(el.type === 'checkbox' || el.tagName === 'SELECT' ? 'change' : 'input', set);
});
function bindTitles(root){
  root.querySelectorAll('[data-title]').forEach(el => {
    el.value = S.titles[el.dataset.title];
    el.oninput = () => { S.titles[el.dataset.title] = el.value; update(); };
  });
}
function syncInputs(){
  $$('[data-bind]').forEach(el => {
    const v = S[el.dataset.bind];
    if (el.type === 'checkbox') el.checked = !!v; else el.value = v;
    showVal(el.dataset.bind);
  });
  bindTitles(document);
  $('#profileTh').style.backgroundImage = S.profile ? `url(${S.profile.url})` : '';
  $('#headerTh').style.backgroundImage = S.header ? `url(${S.header.url})` : '';
  syncNums();
}
async function pickSingle(e, key, max){
  const file = e.target.files[0]; e.target.value = '';
  if (!file) return;
  try {
    const {data, ratio} = await loadImage(file, max); dropURL(S[key]); S[key] = {...imgObj(data), ar:ratio};
    if (key === 'header') Object.assign(S, {showHeader:true, headerX:50, headerPos:50, headerZoom:100});
    else Object.assign(S, {pfX:50, pfY:50, pfZoom:100});
  }
  catch { toast('이미지를 읽지 못했어요'); return; }
  syncInputs(); update();
}
$('#profileIn').addEventListener('change', e => pickSingle(e, 'profile', 640));
$('#headerIn').addEventListener('change', e => pickSingle(e, 'header', 1800));
$('#profileDel').onclick = () => { dropURL(S.profile); S.profile = null; syncInputs(); update(); };
$('#pfReset').onclick = () => { Object.assign(S, {pfX:50, pfY:50, pfZoom:100}); syncInputs(); update(); };
$('#hdReset').onclick = () => { Object.assign(S, {headerX:50, headerPos:50, headerZoom:100}); syncInputs(); update(); };
$('#headerDel').onclick = () => { dropURL(S.header); S.header = null; syncInputs(); update(); };

function openTab(name){
  $$('.tabs button').forEach(x => x.classList.toggle('on', x.dataset.tab === name));
  $$('.pane').forEach(p => p.classList.toggle('on', p.dataset.pane === name));
}
$('.tabs').addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if (b) openTab(b.dataset.tab); });

/* ───────── 저장 / 불러오기 ───────── */
const serialize = () => JSON.stringify(S, (k, v) => k === 'url' ? undefined : v);
// 상태 복사: 이미지 데이터 문자열은 공유하고 나머지는 깊은 복사
function snap(v){
  if (Array.isArray(v)) return v.map(snap);
  if (v && typeof v === 'object') { const o = {}; for (const k in v) o[k] = (k === 'data' || k === 'url') ? v[k] : snap(v[k]); return o; }
  return v;
}
const sig = () => JSON.stringify(S, (k, v) => k === 'url' ? undefined : k === 'data' ? v.length + v.slice(-40) : v);
const hist = []; let hIdx = -1;
function commit(){
  const s = sig();
  if (hist[hIdx] && hist[hIdx].sig === s) return;
  hist.splice(hIdx + 1); hist.push({sig:s, st:snap(S)});
  if (hist.length > 80) hist.shift();
  hIdx = hist.length - 1; updHist();
}
function updHist(){ $('#undo').disabled = hIdx <= 0; $('#redo').disabled = hIdx >= hist.length - 1; }
function restore(i){
  hIdx = i; S = snap(hist[i].st); sel = null;
  renderAll(); updHist(); writeStore();
}
const undo = () => { if (hIdx > 0) { restore(hIdx - 1); toast('되돌렸어요'); } };
const redo = () => { if (hIdx < hist.length - 1) { restore(hIdx + 1); toast('다시 실행했어요'); } };
$('#undo').onclick = undo; $('#redo').onclick = redo;
document.addEventListener('keydown', e => {
  if (!(e.ctrlKey || e.metaKey) || /INPUT|TEXTAREA/.test(document.activeElement?.tagName)) return;
  const k = e.key.toLowerCase();
  if (k === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
  else if ((k === 'z' && e.shiftKey) || k === 'y') { e.preventDefault(); redo(); }
});
function writeStore(){
  try { localStorage.setItem(KEY, serialize()); $('#saveWarn').hidden = true; setStatus('자동 저장됨'); }
  catch { $('#saveWarn').hidden = false; setStatus('자동 저장 용량 초과', true); }
}
function setStatus(t, bad){ const s = $('#saveStat'); s.textContent = t; s.classList.toggle('bad', !!bad); }
let saveTimer;
function save(){
  setStatus('저장 중…');
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => { writeStore(); commit(); }, 500);
}
function update(){ renderCard(); save(); }
/* 불러온 데이터는 신뢰하지 않음: 모든 값을 형식·범위에 맞게 걸러서 사용 */
const IMG_RE = /^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/;
const HEX_RE = /^#[0-9a-fA-F]{6}$/;
const ID_RE = /^[a-z0-9]{1,16}$/;
const str = (v, max = 4000) => typeof v === 'string' ? v.slice(0, max) : '';
const num = (v, lo, hi, d) => { const n = Number(v); return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : d; };
const pick = (v, list, d) => list.includes(v) ? v : d;
const hex = (v, d) => typeof v === 'string' && HEX_RE.test(v) ? v.toLowerCase() : d;
const img = x => x && typeof x.data === 'string' && IMG_RE.test(x.data) ? {data:x.data, url:dataToURL(x.data), ar:num(x.ar, .01, 100, undefined)} : null;
const ENUMS = {layout:['left','right','vert'], align:['left','center'], pfShape:['circle','round','square'], tagLayout:['list','row','stack'],
  cap:['below','over','none'], favRatio:['1/1','3/4','2/3','4/3','16/9'], srcPos:['right','below'], galign:['flex-start','center','flex-end'],
  chipStyle:['theme','fill','outline','square','text'], frameDef:Object.keys(FRAMES), ratio:Object.keys(RATIOS)};
const NUMS = {headerH:[120,480], headerPos:[0,100], headerX:[0,100], headerZoom:[100,400], pfSize:[90,260], pfX:[0,100], pfY:[0,100], pfZoom:[100,400],
  favCols:[1,6], fs:[80,140], radius:[0,40], split:[28,62]};
function hydrate(o){
  const d = defaults(), n = defaults();
  o = o && typeof o === 'object' ? o : {};
  if (o.v !== 2) {   // 1차 버전 데이터: 내용만 가져오고 디자인은 새 기본값
    const keep = ['profile','header','showHeader','pfShape','nick','uid','titles','tags','about','caution','ng','pairNG','favs','favRatio','cap','favCenter'];
    const m = {}; keep.forEach(k => { if (k in o) m[k] = o[k]; });
    m.objs = Array.isArray(o.stickers) ? o.stickers.map(s => ({...s, type:'sticker'})) : [];
    o = m;
  }
  for (const k in ENUMS) n[k] = pick(o[k], ENUMS[k], d[k]);
  for (const k in NUMS) n[k] = Math.round(num(o[k], NUMS[k][0], NUMS[k][1], d[k]));
  for (const k of ['showHeader','pairNG','favCenter','decoOn']) n[k] = k in o ? !!o[k] : d[k];
  for (const k of ['nick','uid']) n[k] = k in o ? str(o[k], 60) : d[k];
  for (const k of ['about','caution','ng']) n[k] = k in o ? str(o[k]) : d[k];
  n.width = pick(Number(o.width), [1200, 1600, 1920], d.width);
  n.theme = THEMES[o.theme] ? o.theme : 'simple';
  n.pal = Math.round(num(o.pal, -1, THEMES[n.theme].pals.length - 1, 0));
  const base = THEMES[n.theme].pals[Math.max(0, n.pal)][1], oc = o.c || {};
  n.c = {}; for (const [k] of COLOR_KEYS) n.c[k] = hex(oc[k], base[k]);
  n.font = FONTS[o.font] ? o.font : ''; n.tfont = FONTS[o.tfont] ? o.tfont : '';
  if (o.titles && typeof o.titles === 'object') for (const k in d.titles) if (k in o.titles) n.titles[k] = str(o.titles[k], 60);
  if (o.tags && typeof o.tags === 'object') for (const k of TAG_KEYS) if (Array.isArray(o.tags[k]))
    n.tags[k] = o.tags[k].slice(0, 200).map(x => ({t:str(x && x.t, 80), on:!!(x && x.on)})).filter(x => x.t);
  // 이전 버전에서 빠졌던 DREAM 기본 키워드 OPEN을 한 번 채워 넣음
  if (!o.tagFix1 && !n.tags.dream.find(x => x.t === 'OPEN')) {
    const c = n.tags.dream.findIndex(x => x.t === 'CBC');
    n.tags.dream.splice(c >= 0 ? c + 1 : 0, 0, {t:'OPEN', on:false});
  }
  n.tagFix1 = true;
  n.profile = img(o.profile); n.header = img(o.header);
  n.favs = (Array.isArray(o.favs) ? o.favs : []).map(f => {
    const im = img(f); if (!im) return null;
    return {...im, id:ID_RE.test(f.id) ? f.id : newId(), genre:str(f.genre, 80), name:str(f.name, 80), source:str(f.source, 120),
      pos:num(f.pos, 0, 100, 50), px:num(f.px, 0, 100, 50), zoom:num(f.zoom, 100, 400, 100), frame:pick(f.frame, ['auto', ...Object.keys(FRAMES)], 'auto')};
  }).filter(Boolean);
  n.objs = (Array.isArray(o.objs) ? o.objs : []).map(x => {
    if (!x || typeof x !== 'object') return null;
    const c = {id:ID_RE.test(x.id) ? x.id : newId(), x:num(x.x, -4000, 8000, 100), y:num(x.y, -4000, 12000, 100), w:num(x.w, 10, 4000, 240),
      rot:num(x.rot, -180, 180, 0), op:num(x.op, 0, 100, 100)};
    if (x.type === 'sticker') { const im = img(x); return im && {...c, ...im, type:'sticker', flip:!!x.flip}; }
    if (x.type !== 'text') return null;
    const kind = pick(x.kind, Object.keys(KIND_NAMES), 'plain');
    return {...c, type:'text', kind, text:str(x.text, 2000), by:str(x.by, 120), size:num(x.size, 8, 300, 30),
      align:pick(x.align, ['left','center','right'], 'left'), bold:!!x.bold, font:x.font === 'body' || x.font === 'title' || FONTS[x.font] ? x.font : 'body',
      custom:!!x.custom, fg:hex(x.fg, '#18181c'), bg:hex(x.bg, '#ffffff'),
      hFix:!!x.hFix, h:num(x.h, 20, 4000, 120), valign:pick(x.valign, ['top','middle','bottom'], 'middle'),
      tail:pick(x.tail, ['bl','bc','br','tl','tc','tr','none'], 'bl'), tl:num(x.tl, 20, 400, 80), tw:num(x.tw, 20, 300, 90), tip:num(x.tip, -60, 60, 0), tx:num(x.tx, 0, 80, 15)};
  }).filter(Boolean);
  [n.profile, n.header, ...n.favs].forEach(x => {
    if (!x || x.ar) return;
    const im = new Image(); im.onload = () => { x.ar = im.naturalHeight / im.naturalWidth; applyBgAll(); }; im.src = x.url;
  });
  return n;
}
function renderAll(){ syncInputs(); renderLaySeg(); renderTagEd(); renderFavList(); renderObjList(); renderThemeEd(); renderCard(); renderObjs(); }

function downloadBlob(blob, name){
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name;
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 10000);
}
const stamp = () => new Date().toISOString().slice(0, 10);
$('#projSave').onclick = () => downloadBlob(new Blob([serialize()], {type:'application/json'}), `소개표-프로젝트-${stamp()}.json`);
$('#projLoad').addEventListener('change', async e => {
  const file = e.target.files[0]; e.target.value = '';
  if (!file) return;
  try { S = hydrate(JSON.parse(await file.text())); sel = null; renderAll(); save(); toast('프로젝트를 불러왔어요'); }
  catch { toast('프로젝트 파일을 읽지 못했어요'); }
});
$('#reset').onclick = () => {
  if (!confirm('지금 작업한 내용을 모두 지우고 처음부터 시작할까요?')) return;
  S = defaults(); sel = null; renderAll(); save(); toast('초기화했어요');
};

/* ───────── 이미지 내보내기 ───────── */
const fontCache = new Map();
const blobToData = b => new Promise(r => { const f = new FileReader(); f.onload = () => r(f.result); f.readAsDataURL(b); });
async function fontChunk(fam, chars){
  const key = fam + '|' + chars.join('');
  if (fontCache.has(key)) return fontCache.get(key);
  const qy = FONTS[fam] ? FONTS[fam][1] : '';
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fam).replace(/%20/g, '+')}${qy ? ':' + qy : ''}&text=${encodeURIComponent(chars.join(''))}&display=block`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('font css');
  let css = await res.text();
  const range = chars.map(c => 'U+' + c.codePointAt(0).toString(16)).join(',');
  css = css.replace(/}/g, `unicode-range:${range};}`);
  const urls = [...new Set([...css.matchAll(/url\((https:[^)]+)\)/g)].map(m => m[1]))];
  const datas = await Promise.all(urls.map(async u => blobToData(await (await fetch(u)).blob())));
  urls.forEach((u, i) => { css = css.split(u).join(datas[i]); });
  fontCache.set(key, css);
  return css;
}
async function buildFontCSS(){
  const text = $('#card').innerText + '0123456789@/·—“';
  const chars = [...new Set([...text].filter(c => c.trim()))];
  const chunks = [];
  for (let i = 0; i < chars.length; i += 120) chunks.push(chars.slice(i, i + 120));
  const fams = new Set([bodyFont(), titleFont(), T().ktf].filter(Boolean));
  S.objs.forEach(o => { if (o.type === 'text' && FONTS[o.font]) fams.add(o.font); });
  const parts = await Promise.all([...fams].flatMap(f => chunks.map(ch => fontChunk(f, ch))));
  return parts.join('\n');
}
$('#dl').onclick = async () => {
  const btn = $('#dl');
  if (!window.htmlToImage) { toast('이미지 변환 도구를 불러오지 못했어요. 인터넷 연결을 확인해 주세요.'); return; }
  btn.disabled = true; btn.textContent = '만드는 중…';
  selectObj(null);
  try {
    await document.fonts.ready;
    const card = $('#card'), w = W(), h = card.offsetHeight;
    let pr = +$('#pr').value;
    const LIMIT = 16e6;
    if (w * h * pr * pr > LIMIT) pr = Math.max(.5, Math.floor(Math.sqrt(LIMIT / (w * h)) * 10) / 10);
    const opts = {pixelRatio:pr, width:w, height:h, backgroundColor:S.c.bg, cacheBust:false,
      filter:n => !(n.classList && (n.classList.contains('h') || n.classList.contains('ed')))};
    try { opts.fontEmbedCSS = await buildFontCSS(); } catch { opts.skipFonts = true; }
    if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) await htmlToImage.toCanvas(card, opts);
    const cv = await htmlToImage.toCanvas(card, opts);
    const jpg = $('#fmt').value === 'jpg';
    const blob = await new Promise(r => cv.toBlob(r, jpg ? 'image/jpeg' : 'image/png', .95));
    const safe = (S.nick || '소개표').replace(/[\\/:*?"<>|]/g, '').slice(0, 30);
    downloadBlob(blob, `${safe}-소개표.${jpg ? 'jpg' : 'png'}`);
    toast(`저장했어요 (${cv.width}×${cv.height})`);
  } catch (err) {
    console.error(err); toast('이미지를 만들지 못했어요. 다시 시도해 주세요.');
  } finally { btn.disabled = false; btn.textContent = '이미지 저장'; }
};

let toastTimer;
function toast(msg){
  const t = $('#toast'); t.textContent = msg; t.classList.add('on');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('on'), 2400);
}

/* ───────── 시작 ───────── */
try {
  const raw = localStorage.getItem(KEY) || localStorage.getItem(OLD_KEY);
  if (raw) S = hydrate(JSON.parse(raw));
} catch { S = defaults(); }
renderAll();
commit(); setStatus('자동 저장됨');
document.fonts && document.fonts.ready.then(fit);
}
