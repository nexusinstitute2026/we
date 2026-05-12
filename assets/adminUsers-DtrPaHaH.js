import{c as y,p as h,d as p,f as b,o as m,m as c,s as a}from"./ui-xMALHD_f.js";/* empty css              *//* empty css                  */import{u as f,d as E,c as B,e as u}from"./admin-U8S0YtoL.js";import"./preload-helper-BKjL65nl.js";const I=await y(["admin"]);h(I);p();document.getElementById("logout-btn").addEventListener("click",b);window.openModal=m;window.closeModal=c;const l=["var(--g-teal)","var(--g-gold)","var(--g-purple)","var(--g-rose)","var(--g-blue)"];let d=[],s=[];async function i(t,n=[]){try{return await t}catch(e){return console.error("Fetch error:",e),n}}async function o(){d=await i(u("teacher"),[]),s=await i(u("student"),[]),document.getElementById("teacher-count").textContent=`(${d.length})`,document.getElementById("student-count").textContent=`(${s.length})`,g(d),v(s)}function g(t){const n=document.getElementById("teachers-grid");if(!t.length){n.innerHTML='<p style="color:var(--text-muted)">ගුරුවරුන් නොමැත.</p>';return}n.innerHTML=t.map((e,r)=>`
    <div class="user-card">
      <div class="u-avatar" style="background:${l[r%l.length]}">${e.full_name.charAt(0)}</div>
      <div class="u-info">
        <div class="u-name">${e.full_name}</div>
        <div class="u-meta eng">${e.whatsapp_number} · ${e.school||"—"}</div>
      </div>
      <div class="u-actions">
        <button class="btn btn-sm btn-outline" onclick='editUser(${JSON.stringify(e).replace(/'/g,"&#39;")})'>✏️</button>
        <button class="btn btn-sm btn-rose" style="padding:0.4rem 0.7rem" onclick="delUser('${e.id}','${e.full_name.replace(/'/g,"\\'")}')">🗑️</button>
      </div>
    </div>
  `).join("")}function v(t){const n=document.getElementById("students-grid");if(!t.length){n.innerHTML='<p style="color:var(--text-muted)">සිසුන් නොමැත.</p>';return}n.innerHTML=t.map((e,r)=>`
    <div class="user-card">
      <div class="u-avatar" style="background:${l[(r+2)%l.length]}">${e.full_name.charAt(0)}</div>
      <div class="u-info">
        <div class="u-name">${e.full_name}</div>
        <div class="u-meta eng">${e.whatsapp_number} · ${e.school||"—"} · ${e.address||"—"}</div>
      </div>
      <div class="u-actions">
        <button class="btn btn-sm btn-outline" onclick='editUser(${JSON.stringify(e).replace(/'/g,"&#39;")})'>✏️</button>
        <button class="btn btn-sm btn-rose" style="padding:0.4rem 0.7rem" onclick="delUser('${e.id}','${e.full_name.replace(/'/g,"\\'")}')">🗑️</button>
      </div>
    </div>
  `).join("")}document.getElementById("search-teachers").addEventListener("input",t=>{const n=t.target.value.toLowerCase();g(d.filter(e=>e.full_name.toLowerCase().includes(n)||e.whatsapp_number.includes(n)))});document.getElementById("search-students").addEventListener("input",t=>{const n=t.target.value.toLowerCase();v(s.filter(e=>e.full_name.toLowerCase().includes(n)||e.whatsapp_number.includes(n)))});window.editUser=t=>{document.getElementById("eu-id").value=t.id,document.getElementById("eu-name").value=t.full_name,document.getElementById("eu-school").value=t.school||"",document.getElementById("eu-address").value=t.address||"",document.getElementById("eu-role").value=t.role,m("edit-user-modal")};document.getElementById("update-user-btn").addEventListener("click",async()=>{const t=document.getElementById("eu-id").value,n=document.getElementById("update-user-btn");n.disabled=!0,n.textContent="Updating...";try{await f(t,{full_name:document.getElementById("eu-name").value,school:document.getElementById("eu-school").value,address:document.getElementById("eu-address").value,role:document.getElementById("eu-role").value}),a("පරිශීලකයා යාවත්කාලීන කරන ලදී ✅","success"),c("edit-user-modal"),o()}catch(e){a(e.message,"error")}n.disabled=!1,n.textContent="යාවත්කාලීන කරන්න"});window.delUser=async(t,n)=>{if(confirm(`"${n}" පරිශීලකයා මකා දැමිය යුතුද?

මෙය ආපසු හැරවිය නොහැක!`))try{await E(t),a("පරිශීලකයා මකා දමන ලදී","success"),o()}catch(e){a(e.message,"error")}};document.getElementById("save-teacher-btn").addEventListener("click",async()=>{const t=document.getElementById("save-teacher-btn");t.disabled=!0,t.textContent="Saving...";try{await B({full_name:document.getElementById("t-name").value,whatsapp_number:document.getElementById("t-wa").value,id_number:document.getElementById("t-id").value,school:document.getElementById("t-school").value,address:document.getElementById("t-address").value}),a("ගුරුවරයා එකතු කරන ලදී ✅","success"),c("add-teacher-modal"),document.getElementById("add-teacher-form").reset(),o()}catch(n){a("දෝෂයක්: "+n.message,"error")}t.disabled=!1,t.textContent="සුරකින්න"});o();
