import{r as d,p as u,l as p}from"./auth-5l32Gasm.js";/* empty css              *//* empty css             *//* empty css                  */import{K as m}from"./admin-BPFFsS_i.js";import{i as v,s as o}from"./ui-CfSCUwhT.js";import"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";import"./preload-helper-BKjL65nl.js";const r=await d(["teacher","admin"]);u(r);v();document.getElementById("logout-btn").addEventListener("click",p);let i=null;window.saveApiServerUrl=function(){const t=document.getElementById("api-server-url-input");t&&(window.setApiBaseUrl(t.value),o("API Server URL එක සාර්ථකව සුරකින ලදී","success"),i&&l())};function g(){const t=document.getElementById("api-server-url-input");t&&(t.value=window.getApiBaseUrl())}g();async function y(){const t=await m(r.id),n=document.getElementById("course-select"),a=[];t.forEach(s=>s.courses?.forEach(e=>a.push({id:e.id,name:`${s.name} — ${e.name}`}))),n.innerHTML='<option value="">-- පාඨමාලාව තෝරන්න --</option>'+a.map(s=>`<option value="${s.id}">${s.name}</option>`).join(""),n.addEventListener("change",()=>{i=n.value,i&&l()})}async function l(){const t=document.getElementById("classes-container");t.innerHTML='<div class="skeleton" style="height:100px;border-radius:1rem;margin-bottom:1rem"></div>';try{const a=await(await fetch(getApiUrl(`/api/classes?teacherId=${r.id}&courseId=${i}`))).json();if(!a.success)throw new Error(a.message);const s=a.data;if(!s.length){t.innerHTML='<div style="text-align:center;padding:4rem;color:var(--text-muted)"><h3>පන්ති නොමැත</h3></div>';return}t.innerHTML=s.map(e=>`
      <div class="schedule-card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div>
            <h3 style="font-weight:800;color:var(--dark)">${e.topic}</h3>
            <div class="schedule-meta" style="margin-top:0.5rem">
              <span>📅 ${new Date(e.start_time).toLocaleString("si-LK")}</span>
              <span>⏱️ විනාඩි ${e.duration}</span>
            </div>
            <div style="margin-top: 0.5rem; display: flex; gap: 0.5rem;">
              <span class="account-badge ${e.zoom_account_type==="bypass"?"bypass":""}">${e.zoom_account_type.toUpperCase()} ZOOM</span>
              <span class="status-badge ${e.status==="cancelled"?"cancelled":""}">${e.status.toUpperCase()}</span>
            </div>
          </div>
          ${e.status!=="cancelled"?`<button class="btn" style="background:#fff1f2;color:var(--rose);padding:0.5rem 1rem" onclick="cancelClass('${e.id}')">අවලංගු කරන්න</button>`:""}
        </div>
        
        <div style="display:flex; flex-direction:column; gap:0.5rem">
          <div class="link-box">
            <span style="font-size:0.8rem; font-weight:700; width:80px; align-self:center;">Zoom Link</span>
            <input type="text" readonly value="${e.zoom_join_url||""}">
            <button onclick="navigator.clipboard.writeText('${e.zoom_join_url||""}')">Copy</button>
          </div>
          <div class="link-box">
            <span style="font-size:0.8rem; font-weight:700; width:80px; align-self:center;">Host Link</span>
            <input type="text" readonly value="${e.zoom_start_url||""}">
            <button onclick="navigator.clipboard.writeText('${e.zoom_start_url||""}')">Copy</button>
          </div>
          <div class="link-box">
            <span style="font-size:0.8rem; font-weight:700; width:80px; align-self:center;">YT Live URL</span>
            <input type="text" readonly value="${e.youtube_live_url||""}">
            <button onclick="navigator.clipboard.writeText('${e.youtube_live_url||""}')">Copy</button>
          </div>
        </div>
      </div>
    `).join("")}catch(n){o("පන්ති ලබා ගැනීමට නොහැකි විය","error"),console.error(n)}}window.openScheduleModal=()=>{if(!i){o("කරුණාකර පළමුව පාඨමාලාවක් තෝරන්න","warning");return}document.getElementById("class-topic").value="",document.getElementById("class-start").value="",document.getElementById("class-duration").value="120",document.getElementById("schedule-modal").classList.add("active")};window.closeModal=()=>document.getElementById("schedule-modal").classList.remove("active");window.saveClass=async()=>{const t=document.getElementById("class-topic").value.trim(),n=document.getElementById("class-start").value,a=parseInt(document.getElementById("class-duration").value);if(!t||!n||!a){o("සියලුම තොරතුරු ඇතුළත් කරන්න","warning");return}const s=document.getElementById("save-class-btn");s.disabled=!0,s.textContent="Scheduling...";try{const c=await(await fetch(getApiUrl("/api/teacher/schedule-class"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({topic:t,startTime:new Date(n).toISOString(),duration:a,teacherId:r.id,courseId:i})})).json();if(!c.success)throw new Error(c.message);o("පන්තිය සාර්ථකව Schedule කරන ලදී","success"),closeModal(),l()}catch(e){o(e.message,"error")}finally{s.disabled=!1,s.textContent="Schedule කරන්න ✓"}};window.cancelClass=async t=>{if(confirm("මෙම පන්තිය අවලංගු කිරීමට විශ්වාසද?"))try{const a=await(await fetch(getApiUrl(`/api/classes/${t}`),{method:"DELETE"})).json();if(!a.success)throw new Error(a.message);o("පන්තිය අවලංගු කරන ලදී","success"),l()}catch(n){o(n.message,"error")}};y();
