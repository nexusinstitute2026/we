import{c as v,k as f,s as x}from"./ui-xMALHD_f.js";/* empty css              *//* empty css               */import{b as y,c as q,s as I}from"./quiz-Cj2FsHW8.js";const b=await v(["student"]),k=new URLSearchParams(window.location.search),a=k.get("id");a||(window.location.href="/dashboard/student.html");let i=null,o=0,u={},h=0,d=null,l=0,n=[];try{if(await y(a,b.id)&&(window.location.href="/pages/quiz-results.html?quiz="+a),i=await q(a),!i||!i.questions||i.questions.length===0)throw new Error("Invalid quiz data");if(n=i.questions.map((e,s)=>({q:e,originalIdx:s})),i.shuffle)for(let e=n.length-1;e>0;e--){const s=Math.floor(Math.random()*(e+1));[n[e],n[s]]=[n[s],n[e]]}i.time_limit?(l=i.time_limit,document.getElementById("timer-text").textContent=f(l),E()):document.getElementById("timer-text").textContent="No Limit",h=Date.now(),m()}catch(t){console.error("CRITICAL:",t),document.getElementById("question-card").innerHTML=`
    <div style="text-align:center;padding:2rem;">
      <h3 style="margin-bottom:1rem">දෝෂයක් සිදුවිය</h3>
      <p style="color:var(--text-muted);margin-bottom:2rem">${t.message}</p>
      <button class="btn btn-teal" onclick="location.reload()">නැවත උත්සාහ කරන්න</button>
    </div>`}function E(){const t=document.getElementById("quiz-timer"),e=document.getElementById("timer-text");d=setInterval(()=>{l--,l<=0?(clearInterval(d),l=0,e.textContent="00:00",p()):(e.textContent=f(l),l<=60&&t.classList.add("urgent"))},1e3)}function m(){if(!n.length)return;const{q:t}=n[o],e=n.length;document.getElementById("progress-text").textContent=`Question ${o+1} of ${e}`,document.getElementById("progress-fill").style.width=`${(o+1)/e*100}%`;const s=`
    <div class="q-meta">
      <span class="q-index">Question ${o+1}</span>
    </div>
    <div class="q-text-premium">${t.text}</div>
    <div class="options-list-premium">
      ${t.options.map((c,r)=>`
        <div class="opt-btn-premium ${u[o]===r?"selected":""}" onclick="selectOption(${r})">
          <div class="opt-label-premium">${String.fromCharCode(65+r)}</div>
          <span>${c}</span>
        </div>
      `).join("")}
    </div>
    <div class="quiz-footer-nav">
      <button class="btn btn-outline" onclick="prevQuestion()" ${o===0?"disabled":""} style="color:#fff; border-color:rgba(255,255,255,0.1)">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        Prev
      </button>
      ${o===e-1?`<button class="btn btn-gold" onclick="document.getElementById('submit-btn').click()">Finish & Submit</button>`:'<button class="btn btn-teal" onclick="nextQuestion()">Next Question <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg></button>'}
    </div>
  `;document.getElementById("question-card").innerHTML=s}window.selectOption=t=>{u[o]=t,m()};window.prevQuestion=()=>{o>0&&(o--,m())};window.nextQuestion=()=>{o<n.length-1&&(o++,m())};document.getElementById("submit-btn").addEventListener("click",()=>{const t=Object.keys(u).length;t<n.length&&!confirm(`ඔබ තවමත් ප්‍රශ්න ${n.length-t} කට පිළිතුරු දී නොමැත. Submit කිරීමට විශ්වාසද?`)||p()});async function p(){d&&clearInterval(d);const t=document.getElementById("submit-btn");t.disabled=!0,t.textContent="Submitting...";const e=i.questions.length,s=new Array(e).fill(null);n.forEach((r,w)=>{const g=u[w];g!==void 0&&(s[r.originalIdx]=g)});const c=Math.floor((Date.now()-h)/1e3);try{await I({quizId:i.id,studentId:b.id,answers:s,questions:i.questions,timeTaken:c}),window.location.href="/pages/quiz-results.html?quiz="+i.id}catch(r){console.error(r),x("Submit කිරීම අසාර්ථකයි","error"),t.disabled=!1,t.textContent="Submit Quiz"}}
