import{c as z,p as _,d as E,e as $,i as g,f as B,b as u,s as r}from"./ui-ByFSyPU8.js";/* empty css              *//* empty css                  */import{g as I,s as S}from"./admin-BaTiqLv7.js";import{g as C}from"./quiz-UFcKTOgB.js";import{i as q,g as p,a as y,s as j,r as h,u as v,m as L}from"./notifications-Cy2NlEwn.js";import"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";import"./preload-helper-BKjL65nl.js";const o=await z(["teacher","admin"]);if(!o)throw new Error("Not authorized");_(o);E();$();g();q("notif-list");document.getElementById("logout-btn").addEventListener("click",B);document.getElementById("notif-nav").addEventListener("click",e=>{e.preventDefault(),document.getElementById("notif-panel").classList.toggle("active")});const N=new Date().getFullYear(),A=new Date().getMonth()+1;async function l(e,n=[]){try{return await e}catch(t){return console.error("Fetch error:",t),n}}const d=await l(I(o.id),[]),D=await l(C(o.id),[]),M=await l(p(o.id),[]);await l(y(o.id),0);const m=d.map(e=>e.courses?.map(n=>n.id)).flat().filter(Boolean);let b=0,w=[],x=[];if(m.length>0){const{data:e}=await u.from("payment_courses").select("course_id, payments!inner(student_id)").in("course_id",m).eq("payments.status","approved").eq("payments.paid_year",N).eq("payments.paid_month",A);e&&(x=e,b=new Set(e.map(i=>i.payments.student_id)).size);const{data:n}=await u.from("enrollments").select("course_id, student_id").in("course_id",m);n&&(w=n)}document.getElementById("stat-subjects")&&(document.getElementById("stat-subjects").textContent=d.length);document.getElementById("stat-quizzes")&&(document.getElementById("stat-quizzes").textContent=D.length);document.getElementById("stat-students")&&(document.getElementById("stat-students").textContent=b);j(o.id,async e=>{r(e.message,"info");const n=await p(o.id),t=await y(o.id);h(n,"notif-list"),v(t);const i=document.getElementById("nav-notif-badge");i&&(t>0?(i.textContent=t,i.classList.remove("hidden")):i.classList.add("hidden"))});document.getElementById("notif-list").dataset.userId=o.id;h(M,"notif-list");document.getElementById("mark-all-read").addEventListener("click",async()=>{await L(o.id),v(0),r("සියල්ල කියෙව්වා","success")});const f=document.getElementById("subjects-container");if(!d.length)f.innerHTML='<div class="empty-state"><h3>විෂයයන් නොමැත</h3><p>Admin විසින් ඔබට විෂයයන් assign කළ යුතුය.</p></div>';else{let e="";for(const n of d){e+=`<div class="subject-card reveal" style="padding:1.5rem; background:#fff; border-radius:1rem; margin-bottom:2rem; box-shadow:0 10px 25px -5px rgba(0,0,0,0.05); border:1px solid #e2e8f0;">
      <div style="border-bottom: 2px solid #f1f5f9; padding-bottom: 1rem; margin-bottom: 1.5rem; display:flex; justify-content:space-between; align-items:center;">
        <h2 style="font-size:1.4rem; font-weight:800; color:var(--dark); display:flex; align-items:center; gap:0.5rem;">
          <span style="font-size:1.5rem">📚</span> ${n.name}
        </h2>
        <span style="font-size:0.8rem; font-weight:600; color:var(--teal); background:var(--g-teal); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">
          ${n.category?.section?.name} / ${n.category?.name}
        </span>
      </div>
      <div style="display:grid; gap:1.5rem; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));">`;for(const t of n.courses){const i=w.filter(a=>a.course_id===t.id).length,k=x.filter(a=>a.course_id===t.id).length;if(e+=`<div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:1rem; overflow:hidden; transition:all 0.3s;" class="hover-card">
        <div style="padding:1.25rem; background:#fff; border-bottom:1px solid #e2e8f0;">
          <h3 style="font-size:1.15rem; font-weight:800; color:var(--dark); margin-bottom:1rem;">${t.name}</h3>
          <div style="display:flex; gap:1rem; margin-bottom:1rem;">
            <div style="flex:1; background:#f0fdfa; padding:0.5rem; border-radius:0.5rem; text-align:center;">
              <div style="font-size:1.2rem; font-weight:800; color:var(--teal);">${i}</div>
              <div style="font-size:0.7rem; color:var(--text-muted); font-weight:600;">ලියාපදිංචි</div>
            </div>
            <div style="flex:1; background:#fefce8; padding:0.5rem; border-radius:0.5rem; text-align:center;">
              <div style="font-size:1.2rem; font-weight:800; color:var(--gold);">${k}</div>
              <div style="font-size:0.7rem; color:var(--text-muted); font-weight:600;">ගෙවීම් කළ</div>
            </div>
          </div>
          <div style="display:flex; gap:0.5rem;">
            <a href="../pages/course.html?id=${t.id}" class="btn btn-sm btn-outline" style="flex:1; justify-content:center;">👁️ බලන්න</a>
            <a href="../teacher/quiz-builder.html?course=${t.id}" class="btn btn-sm btn-purple" style="flex:1; justify-content:center;">📝 Quiz</a>
          </div>
        </div>
        
        <div style="padding:1rem;">
          <button onclick="toggleMonths('months-${t.id}')" style="width:100%; background:none; border:none; color:var(--teal); font-weight:700; font-family:inherit; cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
            🗓️ මාස කළමනාකරණය (${t.course_months?.length||0})
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          
          <div id="months-${t.id}" style="display:none; margin-top:1rem;">`,!t.course_months||t.course_months.length===0)e+='<p style="font-size:0.85rem;color:var(--text-muted); text-align:center;">මාස කිසිවක් එක් කර නොමැත.</p>';else{const a=t.course_months.sort((s,c)=>s.year!==c.year?s.year-c.year:s.month_number-c.month_number);for(const s of a)e+=`
            <div style="background:#fff; border:1px solid #cbd5e1; border-radius:0.5rem; padding:0.75rem; margin-bottom:0.5rem;">
              <div style="font-weight:700; font-size:0.9rem; color:var(--dark3); margin-bottom:0.5rem;">${s.year} - ${s.name}</div>
              <div style="display:flex; gap:0.5rem;">
                <input type="url" id="sheet-${s.id}" value="${s.google_sheet_url||""}" placeholder="Google Sheet Link" style="flex:1; padding:0.4rem; border:1px solid #e2e8f0; border-radius:0.4rem; font-size:0.8rem; outline:none;">
                <button class="btn btn-teal" style="padding:0.4rem 0.8rem; font-size:0.8rem; border-radius:0.4rem;" onclick="saveAndSyncSheet('${t.id}', '${s.id}')">Sync</button>
              </div>
            </div>
          `}e+="</div></div></div>"}e+="</div></div>"}f.innerHTML=e,g()}window.toggleMonths=e=>{const n=document.getElementById(e);n&&(n.style.display=n.style.display==="none"?"block":"none")};window.saveAndSyncSheet=async(e,n)=>{const t=document.getElementById(`sheet-${n}`).value.trim();if(!t)return r("Link එකක් ලබා දෙන්න","warning");try{r("Sync වෙමින් පවතී... කරුණාකර රැඳී සිටින්න.","warning"),await u.from("course_months").update({google_sheet_url:t}).eq("id",n);try{const i=await S(e,n,t);r(`සාර්ථකව පන්ති ${i.count} ක් Sync කරන ලදී!`,"success")}catch(i){console.error(i),r(i.message,"error")}}catch(i){r(i.message,"error")}};
