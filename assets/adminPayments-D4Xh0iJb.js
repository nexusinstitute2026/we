import{c as u,p as g,d as h,f as p,s,g as y}from"./ui-BjnYUZX8.js";/* empty css              *//* empty css                  */import{c as f,r as v,a as b}from"./payment-0QWsQlSP.js";import"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";const w=await u(["admin"]);g(w);h();document.getElementById("logout-btn").addEventListener("click",p);let i=[],a="pending";async function x(n,e=[]){try{return await n}catch(r){return console.error("Fetch error:",r),e}}async function o(){i=await x(b(),[]);const n=i.filter(r=>r.status==="pending").length,e=document.getElementById("cnt-pending");e&&(e.textContent=n),l()}function l(){const n=document.getElementById("payments-container");let e=i;if(a!=="all"&&(e=i.filter(t=>t.status===a)),!e.length){n.innerHTML=`<div style="text-align:center;padding:3rem;background:#fff;border-radius:var(--radius-xl);border:1px dashed #cbd5e1">
      <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="var(--text-muted)" stroke-width="1.5" style="opacity:0.4;margin-bottom:1rem"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
      <h3 style="color:var(--text-muted);font-size:1rem">මෙම කාණ්ඩයේ ගෙවීම් නොමැත.</h3>
    </div>`;return}const r={1:"ජනවාරි",2:"පෙබරවාරි",3:"මාර්තු",4:"අප්‍රේල්",5:"මැයි",6:"ජූනි",7:"ජූලි",8:"අගෝස්තු",9:"සැප්තැම්බර්",10:"ඔක්තෝබර්",11:"නොවැම්බර්",12:"දෙසැම්බර්"};n.innerHTML=e.map(t=>{const d=t.payment_courses?.map(m=>m.course?.name).filter(Boolean).join(", ")||"—",c=t.paid_month?`${t.paid_year||""} ${r[t.paid_month]||t.paid_month}`:"—";return`
    <div class="payment-card">
      <div style="flex-shrink:0">
        ${t.slip_drive_link?`<img src="${t.slip_drive_link}" class="slip-preview" alt="Slip" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" onclick="window.open('${t.slip_drive_link}','_blank')">
        <a href="${t.slip_drive_link}" target="_blank" class="btn btn-sm btn-outline" style="display:none">Slip බලන්න</a>`:'<div style="width:80px;height:80px;background:#f1f5f9;border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:0.8rem">Slip නැත</div>'}
      </div>
      <div class="pc-info">
        <h4>${t.student?.full_name||"—"}</h4>
        <div class="pc-meta">
          <strong>WhatsApp:</strong> ${t.student?.whatsapp_number||"—"}<br>
          <strong>ගෙවූ මාසය:</strong> ${c}<br>
          <strong>විෂයයන්:</strong> ${d}<br>
          <strong>මුදල:</strong> රු. ${t.amount||"0.00"}<br>
          <strong>දිනය:</strong> ${new Date(t.created_at).toLocaleDateString("si-LK",{year:"numeric",month:"long",day:"numeric"})}<br>
          ${y(t.status)}
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
  `}).join("")}document.getElementById("filter-tabs").addEventListener("click",n=>{const e=n.target.closest(".filter-tab");e&&(document.querySelectorAll(".filter-tab").forEach(r=>r.classList.remove("active")),e.classList.add("active"),a=e.dataset.status,l())});window.handleApprove=async(n,e)=>{if(confirm("මෙම ගෙවීම අනුමත කිරීමට විශ්වාසද?"))try{await f(n,e),s("ගෙවීම අනුමත කරන ලදී ✅","success"),o()}catch(r){s(r.message,"error")}};window.handleReject=async(n,e)=>{if(confirm("මෙම ගෙවීම ප්‍රතික්ෂේප කිරීමට විශ්වාසද?"))try{await v(n,e),s("ගෙවීම ප්‍රතික්ෂේප කරන ලදී","warning"),o()}catch(r){s(r.message,"error")}};o();
