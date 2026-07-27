import{r as v,p,l as g,s as c}from"./auth-CsePVUDx.js";/* empty css              *//* empty css             *//* empty css                  */import{i as y}from"./ui-CfSCUwhT.js";import{g as f,a as k,b,c as $}from"./leaderboard-J_JKPDCB.js";import"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";const s=await v(["student","teacher","admin"]);p(s);y();document.getElementById("logout-btn").addEventListener("click",g);let a="overall",m=[];const{data:h}=await c.from("enrollments").select("course_id, courses(id, name, subjects(name))").eq("student_id",s.id);m=(h||[]).map(t=>({id:t.course_id,name:`${t.courses?.subjects?.name||""} — ${t.courses?.name||""}`}));const l=document.getElementById("course-select");l.innerHTML=m.map(t=>`<option value="${t.id}">${t.name}</option>`).join("");document.getElementById("filter-tabs").addEventListener("click",async t=>{const e=t.target.closest(".filter-tab");e&&(document.querySelectorAll(".filter-tab").forEach(n=>n.classList.remove("active")),e.classList.add("active"),a=e.dataset.scope,document.getElementById("course-filter").style.display=a==="course"?"block":"none",await r())});l.addEventListener("change",r);async function r(){document.getElementById("rank-list").innerHTML='<div style="padding:3rem;text-align:center;color:var(--text-muted)">Loading...</div>',document.getElementById("podium-container").innerHTML='<div class="podium"><p style="color:var(--text-muted);padding:2rem">Loading...</p></div>';let t=[];try{if(a==="overall")t=await f();else if(a==="monthly"){const e=new Date;t=await k(e.getFullYear(),e.getMonth()+1)}else if(a==="course"){const e=l.value;if(!e){document.getElementById("rank-list").innerHTML='<div style="padding:3rem;text-align:center;color:var(--text-muted)">Course එකක් තෝරන්න</div>';return}t=await b(e)}}catch(e){document.getElementById("rank-list").innerHTML=`<div style="padding:2rem;text-align:center;color:var(--rose)">${e.message}</div>`;return}if(L(t.slice(0,3)),E(t),a==="overall"){const e=await $(s.id);e&&(document.getElementById("my-rank-bar").style.display="flex",document.getElementById("my-rank-val").textContent=`#${e.rank}`,document.getElementById("my-pts-val").textContent=`${e.total_points} pts`)}}function L(t){const e=[t[1],t[0],t[2]].filter(Boolean),n=["p2","p1","p3"],o=["🥈","👑","🥉"],u=["70px","100px","55px"];document.getElementById("podium-container").innerHTML=`
    <div class="podium">
      ${e.map((i,d)=>`
        <div class="podium-slot ${n[d]}">
          <div class="podium-avatar">
            <div class="crown">${o[d]}</div>
            ${i.full_name?.charAt(0)||"?"}
          </div>
          <div class="podium-name">${i.full_name}</div>
          <div class="podium-pts">${parseFloat(i.total_points).toFixed(1)} pts</div>
          <div class="podium-block" style="height:${u[d]}">#${i.rank}</div>
        </div>
      `).join("")}
    </div>
  `}function E(t){if(!t.length){document.getElementById("rank-list").innerHTML='<div style="padding:3rem;text-align:center;color:var(--text-muted)">ලකුණු ලබා ගත් සිසුන් නොමැත.</div>';return}document.getElementById("rank-list").innerHTML=t.map(e=>{const n=e.student_id===s.id,o=e.rank==1?"gold":e.rank==2?"silver":e.rank==3?"bronze":"";return`
      <div class="rank-row ${n?"mine":""}">
        <div class="rank-num ${o}">#${e.rank}</div>
        <div class="rank-avatar">${e.full_name?.charAt(0)}</div>
        <div style="flex:1">
          <div style="font-weight:700;color:var(--dark)">${e.full_name} ${n?'<span style="color:var(--teal);font-size:0.75rem">(ඔබ)</span>':""}</div>
        </div>
        <div class="pts-badge">${parseFloat(e.total_points).toFixed(1)} pts</div>
      </div>
    `}).join("")}c.channel("leaderboard-realtime").on("postgres_changes",{event:"*",schema:"public",table:"student_points"},()=>{r()}).subscribe();r();
