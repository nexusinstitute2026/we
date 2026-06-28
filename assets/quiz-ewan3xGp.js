import{c as y,k as p,s as v}from"./ui-BjnYUZX8.js";/* empty css              *//* empty css               */import{b as x,c as I,s as q}from"./quiz-DUCl9VTO.js";import"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";const h=await y(["student"]),$=new URLSearchParams(window.location.search),m=$.get("id");m||(window.location.href="../dashboard/student.html");let o=null,n=0,l={},w=0,c=null,r=0,i=[];try{if(await x(m,h.id)&&(window.location.href="../pages/quiz-results.html?quiz="+m),o=await I(m),!o||!o.questions||o.questions.length===0)throw new Error("Invalid quiz data");if(i=o.questions.map((e,s)=>({q:e,originalIdx:s})),o.shuffle)for(let e=i.length-1;e>0;e--){const s=Math.floor(Math.random()*(e+1));[i[e],i[s]]=[i[s],i[e]]}o.time_limit?(r=o.time_limit,document.getElementById("timer-text").textContent=p(r),k()):document.getElementById("timer-text").textContent="No Limit",w=Date.now(),u()}catch(t){console.error("CRITICAL:",t),document.getElementById("question-card").innerHTML=`
    <div style="text-align:center;padding:2rem;">
      <h3 style="margin-bottom:1rem">දෝෂයක් සිදුවිය</h3>
      <p style="color:var(--text-muted);margin-bottom:2rem">${t.message}</p>
      <button class="btn btn-teal" onclick="location.reload()">නැවත උත්සාහ කරන්න</button>
    </div>`}function k(){const t=document.getElementById("quiz-timer"),e=document.getElementById("timer-text");c=setInterval(()=>{r--,r<=0?(clearInterval(c),r=0,e.textContent="00:00",b()):(e.textContent=p(r),r<=60&&t.classList.add("urgent"))},1e3)}function u(){if(!i.length)return;const{q:t}=i[n],e=i.length,s=Object.keys(l).length;document.getElementById("progress-text").textContent=`Question ${n+1} of ${e}`,document.getElementById("progress-fill").style.width=`${(n+1)/e*100}%`,document.getElementById("answered-text").textContent=`${s}/${e} Answered`;const g=`
    <div class="q-meta">
      <span class="q-index">Question ${n+1}</span>
      ${l[n]!==void 0?`<span style="color:var(--teal2);font-size:0.78rem;font-weight:700;font-family:'Outfit',sans-serif">✓ Answered</span>`:`<span style="color:rgba(255,255,255,0.3);font-size:0.78rem;font-weight:700;font-family:'Outfit',sans-serif">Not Answered</span>`}
    </div>
    <div class="q-text-premium">${t.text}</div>
    <div class="options-list-premium">
      ${t.options.map((a,d)=>`
        <div class="opt-btn-premium ${l[n]===d?"selected":""}" onclick="selectOption(${d})">
          <div class="opt-label-premium">${String.fromCharCode(65+d)}</div>
          <span>${a}</span>
        </div>
      `).join("")}
    </div>
    <div class="quiz-footer-nav">
      <button class="btn btn-outline" onclick="prevQuestion()" ${n===0?"disabled":""} style="color:rgba(255,255,255,0.7); border-color:rgba(255,255,255,0.15); min-width:100px">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        Prev
      </button>
      <span class="eng" style="color:rgba(255,255,255,0.35);font-size:0.8rem;font-weight:600">${n+1} / ${e}</span>
      ${n===e-1?`<button class="btn btn-gold" onclick="document.getElementById('submit-btn').click()" style="min-width:130px">Finish &amp; Submit</button>`:'<button class="btn btn-teal" onclick="nextQuestion()" style="min-width:130px">Next <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg></button>'}
    </div>
  `;document.getElementById("question-card").innerHTML=g}window.selectOption=t=>{l[n]=t,u()};window.prevQuestion=()=>{n>0&&(n--,u())};window.nextQuestion=()=>{n<i.length-1&&(n++,u())};document.getElementById("submit-btn").addEventListener("click",()=>{const t=Object.keys(l).length;t<i.length&&!confirm(`ඔබ තවමත් ප්‍රශ්න ${i.length-t} කට පිළිතුරු දී නොමැත. Submit කිරීමට විශ්වාසද?`)||b()});async function b(){c&&clearInterval(c);const t=document.getElementById("submit-btn");t.disabled=!0,t.textContent="Submitting...";const e=o.questions.length,s=new Array(e).fill(null);i.forEach((a,d)=>{const f=l[d];f!==void 0&&(s[a.originalIdx]=f)});const g=Math.floor((Date.now()-w)/1e3);try{await q({quizId:o.id,studentId:h.id,answers:s,questions:o.questions,timeTaken:g}),window.location.href="../pages/quiz-results.html?quiz="+o.id}catch(a){console.error(a),v("Submit කිරීම අසාර්ථකයි","error"),t.disabled=!1,t.textContent="Submit Quiz"}}
