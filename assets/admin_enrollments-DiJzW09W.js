import{r as v,p as w,l as E}from"./auth-5l32Gasm.js";/* empty css              *//* empty css             *//* empty css                  */import{x as g,y as b,v as x,w as $,z as M,A as B,B as I,C as L}from"./admin-BXWvPR6F.js";import{i as A,s as a}from"./ui-CfSCUwhT.js";import"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";import"./preload-helper-BKjL65nl.js";const _=await v(["admin"]);w(_);A();document.getElementById("logout-btn").addEventListener("click",E);let y=[];async function k(e,t=[]){try{return await e}catch(n){return console.error("Fetch error:",n),t}}async function d(){y=await k(L(),[]),f(y)}function f(e){const t=document.getElementById("enroll-list-container");if(!e.length){t.innerHTML=`<div style="text-align:center;padding:3rem;background:#fff;border-radius:var(--radius-xl);border:1px dashed #cbd5e1">
      <h3 style="color:var(--text-muted);font-size:1rem">ලියාපදිංචි කිසිවක් හමු නොවීය.</h3>
    </div>`;return}const n={};e.forEach(s=>{if(!s.student)return;const o=s.student_id;n[o]||(n[o]={student:s.student,enrollments:[]}),n[o].enrollments.push(s)});const r=Object.values(n);t.innerHTML=r.map(s=>`
    <div class="enrollment-card" style="flex-direction:column; align-items:stretch; gap:1rem">
      <div class="ec-info" style="display:flex; justify-content:space-between; align-items:center; border-bottom:1.5px solid #f1f5f9; padding-bottom:0.75rem">
        <div>
          <h4 style="font-size:1.2rem; color:var(--teal)">${s.student?.full_name||"—"}</h4>
          <div class="ec-meta">
            <strong>WhatsApp:</strong> <span class="eng">${s.student?.whatsapp_number||"—"}</span>
          </div>
        </div>
      </div>
      <div class="ec-courses">
        <h5 style="font-size:0.85rem; font-weight:700; color:var(--dark3); margin-bottom:0.75rem; text-transform:uppercase; letter-spacing:0.5px">ලියාපදිංචි පාඨමාලා</h5>
        <div style="display:flex; flex-direction:column; gap:0.5rem">
          ${s.enrollments.map(o=>`
            <div style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; padding:0.75rem 1rem; border-radius:var(--radius-md); border:1px solid #e2e8f0; flex-wrap:wrap; gap:0.5rem">
              <div style="font-weight:700; color:var(--dark); font-size:0.95rem">${o.course?.name||"—"}</div>
              <div class="ec-actions" style="margin:0">
                <button class="btn btn-sm btn-teal" onclick="openMonthsModal('${o.student_id}', '${o.course_id}', '${s.student?.full_name}', '${o.course?.name}')">🗓️ මාස</button>
                <button class="btn btn-sm btn-rose" onclick="removeEnroll('${o.id}')">මකන්න</button>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `).join("")}document.getElementById("filter-status").addEventListener("change",h);document.getElementById("filter-search").addEventListener("input",h);function h(){const e=document.getElementById("filter-status").value,t=document.getElementById("filter-search").value.toLowerCase();let n=y;e&&(n=n.filter(r=>r.status===e)),t&&(n=n.filter(r=>r.student?.full_name?.toLowerCase().includes(t))),f(n)}window.activateEnroll=async e=>{const t=prompt("කොපමණ දින සඳහා Active කරන්නද?","30");if(!t)return;const n=new Date;n.setDate(n.getDate()+parseInt(t));try{await g(e,"active",n.toISOString()),a("ලියාපදිංචිය Active කරන ලදී ✅","success"),d()}catch(r){a(r.message,"error")}};window.expireEnroll=async e=>{if(confirm("මෙම ලියාපදිංචිය Expire කිරීමට විශ්වාසද?"))try{await g(e,"expired",new Date().toISOString()),a("ලියාපදිංචිය Expired කරන ලදී","warning"),d()}catch(t){a(t.message,"error")}};window.removeEnroll=async e=>{if(confirm("මෙම ලියාපදිංචිය සම්පූර්ණයෙන්ම මකා දැමිය යුතුද?"))try{await b(e),a("ලියාපදිංචිය මකා දමන ලදී","success"),d()}catch(t){a(t.message,"error")}};window.openEnrollModal=async()=>{document.getElementById("enroll-modal").classList.add("active");const[e,t]=await Promise.all([x("student"),$()]),n=document.getElementById("modal-student-select");n.innerHTML='<option value="">— තෝරන්න —</option>'+e.map(s=>`<option value="${s.id}">${s.full_name} (${s.whatsapp_number})</option>`).join("");let r='<option value="">— තෝරන්න —</option>';t.forEach(s=>{s.categories.forEach(o=>{o.subjects.forEach(l=>{l.courses.forEach(i=>{r+=`<option value="${i.id}">${s.name} - ${l.name} - ${i.name}</option>`})})})}),document.getElementById("modal-course-select").innerHTML=r};window.closeEnrollModal=()=>{document.getElementById("enroll-modal").classList.remove("active")};window.submitManualEnrollment=async()=>{const e=document.getElementById("modal-student-select").value,t=document.getElementById("modal-course-select").value;if(!e||!t)return a("ශිෂ්‍යයෙක් සහ පාඨමාලාවක් තෝරන්න","warning");try{await M(e,t),a("පාඨමාලාව සාර්ථකව ලබා දෙන ලදී ✅","success"),closeEnrollModal(),d()}catch(n){a(n.message,"error")}};window.openMonthsModal=async(e,t,n,r)=>{document.getElementById("mm-title").textContent=`${n} - ${r}`,document.getElementById("months-modal").classList.add("active");const s=document.getElementById("months-list-container");s.innerHTML='<div class="skeleton" style="height:100px;border-radius:1rem"></div>';try{const{months:o,accessData:l}=await B(e,t);if(!o.length){s.innerHTML='<p style="color:var(--text-muted);text-align:center">මෙම පාඨමාලාවට මාස කිසිවක් ඇතුළත් කර නොමැත.</p>';return}let i='<div style="display:flex;flex-direction:column;gap:0.8rem">';o.forEach(c=>{const m=l.some(u=>{const p=Array.isArray(u.payments)?u.payments[0]:u.payments;return p&&p.paid_year===c.year&&p.paid_month===c.month_number});i+=`
        <label style="display:flex;align-items:center;justify-content:space-between;padding:1rem;background:#f8fafc;border:1px solid #e2e8f0;border-radius:var(--radius-md);cursor:pointer">
          <div style="font-weight:700;color:var(--dark)">${c.year} ${c.name}</div>
          <div style="display:flex;align-items:center;gap:0.5rem">
            <span style="font-size:0.8rem;color:${m?"var(--teal)":"var(--text-muted)"}">${m?"Access Allowed":"No Access"}</span>
            <input type="checkbox" ${m?"checked":""} onchange="toggleMonthAccess(this, '${e}', '${t}', ${c.year}, ${c.month_number})" style="width:1.2rem;height:1.2rem;cursor:pointer">
          </div>
        </label>
      `}),i+="</div>",s.innerHTML=i}catch(o){s.innerHTML=`<p style="color:var(--rose)">Error: ${o.message}</p>`}};window.closeMonthsModal=()=>{document.getElementById("months-modal").classList.remove("active")};window.toggleMonthAccess=async(e,t,n,r,s)=>{const o=e.checked;e.disabled=!0;try{await I(t,n,r,s,o),a(o?"මාසයට ප්‍රවේශය ලබා දෙන ලදී":"මාසයේ ප්‍රවේශය ඉවත් කරන ලදී","success"),openMonthsModal(t,n,document.getElementById("mm-title").textContent.split(" - ")[0],document.getElementById("mm-title").textContent.split(" - ")[1])}catch(l){e.checked=!o,a(l.message,"error")}e.disabled=!1};d();
