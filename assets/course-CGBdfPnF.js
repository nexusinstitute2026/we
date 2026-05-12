import{c as $,h as E,s as c,b as a,j as L}from"./ui-wgqUTf1L.js";/* empty css              *//* empty css               */import{a as M}from"./quiz-DSzoKPk1.js";await $(["student","teacher","admin"]);const n=await E();n||(window.location.href="/login.html");const b=new URLSearchParams(window.location.search),l=b.get("id"),h=b.get("month");window.switchTab=s=>{document.querySelectorAll(".tab-btn").forEach(t=>t.classList.remove("active")),document.querySelectorAll(".tab-content").forEach(t=>t.classList.remove("active")),event.currentTarget.classList.add("active"),document.getElementById(`tab-${s}`).classList.add("active")};async function S(){if(!l)return;const{data:s}=await a.from("courses").select("name, subject:subjects(name, teacher:profiles(full_name))").eq("id",l).single();s&&(document.getElementById("c-title").textContent=`${s.subject?.name} - ${s.name}`,document.getElementById("c-teacher").querySelector("span").textContent=s.subject?.teacher?.full_name||"Teacher");let t=a.from("sessions").select("*").eq("course_id",l);if(h){const{data:e}=await a.from("course_months").select("year, month_number, name, is_free").eq("id",h).single();if(e){if(document.getElementById("c-title").textContent+=` - ${e.year} ${e.name}`,n.role==="student"){const d=await L(n.id,l),f=e.year*12+(e.month_number-1)<=d.maxAccessibleValue,I=d.paidMonths.some(y=>y.year===e.year&&y.month===e.month_number);if(!(e.is_free||d.hasCurrentAccess&&f||I)){document.querySelector("main").innerHTML=`
            <div style="background:#ffebee;color:#c62828;padding:2rem;border-radius:1rem;text-align:center;margin-top:2rem;">
              <h2 style="margin-bottom:1rem">⚠️ ප්‍රවේශය අත්හිටුවා ඇත</h2>
              <p>මෙම පන්ති සඳහා පිවිසීමට ඔබට අවසර නොමැත.</p>
              <a href="/pages/course-months.html?id=${l}" style="display:inline-block;margin-top:1rem;background:#c62828;color:white;padding:0.5rem 1rem;border-radius:0.5rem;text-decoration:none">ආපසු යන්න</a>
            </div>
          `;return}}t=t.eq("course_month_id",h)}}const{data:o}=await t.order("date",{ascending:!1});let i=o||[];const g=document.getElementById("sessions-list");!i||i.length===0?g.innerHTML='<div style="text-align:center;padding:3rem;background:#fff;border-radius:1rem;border:1px dashed #cbd5e1"><h3 style="color:var(--text-muted)">පන්ති දින සටහන් තවම යාවත්කාලීන වී නොමැත.</h3></div>':g.innerHTML=i.map(e=>`
      <div class="session-card">
        <div class="session-header">
          <div>
            <div class="s-date">${new Date(e.date).toLocaleDateString("si-LK",{month:"long",day:"numeric",year:"numeric"})}</div>
            <div class="s-title">${e.title}</div>
          </div>
        </div>
        <div class="s-actions">
          ${e.zoom_link?`<a href="${e.zoom_link}" target="_blank" class="btn btn-sm btn-teal" onclick="logAttendance('${e.id}')"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M15.6 11.6L22 7v10l-6.4-4.5v-1zM4 5h9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7c0-1.1.9-2 2-2z"/></svg> Zoom Class</a>`:""}
          ${e.yt_link?`<a href="${e.yt_link}" target="_blank" class="btn btn-sm btn-rose" onclick="logRecordingView('${e.id}')"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg> Recording</a>`:""}
        </div>
      </div>
    `).join("");const{data:r}=await a.from("assignments").select("*").eq("course_id",l).order("due_date",{ascending:!0}),_=document.getElementById("assign-list");r&&r.length>0&&(_.innerHTML=r.map(e=>{const d=e.description?.match(/\[MAX_MB:(\d+)\]/),u=d?parseInt(d[1]):10,f=e.description?.replace(/\[MAX_MB:\d+\]/,"").trim()||"";return`
      <div class="session-card assign-card">
        <div class="session-header">
          <div>
            <div class="s-date" style="color:var(--rose)">Due: ${new Date(e.due_date).toLocaleDateString("si-LK")}</div>
            <div class="s-title">${e.title}</div>
            <div style="font-size:0.9rem;color:var(--text-muted);margin-top:0.5rem">${f}</div>
          </div>
        </div>
        <div class="s-actions">
          <button class="btn btn-sm btn-outline" style="border-color:var(--teal);color:var(--teal)" onclick="openAssignUpload('${e.id}', '${e.title.replace(/'/g,"\\'")}', ${u})">පිළිතුරු Upload කරන්න (Max ${u}MB)</button>
        </div>
      </div>
      `}).join(""));const x=await M(l),A=new Date,v=x.filter(e=>{const d=e.status==="published",u=!e.publish_at||new Date(e.publish_at)<=A;return d&&u}),B=document.getElementById("quiz-list");v&&v.length>0&&(B.innerHTML=v.map(e=>`
      <div class="session-card">
        <div class="session-header">
          <div><div class="s-title">${e.title}</div></div>
        </div>
        <div class="s-actions">
          <a href="/pages/quiz.html?id=${e.id}" class="btn btn-sm btn-gold">Quiz එක ආරම්භ කරන්න</a>
        </div>
      </div>
    `).join(""))}let p=null,w=10,m=null;const C="https://script.google.com/macros/s/AKfycbyMT6HMStOuBISwz_w0b29K1apVaJZvKhYAXogOMF2dUg-A71xIbTyoboORxC_dcO-R/exec";window.openAssignUpload=(s,t,o)=>{p=s,w=o,document.getElementById("ua-title").textContent=t,document.getElementById("ua-maxmb-label").textContent=`${o}MB`,clearAssignFile(),document.getElementById("upload-assign-modal").classList.add("active")};window.closeAssignUpload=()=>{document.getElementById("upload-assign-modal").classList.remove("active")};window.clearAssignFile=()=>{m=null,document.getElementById("ua-file").value="",document.getElementById("ua-preview").style.display="none",document.getElementById("ua-dropzone").style.display="flex"};document.getElementById("ua-file")?.addEventListener("change",s=>{const t=s.target.files[0];if(t){if(t.size>w*1024*1024){c(`ගොනුවෙහි ප්‍රමාණය ${w}MB ට වඩා අඩුවිය යුතුය!`,"warning"),s.target.value="";return}m=t,document.getElementById("ua-filename").textContent=t.name,document.getElementById("ua-filesize").textContent=(t.size/1024/1024).toFixed(2)+" MB",document.getElementById("ua-dropzone").style.display="none",document.getElementById("ua-preview").style.display="block"}});window.submitAssignUpload=async()=>{if(!m)return c("කරුණාකර ගොනුවක් තෝරන්න","warning");const s=document.getElementById("ua-submit-btn");s.disabled=!0,s.textContent="Uploading... (Please wait)";try{const t=new FileReader;t.onload=async()=>{try{const o=t.result.split(",")[1],i=new URLSearchParams;i.append("fileName",`${n.id}_${p}_${m.name}`),i.append("mimeType",m.type),i.append("fileData",o),i.append("folderId","1F9I98Qt5FXsA-LSGfTMc4FwZ_Tfxmtk9");const r=await(await fetch(C,{method:"POST",body:i})).json();if(r.status!=="success")throw new Error(r.message||"Upload failed");await a.from("submissions").upsert({assignment_id:p,student_id:n.id,file_url:r.url,submitted_at:new Date().toISOString()},{onConflict:"assignment_id,student_id"}),c("සාර්ථකව Upload කරන ලදී!","success"),closeAssignUpload()}catch(o){c(o.message,"error")}finally{s.disabled=!1,s.textContent="Upload කරන්න"}},t.onerror=()=>{c("Error reading file","error"),s.disabled=!1,s.textContent="Upload කරන්න"},t.readAsDataURL(m)}catch(t){c(t.message,"error"),s.disabled=!1,s.textContent="Upload කරන්න"}};window.logAttendance=async s=>{if(n.role==="student")try{await a.from("attendance").upsert({session_id:s,student_id:n.id,attended:!0,recorded_at:new Date().toISOString()},{onConflict:"session_id,student_id"})}catch(t){console.error("Attendance log failed",t)}};window.logRecordingView=async s=>{if(n.role==="student")try{const{data:t}=await a.from("recording_views").select("view_count").eq("session_id",s).eq("student_id",n.id).single();t?await a.from("recording_views").update({view_count:t.view_count+1,last_viewed_at:new Date().toISOString()}).eq("session_id",s).eq("student_id",n.id):await a.from("recording_views").insert({session_id:s,student_id:n.id,view_count:1,last_viewed_at:new Date().toISOString()})}catch(t){console.error("Recording view log failed",t)}};S();
