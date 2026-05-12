import{c as l,p as d,d as c,f as m,s as r,g as u}from"./ui-BjnYUZX8.js";/* empty css              *//* empty css                  */import{c as g,r as p,a as f}from"./payment-0QWsQlSP.js";import"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";const y=await l(["admin"]);d(y);c();document.getElementById("logout-btn").addEventListener("click",m);let i=[],s="pending";async function h(n,e=[]){try{return await n}catch(t){return console.error("Fetch error:",t),e}}async function a(){i=await h(f(),[]);const n=i.filter(t=>t.status==="pending").length,e=document.getElementById("cnt-pending");e&&(e.textContent=n),o()}function o(){const n=document.getElementById("payments-container");let e=i;if(s!=="all"&&(e=i.filter(t=>t.status===s)),!e.length){n.innerHTML=`<div style="text-align:center;padding:3rem;background:#fff;border-radius:var(--radius-xl);border:1px dashed #cbd5e1">
      <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="var(--text-muted)" stroke-width="1.5" style="opacity:0.4;margin-bottom:1rem"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
      <h3 style="color:var(--text-muted);font-size:1rem">මෙම කාණ්ඩයේ ගෙවීම් නොමැත.</h3>
    </div>`;return}n.innerHTML=e.map(t=>`
    <div class="payment-card">
      <div style="flex-shrink:0">
        ${t.slip_drive_link?`<img src="${t.slip_drive_link}" class="slip-preview" alt="Slip" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" onclick="window.open('${t.slip_drive_link}','_blank')">
        <a href="${t.slip_drive_link}" target="_blank" class="btn btn-sm btn-outline" style="display:none">Slip බලන්න</a>`:'<div style="width:80px;height:80px;background:#f1f5f9;border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:0.8rem">Slip නැත</div>'}
      </div>
      <div class="pc-info">
        <h4>${t.student?.full_name||"—"}</h4>
        <div class="pc-meta">
          <strong>WhatsApp:</strong> ${t.student?.whatsapp_number||"—"}<br>
          <strong>මුදල:</strong> රු. ${t.amount||"0.00"}<br>
          <strong>දිනය:</strong> ${new Date(t.created_at).toLocaleDateString("si-LK",{year:"numeric",month:"long",day:"numeric"})}<br>
          ${u(t.status)}
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
  `).join("")}document.getElementById("filter-tabs").addEventListener("click",n=>{const e=n.target.closest(".filter-tab");e&&(document.querySelectorAll(".filter-tab").forEach(t=>t.classList.remove("active")),e.classList.add("active"),s=e.dataset.status,o())});window.handleApprove=async(n,e)=>{if(confirm("මෙම ගෙවීම අනුමත කිරීමට විශ්වාසද?"))try{await g(n,e),r("ගෙවීම අනුමත කරන ලදී ✅","success"),a()}catch(t){r(t.message,"error")}};window.handleReject=async(n,e)=>{if(confirm("මෙම ගෙවීම ප්‍රතික්ෂේප කිරීමට විශ්වාසද?"))try{await p(n,e),r("ගෙවීම ප්‍රතික්ෂේප කරන ලදී","warning"),a()}catch(t){r(t.message,"error")}};a();
