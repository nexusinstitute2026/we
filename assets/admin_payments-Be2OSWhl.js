import{r as h,p as f,l as v}from"./auth-qdlMy9e7.js";/* empty css              *//* empty css             *//* empty css                  */import{a as b,r as w,g as x}from"./payment-rGI2tEmi.js";import{s as _,v as $,y as k}from"./admin-DslfRaT8.js";import{i as E,s as i,a as B}from"./ui-CfSCUwhT.js";import"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";import"./preload-helper-BKjL65nl.js";const A=await h(["admin"]);f(A);E();document.getElementById("logout-btn").addEventListener("click",v);let l=[],o="pending",c="",m="";async function L(n,a=[]){try{return await n}catch(e){return console.error("Fetch error:",e),a}}async function u(){l=await L(x(),[]);const n=l.filter(e=>e.status==="pending").length,a=document.getElementById("cnt-pending");a&&(a.textContent=n),g()}function g(){const n=document.getElementById("payments-container"),a={1:"ජනවාරි",2:"පෙබරවාරි",3:"මාර්තු",4:"අප්‍රේල්",5:"මැයි",6:"ජූනි",7:"ජූලි",8:"අගෝස්තු",9:"සැප්තැම්බර්",10:"ඔක්තෝබර්",11:"නොවැම්බර්",12:"දෙසැම්බර්"};if(o==="manual"){const t=l.filter(r=>r.slip_drive_link==="manual_assign");let s="";t.length?s=t.map(r=>{const d=r.payment_courses?.map(y=>y.course?.name).filter(Boolean).join(", ")||"—",p=r.paid_month?`${r.paid_year||""} ${a[r.paid_month]||r.paid_month}`:"—";return`
        <div class="payment-card" style="margin-top:1rem;background:#f8fafc">
          <div style="flex-shrink:0">
            <div style="width:80px;height:80px;background:#e2e8f0;border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;color:var(--teal);font-size:2rem">👤</div>
          </div>
          <div class="pc-info">
            <h4>${r.student?.full_name||"—"}</h4>
            <div class="pc-meta">
              <strong>WhatsApp:</strong> ${r.student?.whatsapp_number||"—"}<br>
              <strong>මාසය:</strong> ${p}<br>
              <strong>විෂයයන්:</strong> ${d}<br>
              <strong>දිනය:</strong> ${new Date(r.created_at).toLocaleDateString("si-LK",{year:"numeric",month:"long",day:"numeric"})}
            </div>
          </div>
          <div class="pc-actions">
            <span style="font-size:0.85rem;background:#dcfce7;color:#22c55e;padding:0.3rem 0.8rem;border-radius:1rem;font-weight:700">Manual Access ✅</span>
          </div>
        </div>`}).join(""):s='<div style="text-align:center;padding:2rem;color:var(--text-muted)">අතින් ලබා දුන් ප්‍රවේශයන් නොමැත.</div>',n.innerHTML=`
      <div style="background:#fff;border-radius:var(--radius-xl);border:1px solid #e2e8f0;padding:2rem;max-width:600px;margin:0 auto 2rem auto">
        <h3 style="margin-bottom:1.5rem;color:var(--teal)">අතින් ප්‍රවේශය ලබාදීම (Manual Assign)</h3>
        <div style="margin-bottom:1rem">
          <label style="display:block;font-weight:700;margin-bottom:0.4rem">ශිෂ්‍යයා තෝරන්න</label>
          <select id="manual-student-select" style="width:100%;padding:0.6rem;border-radius:0.5rem;border:1px solid #cbd5e1">${c}</select>
        </div>
        <div style="margin-bottom:1.5rem">
          <label style="display:block;font-weight:700;margin-bottom:0.4rem">පාඨමාලාව තෝරන්න</label>
          <select id="manual-course-select" style="width:100%;padding:0.6rem;border-radius:0.5rem;border:1px solid #cbd5e1">${m}</select>
        </div>
        <button class="btn btn-teal" style="width:100%" onclick="submitManualAssign()">ලබා දෙන්න</button>
      </div>

      <h3 style="margin-bottom:1rem;font-size:1.1rem;font-weight:800;color:var(--dark)">දැනට ලබා දී ඇති ප්‍රවේශයන්</h3>
      ${s}
    `;return}let e=l.filter(t=>t.slip_drive_link!=="manual_assign");if(o!=="all"&&(e=e.filter(t=>t.status===o)),!e.length){n.innerHTML=`<div style="text-align:center;padding:3rem;background:#fff;border-radius:var(--radius-xl);border:1px dashed #cbd5e1">
      <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="var(--text-muted)" stroke-width="1.5" style="opacity:0.4;margin-bottom:1rem"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
      <h3 style="color:var(--text-muted);font-size:1rem">මෙම කාණ්ඩයේ ගෙවීම් නොමැත.</h3>
    </div>`;return}n.innerHTML=e.map(t=>{const s=t.payment_courses?.map(d=>d.course?.name).filter(Boolean).join(", ")||"—",r=t.paid_month?`${t.paid_year||""} ${a[t.paid_month]||t.paid_month}`:"—";return`
    <div class="payment-card">
      <div style="flex-shrink:0">
        ${t.slip_drive_link?`<img src="${t.slip_drive_link}" class="slip-preview" alt="Slip" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" onclick="window.open('${t.slip_drive_link}','_blank')">
        <a href="${t.slip_drive_link}" target="_blank" class="btn btn-sm btn-outline" style="display:none">Slip බලන්න</a>`:'<div style="width:80px;height:80px;background:#f1f5f9;border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:0.8rem">Slip නැත</div>'}
      </div>
      <div class="pc-info">
        <h4>${t.student?.full_name||"—"}</h4>
        <div class="pc-meta">
          <strong>WhatsApp:</strong> ${t.student?.whatsapp_number||"—"}<br>
          <strong>ගෙවූ මාසය:</strong> ${r}<br>
          <strong>විෂයයන්:</strong> ${s}<br>
          <strong>මුදල:</strong> රු. ${t.amount||"0.00"}<br>
          <strong>දිනය:</strong> ${new Date(t.created_at).toLocaleDateString("si-LK",{year:"numeric",month:"long",day:"numeric"})}<br>
          ${B(t.status)}
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
  `}).join("")}document.getElementById("filter-tabs").addEventListener("click",async n=>{const a=n.target.closest(".filter-tab");a&&(document.querySelectorAll(".filter-tab").forEach(e=>e.classList.remove("active")),a.classList.add("active"),o=a.dataset.status,o==="manual"&&(document.getElementById("payments-container").innerHTML='<div style="text-align:center;padding:2rem">Loading...</div>',await j()),g())});async function j(){if(!c)try{const[n,a]=await Promise.all([_("student"),$()]);c='<option value="">— තෝරන්න —</option>'+n.map(e=>`<option value="${e.id}">${e.full_name} (${e.whatsapp_number})</option>`).join(""),m='<option value="">— තෝරන්න —</option>',a.forEach(e=>{e.categories.forEach(t=>{t.subjects.forEach(s=>{s.courses.forEach(r=>{m+=`<option value="${r.id}">${e.name} - ${s.name} - ${r.name}</option>`})})})})}catch(n){i(n.message,"error")}}window.submitManualAssign=async()=>{const n=document.getElementById("manual-student-select").value,a=document.getElementById("manual-course-select").value;if(!n||!a)return i("ශිෂ්‍යයෙක් සහ පාඨමාලාවක් තෝරන්න","warning");try{await k(n,a),i("පාඨමාලාව සාර්ථකව ලබා දෙන ලදී ✅","success"),document.getElementById("manual-course-select").value=""}catch(e){i(e.message,"error")}};window.handleApprove=async(n,a)=>{if(confirm("මෙම ගෙවීම අනුමත කිරීමට විශ්වාසද?"))try{await b(n,a),i("ගෙවීම අනුමත කරන ලදී ✅","success"),u()}catch(e){i(e.message,"error")}};window.handleReject=async(n,a)=>{if(confirm("මෙම ගෙවීම ප්‍රතික්ෂේප කිරීමට විශ්වාසද?"))try{await w(n,a),i("ගෙවීම ප්‍රතික්ෂේප කරන ලදී","warning"),u()}catch(e){i(e.message,"error")}};u();
