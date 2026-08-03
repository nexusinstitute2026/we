import{r as b}from"./auth-5l32Gasm.js";/* empty css              *//* empty css             *//* empty css               */import{b as E,c as x}from"./quiz-D9oBUwVb.js";import{f as I}from"./ui-CfSCUwhT.js";import"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";import"./leaderboard-vZXHCrjy.js";const g=await b(["student"]),v=new URLSearchParams(window.location.search),a=v.get("quiz"),_=v.get("local")==="1";a||(window.location.href="../dashboard/student.html");try{const o=await E(a);let n,l,s,c,d,m=null;if(_){const e=`quiz_local_result_${a}_${g.id}`,t=localStorage.getItem(e);if(!t)throw window.location.href="../pages/quiz.html?id="+a,new Error("__REDIRECT__");const r=JSON.parse(t);n=r.score,l=r.total,c=r.answers,d=r.timeTaken,s=Math.round(n/l*100);const i=document.createElement("div");i.style.cssText="background:rgba(234,179,8,0.15);border:1px solid rgba(251,191,36,0.3);color:#fbbf24;padding:0.75rem 1.25rem;border-radius:0.75rem;text-align:center;margin-bottom:1.5rem;font-family:Outfit,sans-serif;font-size:0.9rem;font-weight:600",i.innerHTML="📱 මෙම ප්‍රතිඵල ඔබේ browser හි පමණක් සුරැකී ඇත. (Results saved in your browser only)",document.querySelector(".container").prepend(i)}else{const e=await x(a,g.id);if(!e)throw window.location.href="../pages/quiz.html?id="+a,new Error("__REDIRECT__");n=e.score,l=o.questions.length,c=e.answers,d=e.time_taken,m=e.rank,s=Math.round(n/l*100)}s>=75&&confetti({particleCount:150,spread:80,origin:{y:.6},colors:["#0d9488","#f59e0b","#7c3aed"]}),document.getElementById("results-loader").style.display="none",document.getElementById("results-content").style.display="block",document.getElementById("quiz-title").textContent=o.title,document.getElementById("score-num").textContent=n,document.getElementById("score-total").textContent=`OUT OF ${l}`;const u=document.getElementById("ring-fill"),w=s/100*360-45;u.style.transform=`rotate(${w}deg)`,s<50&&(u.style.borderColor="var(--rose)"),m&&(document.getElementById("rank-container").style.display="block",document.getElementById("rank-num").textContent=`#${m}`),document.getElementById("stat-percentage").textContent=`${s}%`,document.getElementById("stat-time").textContent=I(d),document.getElementById("stat-correct").textContent=n;const f=o.answers_released===!0,y=o.questions.map((e,t)=>{const r=c?c[t]:null,i=r===e.correct;return`
      <div class="review-card-premium reveal">
        <div class="rev-q">${t+1}. ${e.text}</div>
        <div class="rev-list">
          ${r!==null&&!i?`
            <div class="rev-ans-box wrong">
              <div class="rev-icon"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></div>
              <div><strong>ඔබේ පිළිතුර (වැරදියි):</strong> ${e.options[r]}</div>
            </div>
          `:""}
          ${i||f?`
          <div class="rev-ans-box correct">
            <div class="rev-icon"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div>
            <div><strong>නිවැරදි පිළිතුර:</strong> ${e.options[e.correct]}</div>
          </div>
          `:`
          <div class="rev-ans-box pending" style="background:rgba(255,255,255,0.05); color:var(--text-muted); border: 1px dashed rgba(255,255,255,0.15)">
            <div><em>ගුරුවරයා අනුමත කළ පසු නිවැරදි පිළිතුර දිස්වනු ඇත.</em></div>
          </div>
          `}
        </div>
      </div>
    `}).join("");document.getElementById("review-list").innerHTML=y;const p=document.querySelectorAll(".reveal"),h=new IntersectionObserver(e=>{e.forEach(t=>{t.isIntersecting&&t.target.classList.add("visible")})},{threshold:.1});p.forEach(e=>h.observe(e))}catch(o){o.message!=="__REDIRECT__"&&console.error(o)}
