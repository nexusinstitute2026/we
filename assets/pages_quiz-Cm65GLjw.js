import{r as x}from"./auth-qdlMy9e7.js";/* empty css              *//* empty css             *//* empty css               */import{c as y,b as v,s as I}from"./quiz-CdZykAFh.js";import{f as h,s as q}from"./ui-CfSCUwhT.js";import"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";import"./leaderboard-P9WSWk3A.js";const p=await x(["student"]),$=new URLSearchParams(window.location.search),u=$.get("id");u||(window.location.href="../dashboard/student.html");let o=null,i=0,m={},w=0,c=null,d=0,s=[];try{if(await y(u,p.id)&&(window.location.href="../pages/quiz-results.html?quiz="+u),o=await v(u),!o||!o.questions||o.questions.length===0)throw new Error("Invalid quiz data");if(o.is_closed)throw new Error("මෙම ප්‍රශ්න පත්‍රයට පිළිතුරු භාරගැනීම නතර කර ඇත.");if(s=o.questions.map((t,l)=>{let r=t.options.map((n,a)=>({text:n,originalIdx:a}));if(o.shuffle_answers)for(let n=r.length-1;n>0;n--){const a=Math.floor(Math.random()*(n+1));[r[n],r[a]]=[r[a],r[n]]}return{q:t,originalIdx:l,shuffledOptions:r}}),o.shuffle)for(let t=s.length-1;t>0;t--){const l=Math.floor(Math.random()*(t+1));[s[t],s[l]]=[s[l],s[t]]}o.time_limit?(d=o.time_limit,document.getElementById("timer-text").textContent=h(d),E()):document.getElementById("timer-text").textContent="No Limit",w=Date.now(),f()}catch(e){console.error("CRITICAL:",e),document.getElementById("question-card").innerHTML=`
    <div style="text-align:center;padding:2rem;">
      <h3 style="margin-bottom:1rem">දෝෂයක් සිදුවිය</h3>
      <p style="color:var(--text-muted);margin-bottom:2rem">${e.message}</p>
      <button class="btn btn-teal" onclick="location.reload()">නැවත උත්සාහ කරන්න</button>
    </div>`}function E(){const e=document.getElementById("quiz-timer"),t=document.getElementById("timer-text");c=setInterval(()=>{d--,d<=0?(clearInterval(c),d=0,t.textContent="00:00",b()):(t.textContent=h(d),d<=60&&e.classList.add("urgent"))},1e3)}function f(){if(!s.length)return;const{q:e}=s[i],t=s.length,l=Object.keys(m).length;document.getElementById("progress-text").textContent=`Question ${i+1} of ${t}`,document.getElementById("progress-fill").style.width=`${(i+1)/t*100}%`,document.getElementById("answered-text").textContent=`${l}/${t} Answered`;const r=`
    <div class="q-meta">
      <span class="q-index">Question ${i+1}</span>
      ${m[i]!==void 0?`<span style="color:var(--teal2);font-size:0.78rem;font-weight:700;font-family:'Outfit',sans-serif">✓ Answered</span>`:`<span style="color:rgba(255,255,255,0.3);font-size:0.78rem;font-weight:700;font-family:'Outfit',sans-serif">Not Answered</span>`}
    </div>
    <div class="q-text-premium">${e.text}</div>
    <div class="options-list-premium">
      ${s[i].shuffledOptions.map((n,a)=>`
        <div class="opt-btn-premium ${m[i]===n.originalIdx?"selected":""}" onclick="selectOption(${n.originalIdx})">
          <div class="opt-label-premium">${String.fromCharCode(65+a)}</div>
          <span>${n.text}</span>
        </div>
      `).join("")}
    </div>
    <div class="quiz-footer-nav">
      <button class="btn btn-outline" onclick="prevQuestion()" ${i===0?"disabled":""} style="color:rgba(255,255,255,0.7); border-color:rgba(255,255,255,0.15); min-width:100px">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        Prev
      </button>
      <span class="eng" style="color:rgba(255,255,255,0.35);font-size:0.8rem;font-weight:600">${i+1} / ${t}</span>
      ${i===t-1?`<button class="btn btn-gold" onclick="document.getElementById('submit-btn').click()" style="min-width:130px">Finish &amp; Submit</button>`:'<button class="btn btn-teal" onclick="nextQuestion()" style="min-width:130px">Next <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg></button>'}
    </div>
  `;document.getElementById("question-card").innerHTML=r}window.selectOption=e=>{m[i]=e,f()};window.prevQuestion=()=>{i>0&&(i--,f())};window.nextQuestion=()=>{i<s.length-1&&(i++,f())};document.getElementById("submit-btn").addEventListener("click",()=>{const e=Object.keys(m).length;e<s.length&&!confirm(`ඔබ තවමත් ප්‍රශ්න ${s.length-e} කට පිළිතුරු දී නොමැත. Submit කිරීමට විශ්වාසද?`)||b()});async function b(){c&&clearInterval(c);const e=document.getElementById("submit-btn");e.disabled=!0,e.textContent="Submitting...";const t=o.questions.length,l=new Array(t).fill(null);s.forEach((n,a)=>{const g=m[a];g!==void 0&&(l[n.originalIdx]=g)});const r=Math.floor((Date.now()-w)/1e3);try{await I({quizId:o.id,studentId:p.id,answers:l,questions:o.questions,timeTaken:r}),window.location.href="../pages/quiz-results.html?quiz="+o.id}catch(n){console.error(n),q("Submit කිරීම අසාර්ථකයි","error"),e.disabled=!1,e.textContent="Submit Quiz"}}
