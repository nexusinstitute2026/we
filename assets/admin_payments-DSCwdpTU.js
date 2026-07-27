import{r as p,p as y,l as b}from"./auth-qdlMy9e7.js";/* empty css              *//* empty css             *//* empty css                  */import{a as h,r as f,g as v}from"./payment-rGI2tEmi.js";import{s as w,v as x,y as $}from"./admin-D5CFCs7U.js";import{i as _,s as r,a as k}from"./ui-CfSCUwhT.js";import"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";import"./preload-helper-BKjL65nl.js";const E=await p(["admin"]);y(E);_();document.getElementById("logout-btn").addEventListener("click",b);let l=[],s="pending",d="",c="";async function B(n,e=[]){try{return await n}catch(a){return console.error("Fetch error:",a),e}}async function m(){l=await B(v(),[]);const n=l.filter(a=>a.status==="pending").length,e=document.getElementById("cnt-pending");e&&(e.textContent=n),u()}function u(){const n=document.getElementById("payments-container");if(s==="manual"){n.innerHTML=`
      <div style="background:#fff;border-radius:var(--radius-xl);border:1px solid #e2e8f0;padding:2rem;max-width:600px;margin:0 auto">
        <h3 style="margin-bottom:1.5rem;color:var(--teal)">අතින් ප්‍රවේශය ලබාදීම (Manual Assign)</h3>
        <div style="margin-bottom:1rem">
          <label style="display:block;font-weight:700;margin-bottom:0.4rem">ශිෂ්‍යයා තෝරන්න</label>
          <select id="manual-student-select" style="width:100%;padding:0.6rem;border-radius:0.5rem;border:1px solid #cbd5e1">${d}</select>
        </div>
        <div style="margin-bottom:1.5rem">
          <label style="display:block;font-weight:700;margin-bottom:0.4rem">පාඨමාලාව තෝරන්න</label>
          <select id="manual-course-select" style="width:100%;padding:0.6rem;border-radius:0.5rem;border:1px solid #cbd5e1">${c}</select>
        </div>
        <button class="btn btn-teal" style="width:100%" onclick="submitManualAssign()">ලබා දෙන්න</button>
      </div>
    `;return}let e=l;if(s!=="all"&&(e=l.filter(t=>t.status===s)),!e.length){n.innerHTML=`<div style="text-align:center;padding:3rem;background:#fff;border-radius:var(--radius-xl);border:1px dashed #cbd5e1">
      <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="var(--text-muted)" stroke-width="1.5" style="opacity:0.4;margin-bottom:1rem"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
      <h3 style="color:var(--text-muted);font-size:1rem">මෙම කාණ්ඩයේ ගෙවීම් නොමැත.</h3>
    </div>`;return}const a={1:"ජනවාරි",2:"පෙබරවාරි",3:"මාර්තු",4:"අප්‍රේල්",5:"මැයි",6:"ජූනි",7:"ජූලි",8:"අගෝස්තු",9:"සැප්තැම්බර්",10:"ඔක්තෝබර්",11:"නොවැම්බර්",12:"දෙසැම්බර්"};n.innerHTML=e.map(t=>{const i=t.payment_courses?.map(g=>g.course?.name).filter(Boolean).join(", ")||"—",o=t.paid_month?`${t.paid_year||""} ${a[t.paid_month]||t.paid_month}`:"—";return`
    <div class="payment-card">
      <div style="flex-shrink:0">
        ${t.slip_drive_link?`<img src="${t.slip_drive_link}" class="slip-preview" alt="Slip" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" onclick="window.open('${t.slip_drive_link}','_blank')">
        <a href="${t.slip_drive_link}" target="_blank" class="btn btn-sm btn-outline" style="display:none">Slip බලන්න</a>`:'<div style="width:80px;height:80px;background:#f1f5f9;border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:0.8rem">Slip නැත</div>'}
      </div>
      <div class="pc-info">
        <h4>${t.student?.full_name||"—"}</h4>
        <div class="pc-meta">
          <strong>WhatsApp:</strong> ${t.student?.whatsapp_number||"—"}<br>
          <strong>ගෙවූ මාසය:</strong> ${o}<br>
          <strong>විෂයයන්:</strong> ${i}<br>
          <strong>මුදල:</strong> රු. ${t.amount||"0.00"}<br>
          <strong>දිනය:</strong> ${new Date(t.created_at).toLocaleDateString("si-LK",{year:"numeric",month:"long",day:"numeric"})}<br>
          ${k(t.status)}
        </div>
      </div>
      <div class="pc-actions">
        ${t.status==="pending"?`
          <button class="btn btn-sm btn-teal" onclick="handleApprove('${t.id}','${t.student_id}')">✅ Approve</button>
          <button class="btn btn-sm btn-rose" onclick="handleReject('${t.id}','${t.student_id}')">❌ Reject</button>
        `:`
          <span style="font-size:0.8rem;color:var(--text-muted)">සම්පූර්ණයි</span>
        `}
      </div>
    </div>
  `}).join("")}document.getElementById("filter-tabs").addEventListener("click",async n=>{const e=n.target.closest(".filter-tab");e&&(document.querySelectorAll(".filter-tab").forEach(a=>a.classList.remove("active")),e.classList.add("active"),s=e.dataset.status,s==="manual"&&(document.getElementById("payments-container").innerHTML='<div style="text-align:center;padding:2rem">Loading...</div>',await A()),u())});async function A(){if(!d)try{const[n,e]=await Promise.all([w("student"),x()]);d='<option value="">— තෝරන්න —</option>'+n.map(a=>`<option value="${a.id}">${a.full_name} (${a.whatsapp_number})</option>`).join(""),c='<option value="">— තෝරන්න —</option>',e.forEach(a=>{a.categories.forEach(t=>{t.subjects.forEach(i=>{i.courses.forEach(o=>{c+=`<option value="${o.id}">${a.name} - ${i.name} - ${o.name}</option>`})})})})}catch(n){r(n.message,"error")}}window.submitManualAssign=async()=>{const n=document.getElementById("manual-student-select").value,e=document.getElementById("manual-course-select").value;if(!n||!e)return r("ශිෂ්‍යයෙක් සහ පාඨමාලාවක් තෝරන්න","warning");try{await $(n,e),r("පාඨමාලාව සාර්ථකව ලබා දෙන ලදී ✅","success"),document.getElementById("manual-course-select").value=""}catch(a){r(a.message,"error")}};window.handleApprove=async(n,e)=>{if(confirm("මෙම ගෙවීම අනුමත කිරීමට විශ්වාසද?"))try{await h(n,e),r("ගෙවීම අනුමත කරන ලදී ✅","success"),m()}catch(a){r(a.message,"error")}};window.handleReject=async(n,e)=>{if(confirm("මෙම ගෙවීම ප්‍රතික්ෂේප කිරීමට විශ්වාසද?"))try{await f(n,e),r("ගෙවීම ප්‍රතික්ෂේප කරන ලදී","warning"),m()}catch(a){r(a.message,"error")}};m();
