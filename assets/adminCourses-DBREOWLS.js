import{c as B,p as E,d as C,f as k,s as o}from"./ui-BjnYUZX8.js";/* empty css              *//* empty css                  */import{b as S,e as _,f as x,h as j,i as M,j as F,k as L,l as A,m as N,n as H,o as z,p as D,q as T,r as R,s as q,a as O,g as J}from"./admin-CwIngFm3.js";import"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";import"./preload-helper-BKjL65nl.js";const P=await B(["admin"]);E(P);C();document.getElementById("logout-btn").addEventListener("click",k);let p=[];const g=["si-teal","si-gold","si-purple","si-rose","si-blue"];async function d(){try{[p]=await Promise.all([O("teacher")]);const t=await J();Y(t)}catch(t){o(t.message,"error")}}function U(t){return'<option value="">— ගුරුවරයෙක් තෝරන්න —</option>'+p.map(n=>`<option value="${n.id}" ${n.id===t?"selected":""}>${n.full_name}</option>`).join("")}function Y(t){const n=document.getElementById("hierarchy-container");if(!t.length){n.innerHTML='<div class="empty-row">Sections නොමැත. ඉහළ බොත්තම මගින් එකක් එකතු කරන්න.</div>';return}n.innerHTML=t.map((e,r)=>`
    <div class="hierarchy-section" data-section-id="${e.id}">
      <div class="h-header" onclick="toggleBody(this)">
        <h3><span class="h-icon ${g[r%g.length]}" style="background:var(--g-${g[r%g.length].replace("si-","")})">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
        </span>${e.name}</h3>
        <div class="h-actions" onclick="event.stopPropagation()">
          <button class="btn-edit" onclick="editSection('${e.id}','${m(e.name)}','${m(e.description||"")}')">✏️</button>
          <button class="btn-del" onclick="delSection('${e.id}','${m(e.name)}')">🗑️</button>
          <button class="btn-add" onclick="showAddCategory('${e.id}')">+ Category</button>
        </div>
      </div>
      <div class="h-body" id="body-${e.id}">
        <!-- Add Category Row -->
        <div class="add-row" id="add-cat-${e.id}" style="display:none;background:#fafbfc">
          <input type="text" id="cat-name-${e.id}" placeholder="Category නම (e.g. A/L Main)">
          <button class="inline-btn inline-btn-teal" onclick="saveCategory('${e.id}')">එකතු කරන්න</button>
        </div>
        ${e.categories.length===0?'<div class="empty-row">Categories නොමැත.</div>':e.categories.map(a=>`
          <div class="cat-block" data-cat-id="${a.id}">
            <div class="cat-header">
              <h4>${a.name}</h4>
              <div class="h-actions">
                <button class="btn-edit" onclick="editCategory('${a.id}','${m(a.name)}')">✏️</button>
                <button class="btn-del" onclick="delCategory('${a.id}','${m(a.name)}')">🗑️</button>
                <button class="btn-add" onclick="showAddSubject('${a.id}')">+ Subject</button>
              </div>
            </div>
            <!-- Add Subject Row -->
            <div class="add-row" id="add-sub-${a.id}" style="display:none;padding-left:3.5rem">
              <input type="text" id="sub-name-${a.id}" placeholder="Subject නම (e.g. Buddhism)">
              <select id="sub-teacher-${a.id}">${U()}</select>
              <button class="inline-btn inline-btn-teal" onclick="saveSubject('${a.id}')">එකතු කරන්න</button>
            </div>
            ${a.subjects.length===0?'<div class="empty-row" style="padding-left:3.5rem">Subjects නොමැත.</div>':a.subjects.map(s=>`
              <div class="sub-block">
                <div class="sub-info">
                  <div class="sub-name">${s.name}</div>
                  <div class="sub-teacher">👤 ${s.teacher?.full_name||"ගුරුවරයෙක් නොමැත"}</div>
                  <div class="course-chips">
                    ${s.courses.map(i=>`
                      <div class="course-chip" style="display:flex;align-items:center;gap:0.4rem;padding:0.4rem 0.8rem">
                        ${i.name} ${i.is_free?'<span style="background:var(--g-teal);color:white;padding:2px 6px;border-radius:4px;font-size:0.7rem">Free</span>':`<span style="font-size:0.7rem;color:var(--text-muted)">Rs.${i.fee||2500}</span>`}
                        <span class="chip-edit" onclick="editCourse('${i.id}','${m(i.name)}', ${i.fee||2500}, ${i.is_free||!1})">✏️</span>
                        <span class="chip-del" onclick="delCourse('${i.id}','${m(i.name)}')">✕</span>
                        <button style="margin-left:0.5rem;background:var(--g-purple);color:white;border:none;border-radius:1rem;padding:0.2rem 0.6rem;font-size:0.7rem;cursor:pointer;font-weight:700" onclick='openMonthModal(${JSON.stringify(i).replace(/'/g,"&apos;")})'>🗓️ මාස කළමනාකරණය (${i.course_months?.length||0})</button>
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
                  <button class="btn-edit" onclick="editSubject('${s.id}','${m(s.name)}','${s.teacher?.id||""}')">✏️</button>
                  <button class="btn-del" onclick="delSubject('${s.id}','${m(s.name)}')">🗑️</button>
                </div>
              </div>
            `).join("")}
          </div>
        `).join("")}
      </div>
    </div>
  `).join("")}function m(t){return(t||"").replace(/'/g,"\\'").replace(/"/g,"&quot;")}window.toggleBody=t=>{t.nextElementSibling.classList.toggle("collapsed")};document.getElementById("btn-add-section").addEventListener("click",()=>{document.getElementById("add-section-row").style.display="flex",document.getElementById("new-sec-name").focus()});document.getElementById("save-new-section").addEventListener("click",async()=>{const t=document.getElementById("new-sec-name").value.trim(),n=document.getElementById("new-sec-desc").value.trim();if(!t)return o("නමක් ඇතුළත් කරන්න","warning");try{await S(t,n),o("Section එකතු කරන ලදී ✅","success"),document.getElementById("add-section-row").style.display="none",document.getElementById("new-sec-name").value="",document.getElementById("new-sec-desc").value="",d()}catch(e){o(e.message,"error")}});window.editSection=async(t,n,e)=>{const r=prompt("Section නම වෙනස් කරන්න:",n);if(!r||r===n)return;const a=prompt("විස්තරය:",e);try{await _(t,r,a||e),o("Section යාවත්කාලීන කරන ලදී","success"),d()}catch(s){o(s.message,"error")}};window.delSection=async(t,n)=>{if(confirm(`"${n}" Section එක සහ එහි ඇති සියලුම දත්ත මකා දැමිය යුතුද?

මෙය ආපසු හැරවිය නොහැක!`))try{await x(t),o("Section මකා දමන ලදී","success"),d()}catch(e){o(e.message,"error")}};window.showAddCategory=t=>{const n=document.getElementById(`add-cat-${t}`);n.style.display=n.style.display==="none"?"flex":"none",n.style.display==="flex"&&document.getElementById(`cat-name-${t}`).focus()};window.saveCategory=async t=>{const n=document.getElementById(`cat-name-${t}`).value.trim();if(!n)return o("Category නමක් ඇතුළත් කරන්න","warning");try{await j(t,n),o("Category එකතු කරන ලදී ✅","success"),d()}catch(e){o(e.message,"error")}};window.editCategory=async(t,n)=>{const e=prompt("Category නම වෙනස් කරන්න:",n);if(!(!e||e===n))try{await M(t,e),o("Category යාවත්කාලීන කරන ලදී","success"),d()}catch(r){o(r.message,"error")}};window.delCategory=async(t,n)=>{if(confirm(`"${n}" Category එක මකා දැමිය යුතුද?`))try{await F(t),o("Category මකා දමන ලදී","success"),d()}catch(e){o(e.message,"error")}};window.showAddSubject=t=>{const n=document.getElementById(`add-sub-${t}`);n.style.display=n.style.display==="none"?"flex":"none"};window.saveSubject=async t=>{const n=document.getElementById(`sub-name-${t}`).value.trim(),e=document.getElementById(`sub-teacher-${t}`).value;if(!n)return o("Subject නමක් ඇතුළත් කරන්න","warning");try{await L(t,n,e),o("Subject එකතු කරන ලදී ✅","success"),d()}catch(r){o(r.message,"error")}};window.editSubject=async(t,n,e)=>{const r=prompt("Subject නම වෙනස් කරන්න:",n);if(!r)return;const a=p.map((c,y)=>`${y+1}. ${c.full_name}`).join(`
`),s=prompt(`ගුරුවරයා තෝරන්න (අංකය):
0. නොමැත
${a}`);let i=e;if(s!==null){const c=parseInt(s);i=c>0&&c<=p.length?p[c-1].id:null}try{await A(t,r,i),o("Subject යාවත්කාලීන කරන ලදී","success"),d()}catch(c){o(c.message,"error")}};window.delSubject=async(t,n)=>{if(confirm(`"${n}" Subject එක මකා දැමිය යුතුද?`))try{await N(t),o("Subject මකා දමන ලදී","success"),d()}catch(e){o(e.message,"error")}};window.showAddCourse=t=>{const n=document.getElementById(`add-course-${t}`);n.style.display=n.style.display==="none"?"flex":"none"};window.saveCourse=async t=>{const n=document.getElementById(`course-name-${t}`).value.trim(),e=document.getElementById(`course-months-${t}`).value,r=document.getElementById(`course-fee-${t}`).value||2500,a=document.getElementById(`course-free-${t}`).checked;if(!n)return o("Course නමක් ඇතුළත් කරන්න","warning");try{await H(t,n,e,r,a),o("Course එකතු කරන ලදී ✅","success"),d()}catch(s){o(s.message,"error")}};window.editCourse=async(t,n,e,r)=>{const a=prompt("Course නම වෙනස් කරන්න:",n);if(!a)return;const s=prompt("ගාස්තුව (රු.):",e||2500),i=confirm("මෙම පාඨමාලාව සම්පූර්ණයෙන්ම නොමිලේ ලබා දෙන එකක්ද?");try{await z(t,a,s||2500,i),o("Course යාවත්කාලීන කරන ලදී","success"),d()}catch(c){o(c.message,"error")}};window.delCourse=async(t,n)=>{if(confirm(`"${n}" Course එක මකා දැමිය යුතුද?`))try{await D(t),o("Course මකා දමන ලදී","success"),d()}catch(e){o(e.message,"error")}};let l=null;window.openMonthModal=t=>{const n=typeof t=="string"?JSON.parse(t):t;l=n,document.getElementById("modal-course-title").textContent=`${n.name} - මාස කළමනාකරණය`,document.getElementById("new-m-year").value=new Date().getFullYear(),document.getElementById("new-m-num").value="",document.getElementById("new-m-name").value="",document.getElementById("new-m-sheet").value="",document.getElementById("new-m-deadline").value="14",document.getElementById("new-m-free").checked=!1,h(n.course_months||[]),document.getElementById("month-modal").classList.add("active")};window.closeMonthModal=()=>{document.getElementById("month-modal").classList.remove("active"),l=null,d()};function h(t){const n=document.getElementById("modal-month-list");if(!t.length){n.innerHTML='<div style="text-align:center;padding:1rem;color:var(--text-muted)">මාස කිසිවක් එක් කර නොමැත.</div>';return}t.sort((e,r)=>e.year!==r.year?e.year-r.year:e.month_number-r.month_number),n.innerHTML=t.map(e=>`
    <div class="month-item">
      <div class="month-item-info">
        <div class="month-item-title">${e.year} - ${e.name} (මාසය ${e.month_number}) ${e.is_free?'<span style="background:var(--g-teal);color:white;padding:2px 6px;border-radius:4px;font-size:0.7rem">Free</span>':""}</div>
        <div class="month-item-meta">
          ${e.google_sheet_url?`<a href="${e.google_sheet_url}" target="_blank" style="color:var(--teal)">📊 Sheet</a>`:'<span style="color:var(--rose)">Sheet නැත</span>'}
          <span style="color:var(--dark3);margin-left:0.5rem">| Deadline: ${e.payment_deadline_date} වෙනිදා</span>
        </div>
      </div>
      <div style="display:flex;gap:0.5rem">
        <button class="btn-edit" style="background:none;border:none;cursor:pointer" onclick="editMonthItem('${e.id}', ${e.year}, ${e.month_number}, '${m(e.name)}', '${m(e.google_sheet_url||"")}', ${e.payment_deadline_date||14}, ${e.is_free||!1})">✏️</button>
        <button class="btn-del" style="background:none;border:none;cursor:pointer" onclick="delMonthItem('${e.id}', '${e.year} ${m(e.name)}')">🗑️</button>
      </div>
    </div>
  `).join("")}window.saveNewMonth=async()=>{if(!l)return;const t=parseInt(document.getElementById("new-m-year").value),n=parseInt(document.getElementById("new-m-num").value),e=document.getElementById("new-m-name").value.trim(),r=document.getElementById("new-m-sheet").value.trim(),a=parseInt(document.getElementById("new-m-deadline").value)||14,s=document.getElementById("new-m-free").checked;if(!t||!n||!e)return o("අවුරුද්ද, මාසයේ අංකය සහ නම අනිවාර්යයි!","warning");try{const i=await T(l.id,t,n,e,r,a,s);l.course_months||(l.course_months=[]),l.course_months.push(i),h(l.course_months),o("නව මාසය එකතු කරන ලදී ✅","success"),document.getElementById("new-m-num").value="",document.getElementById("new-m-name").value="",document.getElementById("new-m-sheet").value="",document.getElementById("new-m-deadline").value="14",document.getElementById("new-m-free").checked=!1}catch(i){i.code==="23505"?o("මෙම මාසයේ අංකය දැනටමත් පවතී!","error"):o(i.message,"error")}};window.editMonthItem=async(t,n,e,r,a,s,i)=>{const c=prompt("අවුරුද්ද:",n);if(!c)return;const y=prompt("මාසයේ අංකය (1-12):",e);if(!y)return;const w=prompt("මාසයේ නම:",r);if(!w)return;const v=prompt("Google Sheet Link:",a),$=prompt("Deadline දිනය (1-31):",s),f=parseInt($)||14,b=confirm("මෙම මාසය නොමිලේ දෙන එකක්ද? (Free)");try{await R(t,parseInt(c),parseInt(y),w,v||"",f,b);const u=l.course_months.find(I=>I.id===t);u&&(u.year=parseInt(c),u.month_number=parseInt(y),u.name=w,u.google_sheet_url=v||null,u.payment_deadline_date=f,u.is_free=b),h(l.course_months),o("මාසය යාවත්කාලීන කරන ලදී","success")}catch(u){o(u.message,"error")}};window.delMonthItem=async(t,n)=>{if(confirm(`"${n}" මාසය මකා දැමිය යුතුද?`))try{await q(t),l.course_months=l.course_months.filter(e=>e.id!==t),h(l.course_months),o("මාසය මකා දමන ලදී","success")}catch(e){o(e.message,"error")}};document.getElementById("month-modal").addEventListener("click",t=>{t.target.id==="month-modal"&&closeMonthModal()});d();
