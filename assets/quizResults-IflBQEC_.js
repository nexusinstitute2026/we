import{c as h,k as w}from"./ui-BjnYUZX8.js";/* empty css              *//* empty css               */import{c as p,b as f}from"./quiz-DUCl9VTO.js";import"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";const x=await h(["student"]),b=new URLSearchParams(window.location.search),s=b.get("quiz");s||(window.location.href="../dashboard/student.html");try{const[t,o]=await Promise.all([p(s),f(s,x.id)]);o||(window.location.href="../pages/quiz.html?id="+s);const c=t.questions.length,i=o.score,r=Math.round(i/c*100);r>=75&&confetti({particleCount:150,spread:80,origin:{y:.6},colors:["#0d9488","#f59e0b","#7c3aed"]}),document.getElementById("results-loader").style.display="none",document.getElementById("results-content").style.display="block",document.getElementById("quiz-title").textContent=t.title,document.getElementById("score-num").textContent=i,document.getElementById("score-total").textContent=`OUT OF ${c}`;const l=document.getElementById("ring-fill"),m=r/100*360-45;l.style.transform=`rotate(${m}deg)`,r<50&&(l.style.borderColor="var(--rose)"),o.rank&&(document.getElementById("rank-container").style.display="block",document.getElementById("rank-num").textContent=`#${o.rank}`),document.getElementById("stat-percentage").textContent=`${r}%`,document.getElementById("stat-time").textContent=w(o.time_taken),document.getElementById("stat-correct").textContent=i;const v=t.answers_released===!0,u=t.questions.map((e,n)=>{const d=o.answers[n],a=d===e.correct;return`
      <div class="review-card-premium reveal">
        <div class="rev-q">${n+1}. ${e.text}</div>
        <div class="rev-list">
          ${d!==null&&!a?`
            <div class="rev-ans-box wrong">
              <div class="rev-icon"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></div>
              <div><strong>ඔබේ පිළිතුර (වැරදියි):</strong> ${e.options[d]}</div>
            </div>
          `:""}
          ${a||v?`
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
    `}).join("");document.getElementById("review-list").innerHTML=u;const g=document.querySelectorAll(".reveal"),y=new IntersectionObserver(e=>{e.forEach(n=>{n.isIntersecting&&n.target.classList.add("visible")})},{threshold:.1});g.forEach(e=>y.observe(e))}catch(t){console.error(t),showToast("Results පූරණය කිරීමේදී දෝෂයක්","error")}
