import{r as x,p as k,l as C}from"./auth-qdlMy9e7.js";/* empty css              *//* empty css             *//* empty css                  */import{c as I,u as S,d as B,a as E,b as j,e as M,f as V,g as H,h as F,i as L,j as z,k as T,t as A,l as N,m as P,n as D,o as R,p as q,q as O,r as J,s as U,v as Y}from"./admin-DslfRaT8.js";import{i as G,s as o}from"./ui-CfSCUwhT.js";import"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";import"./preload-helper-BKjL65nl.js";const K=await x(["admin"]);k(K);G();document.getElementById("logout-btn").addEventListener("click",C);let y=[];const p=["si-teal","si-gold","si-purple","si-rose","si-blue"];async function d(){try{[y]=await Promise.all([U("teacher")]);const t=await Y();W(t)}catch(t){o(t.message,"error")}}function Q(t){return'<option value="">— ගුරුවරයෙක් තෝරන්න —</option>'+y.map(n=>`<option value="${n.id}" ${n.id===t?"selected":""}>${n.full_name}</option>`).join("")}function W(t){const n=document.getElementById("hierarchy-container");if(!t.length){n.innerHTML='<div class="empty-row">Sections නොමැත. ඉහළ බොත්තම මගින් එකක් එකතු කරන්න.</div>';return}n.innerHTML=t.map((e,r)=>`
    <div class="hierarchy-section" data-section-id="${e.id}">
      <div class="h-header" onclick="toggleBody(this)" style="${e.is_hidden?"background:#fef2f2;border-left:4px solid var(--rose)":""}">
        <h3 style="${e.is_hidden?"opacity:0.5;text-decoration:line-through":""}"><span class="h-icon ${p[r%p.length]}" style="background:var(--g-${p[r%p.length].replace("si-","")})">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
        </span>${e.name} ${e.is_hidden?'<span style="font-size:0.7rem;color:var(--rose);background:#ffe4e6;padding:2px 6px;border-radius:4px;text-decoration:none">Hidden</span>':""}</h3>
        <div class="h-actions" onclick="event.stopPropagation()">
          <button class="btn-edit" onclick="toggleSecVis('${e.id}', ${!e.is_hidden})" title="Toggle Visibility">${e.is_hidden?"👁️‍🗨️ Show":"👁️ Hide"}</button>
          <button class="btn-edit" onclick="editSection('${e.id}','${u(e.name)}','${u(e.description||"")}')">✏️</button>
          <button class="btn-del" onclick="delSection('${e.id}','${u(e.name)}')">🗑️</button>
          <button class="btn-add" onclick="showAddCategory('${e.id}')">+ Category</button>
        </div>
      </div>
      <div class="h-body" id="body-${e.id}">
        <!-- Add Category Row -->
        <div class="add-row" id="add-cat-${e.id}" style="display:none;background:#fafbfc">
          <input type="text" id="cat-name-${e.id}" placeholder="Category නම (e.g. A/L Main)">
          <button class="inline-btn inline-btn-teal" onclick="saveCategory('${e.id}')">එකතු කරන්න</button>
        </div>
        ${e.categories.length===0?'<div class="empty-row">Categories නොමැත.</div>':e.categories.map(i=>`
          <div class="cat-block" data-cat-id="${i.id}">
            <div class="cat-header" style="${i.is_hidden?"background:#fef2f2":""}">
              <h4 style="${i.is_hidden?"opacity:0.5;text-decoration:line-through":""}">${i.name} ${i.is_hidden?'<span style="font-size:0.7rem;color:var(--rose);background:#ffe4e6;padding:2px 6px;border-radius:4px;text-decoration:none">Hidden</span>':""}</h4>
              <div class="h-actions">
                <button class="btn-edit" onclick="toggleCatVis('${i.id}', ${!i.is_hidden})" title="Toggle Visibility">${i.is_hidden?"👁️‍🗨️ Show":"👁️ Hide"}</button>
                <button class="btn-edit" onclick="editCategory('${i.id}','${u(i.name)}')">✏️</button>
                <button class="btn-del" onclick="delCategory('${i.id}','${u(i.name)}')">🗑️</button>
                <button class="btn-add" onclick="showAddSubject('${i.id}')">+ Subject</button>
              </div>
            </div>
            <!-- Add Subject Row -->
            <div class="add-row" id="add-sub-${i.id}" style="display:none;padding-left:3.5rem">
              <input type="text" id="sub-name-${i.id}" placeholder="Subject නම (e.g. Buddhism)">
              <select id="sub-teacher-${i.id}">${Q()}</select>
              <button class="inline-btn inline-btn-teal" onclick="saveSubject('${i.id}')">එකතු කරන්න</button>
            </div>
            ${i.subjects.length===0?'<div class="empty-row" style="padding-left:3.5rem">Subjects නොමැත.</div>':i.subjects.map(s=>`
              <div class="sub-block" style="${s.is_hidden?"background:#fef2f2":""}">
                <div class="sub-info">
                  <div class="sub-name" style="${s.is_hidden?"opacity:0.5;text-decoration:line-through":""}">${s.name} ${s.is_hidden?'<span style="font-size:0.7rem;color:var(--rose);background:#ffe4e6;padding:2px 6px;border-radius:4px;text-decoration:none">Hidden</span>':""}</div>
                  <div class="sub-teacher">👤 ${s.teacher?.full_name||"ගුරුවරයෙක් නොමැත"}</div>
                  <div class="course-chips">
                    ${s.courses.map(a=>`
                      <div class="course-chip" style="display:flex;align-items:center;gap:0.4rem;padding:0.4rem 0.8rem;${a.is_hidden?"opacity:0.6":""};${a.payments_paused?"border-color:var(--gold);background:#fef3c7":""}">
                        <span style="${a.is_hidden?"text-decoration:line-through":""}">${a.name}</span>
                        ${a.is_free?'<span style="background:var(--g-teal);color:white;padding:2px 6px;border-radius:4px;font-size:0.7rem;text-decoration:none">Free</span>':`<span style="font-size:0.7rem;color:var(--text-muted);text-decoration:none">Rs.${a.fee||2500}</span>`}
                        ${a.is_hidden?'<span style="font-size:0.65rem;color:var(--rose);background:#ffe4e6;padding:2px 4px;border-radius:4px;text-decoration:none">Hidden</span>':""}
                        ${a.payments_paused?'<span style="font-size:0.65rem;color:var(--gold);background:#fef3c7;padding:2px 4px;border-radius:4px;text-decoration:none">Payments Paused</span>':""}
                        <span class="chip-edit" onclick="toggleCourseVis('${a.id}', ${!a.is_hidden})" title="Toggle Visibility">${a.is_hidden?"👁️‍🗨️":"👁️"}</span>
                        <span class="chip-edit" onclick="toggleCoursePay('${a.id}', ${!a.payments_paused})" title="Toggle Payments">${a.payments_paused?"▶️":"⏸️"}</span>
                        <span class="chip-edit" onclick="editCourse('${a.id}','${u(a.name)}', ${a.fee||2500}, ${a.is_free||!1})">✏️</span>
                        <span class="chip-del" onclick="delCourse('${a.id}','${u(a.name)}')">✕</span>
                        <button style="margin-left:0.5rem;background:var(--g-purple);color:white;border:none;border-radius:1rem;padding:0.2rem 0.6rem;font-size:0.7rem;cursor:pointer;font-weight:700;text-decoration:none" onclick='openMonthModal(${JSON.stringify(a).replace(/'/g,"&apos;")})'>🗓️ මාස කළමනාකරණය (${a.course_months?.length||0})</button>
                      </div>
                    `).join("")}
                    <span class="course-chip" style="background:#e0f2fe;border-color:#bae6fd;cursor:pointer;color:var(--teal)" onclick="showAddCourse('${s.id}')">+ Course</span>
                  </div>
                  <div class="add-row" id="add-course-${s.id}" style="display:none;padding:0.5rem 0 0 0;flex-wrap:wrap">
                    <input type="text" id="course-name-${s.id}" placeholder="Course නම" style="max-width:180px">
                    <input type="number" id="course-months-${s.id}" placeholder="මාස ගණන" min="0" style="max-width:100px">
                    <input type="number" id="course-fee-${s.id}" placeholder="ගාස්තුව (රු.)" value="2500" style="max-width:100px">
                    <label style="display:flex;align-items:center;gap:0.4rem;font-size:0.8rem"><input type="checkbox" id="course-free-${s.id}"> Free</label>
                    <button class="inline-btn inline-btn-teal" onclick="saveCourse('${s.id}')">එකතු</button>
                  </div>
                </div>
                <div class="h-actions">
                  <button class="btn-edit" onclick="toggleSubVis('${s.id}', ${!s.is_hidden})" title="Toggle Visibility">${s.is_hidden?"👁️‍🗨️ Show":"👁️ Hide"}</button>
                  <button class="btn-edit" onclick="editSubject('${s.id}','${u(s.name)}','${s.teacher?.id||""}')">✏️</button>
                  <button class="btn-del" onclick="delSubject('${s.id}','${u(s.name)}')">🗑️</button>
                </div>
              </div>
            `).join("")}
          </div>
        `).join("")}
      </div>
    </div>
  `).join("")}function u(t){return(t||"").replace(/'/g,"\\'").replace(/"/g,"&quot;")}window.toggleBody=t=>{t.nextElementSibling.classList.toggle("collapsed")};document.getElementById("btn-add-section").addEventListener("click",()=>{document.getElementById("add-section-row").style.display="flex",document.getElementById("new-sec-name").focus()});document.getElementById("save-new-section").addEventListener("click",async()=>{const t=document.getElementById("new-sec-name").value.trim(),n=document.getElementById("new-sec-desc").value.trim();if(!t)return o("නමක් ඇතුළත් කරන්න","warning");try{await I(t,n),o("Section එකතු කරන ලදී ✅","success"),document.getElementById("add-section-row").style.display="none",document.getElementById("new-sec-name").value="",document.getElementById("new-sec-desc").value="",d()}catch(e){o(e.message,"error")}});window.editSection=async(t,n,e)=>{const r=prompt("Section නම වෙනස් කරන්න:",n);if(!r||r===n)return;const i=prompt("විස්තරය:",e);try{await S(t,r,i||e),o("Section යාවත්කාලීන කරන ලදී","success"),d()}catch(s){o(s.message,"error")}};window.delSection=async(t,n)=>{if(confirm(`"${n}" Section එක සහ එහි ඇති සියලුම දත්ත මකා දැමිය යුතුද?

මෙය ආපසු හැරවිය නොහැක!`))try{await B(t),o("Section මකා දමන ලදී","success"),d()}catch(e){o(e.message,"error")}};window.showAddCategory=t=>{const n=document.getElementById(`add-cat-${t}`);n.style.display=n.style.display==="none"?"flex":"none",n.style.display==="flex"&&document.getElementById(`cat-name-${t}`).focus()};window.saveCategory=async t=>{const n=document.getElementById(`cat-name-${t}`).value.trim();if(!n)return o("Category නමක් ඇතුළත් කරන්න","warning");try{await E(t,n),o("Category එකතු කරන ලදී ✅","success"),d()}catch(e){o(e.message,"error")}};window.editCategory=async(t,n)=>{const e=prompt("Category නම වෙනස් කරන්න:",n);if(!(!e||e===n))try{await j(t,e),o("Category යාවත්කාලීන කරන ලදී","success"),d()}catch(r){o(r.message,"error")}};window.delCategory=async(t,n)=>{if(confirm(`"${n}" Category එක මකා දැමිය යුතුද?`))try{await M(t),o("Category මකා දමන ලදී","success"),d()}catch(e){o(e.message,"error")}};window.showAddSubject=t=>{const n=document.getElementById(`add-sub-${t}`);n.style.display=n.style.display==="none"?"flex":"none"};window.saveSubject=async t=>{const n=document.getElementById(`sub-name-${t}`).value.trim(),e=document.getElementById(`sub-teacher-${t}`).value;if(!n)return o("Subject නමක් ඇතුළත් කරන්න","warning");try{await V(t,n,e),o("Subject එකතු කරන ලදී ✅","success"),d()}catch(r){o(r.message,"error")}};window.editSubject=async(t,n,e)=>{const r=prompt("Subject නම වෙනස් කරන්න:",n);if(!r)return;const i=y.map((c,g)=>`${g+1}. ${c.full_name}`).join(`
`),s=prompt(`ගුරුවරයා තෝරන්න (අංකය):
0. නොමැත
${i}`);let a=e;if(s!==null){const c=parseInt(s);a=c>0&&c<=y.length?y[c-1].id:null}try{await H(t,r,a),o("Subject යාවත්කාලීන කරන ලදී","success"),d()}catch(c){o(c.message,"error")}};window.delSubject=async(t,n)=>{if(confirm(`"${n}" Subject එක මකා දැමිය යුතුද?`))try{await F(t),o("Subject මකා දමන ලදී","success"),d()}catch(e){o(e.message,"error")}};window.showAddCourse=t=>{const n=document.getElementById(`add-course-${t}`);n.style.display=n.style.display==="none"?"flex":"none"};window.saveCourse=async t=>{const n=document.getElementById(`course-name-${t}`).value.trim(),e=document.getElementById(`course-months-${t}`).value,r=document.getElementById(`course-fee-${t}`).value||2500,i=document.getElementById(`course-free-${t}`).checked;if(!n)return o("Course නමක් ඇතුළත් කරන්න","warning");try{await L(t,n,e,r,i),o("Course එකතු කරන ලදී ✅","success"),d()}catch(s){o(s.message,"error")}};window.editCourse=async(t,n,e,r)=>{const i=prompt("Course නම වෙනස් කරන්න:",n);if(!i)return;const s=prompt("ගාස්තුව (රු.):",e||2500),a=confirm("මෙම පාඨමාලාව සම්පූර්ණයෙන්ම නොමිලේ ලබා දෙන එකක්ද?");try{await z(t,i,s||2500,a),o("Course යාවත්කාලීන කරන ලදී","success"),d()}catch(c){o(c.message,"error")}};window.delCourse=async(t,n)=>{if(confirm(`"${n}" Course එක මකා දැමිය යුතුද?`))try{await T(t),o("Course මකා දමන ලදී","success"),d()}catch(e){o(e.message,"error")}};window.toggleSecVis=async(t,n)=>{try{await A(t,n),o("යාවත්කාලීන කරන ලදී","success"),d()}catch(e){o(e.message,"error")}};window.toggleCatVis=async(t,n)=>{try{await N(t,n),o("යාවත්කාලීන කරන ලදී","success"),d()}catch(e){o(e.message,"error")}};window.toggleSubVis=async(t,n)=>{try{await P(t,n),o("යාවත්කාලීන කරන ලදී","success"),d()}catch(e){o(e.message,"error")}};window.toggleCourseVis=async(t,n)=>{try{await D(t,n),o("යාවත්කාලීන කරන ලදී","success"),d()}catch(e){o(e.message,"error")}};window.toggleCoursePay=async(t,n)=>{try{await R(t,n),o("යාවත්කාලීන කරන ලදී","success"),d()}catch(e){o(e.message,"error")}};let l=null;window.openMonthModal=t=>{const n=typeof t=="string"?JSON.parse(t):t;l=n,document.getElementById("modal-course-title").textContent=`${n.name} - මාස කළමනාකරණය`,document.getElementById("new-m-year").value=new Date().getFullYear(),document.getElementById("new-m-num").value="",document.getElementById("new-m-name").value="",document.getElementById("new-m-sheet").value="",document.getElementById("new-m-deadline").value="14",document.getElementById("new-m-free").checked=!1,h(n.course_months||[]),document.getElementById("month-modal").classList.add("active")};window.closeMonthModal=()=>{document.getElementById("month-modal").classList.remove("active"),l=null,d()};function h(t){const n=document.getElementById("modal-month-list");if(!t.length){n.innerHTML='<div style="text-align:center;padding:1rem;color:var(--text-muted)">මාස කිසිවක් එක් කර නොමැත.</div>';return}t.sort((e,r)=>e.year!==r.year?e.year-r.year:e.month_number-r.month_number),n.innerHTML=t.map(e=>`
    <div class="month-item">
      <div class="month-item-info">
        <div class="month-item-title">${e.year} - ${e.name} (මාසය ${e.month_number}) ${e.is_free?'<span style="background:var(--g-teal);color:white;padding:2px 6px;border-radius:4px;font-size:0.7rem">Free</span>':""}</div>
        <div class="month-item-meta">
          ${e.google_sheet_url?`<a href="${e.google_sheet_url}" target="_blank" style="color:var(--teal)">📊 Sheet</a>`:'<span style="color:var(--rose)">Sheet නැත</span>'}
          <span style="color:var(--dark3);margin-left:0.5rem">| Deadline: ${e.payment_deadline_date} වෙනිදා</span>
        </div>
      </div>
      <div style="display:flex;gap:0.5rem">
        <button class="btn-edit" style="background:none;border:none;cursor:pointer" onclick="editMonthItem('${e.id}', ${e.year}, ${e.month_number}, '${u(e.name)}', '${u(e.google_sheet_url||"")}', ${e.payment_deadline_date||14}, ${e.is_free||!1})">✏️</button>
        <button class="btn-del" style="background:none;border:none;cursor:pointer" onclick="delMonthItem('${e.id}', '${e.year} ${u(e.name)}')">🗑️</button>
      </div>
    </div>
  `).join("")}window.saveNewMonth=async()=>{if(!l)return;const t=parseInt(document.getElementById("new-m-year").value),n=parseInt(document.getElementById("new-m-num").value),e=document.getElementById("new-m-name").value.trim(),r=document.getElementById("new-m-sheet").value.trim(),i=parseInt(document.getElementById("new-m-deadline").value)||14,s=document.getElementById("new-m-free").checked;if(!t||!n||!e)return o("අවුරුද්ද, මාසයේ අංකය සහ නම අනිවාර්යයි!","warning");try{const a=await q(l.id,t,n,e,r,i,s);l.course_months||(l.course_months=[]),l.course_months.push(a),h(l.course_months),o("නව මාසය එකතු කරන ලදී ✅","success"),document.getElementById("new-m-num").value="",document.getElementById("new-m-name").value="",document.getElementById("new-m-sheet").value="",document.getElementById("new-m-deadline").value="14",document.getElementById("new-m-free").checked=!1}catch(a){a.code==="23505"?o("මෙම මාසයේ අංකය දැනටමත් පවතී!","error"):o(a.message,"error")}};window.editMonthItem=async(t,n,e,r,i,s,a)=>{const c=prompt("අවුරුද්ද:",n);if(!c)return;const g=prompt("මාසයේ අංකය (1-12):",e);if(!g)return;const w=prompt("මාසයේ නම:",r);if(!w)return;const f=prompt("Google Sheet Link:",i),v=prompt("Deadline දිනය (1-31):",s),b=parseInt(v)||14,$=confirm("මෙම මාසය නොමිලේ දෙන එකක්ද? (Free)");try{await O(t,parseInt(c),parseInt(g),w,f||"",b,$);const m=l.course_months.find(_=>_.id===t);m&&(m.year=parseInt(c),m.month_number=parseInt(g),m.name=w,m.google_sheet_url=f||null,m.payment_deadline_date=b,m.is_free=$),h(l.course_months),o("මාසය යාවත්කාලීන කරන ලදී","success")}catch(m){o(m.message,"error")}};window.delMonthItem=async(t,n)=>{if(confirm(`"${n}" මාසය මකා දැමිය යුතුද?`))try{await J(t),l.course_months=l.course_months.filter(e=>e.id!==t),h(l.course_months),o("මාසය මකා දමන ලදී","success")}catch(e){o(e.message,"error")}};document.getElementById("month-modal").addEventListener("click",t=>{t.target.id==="month-modal"&&closeMonthModal()});d();
